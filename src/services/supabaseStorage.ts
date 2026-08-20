import { supabase } from './supabase';
import type { Movie, UserData, UserMovieRow } from '../types';

/**
 * Converts a database row from `user_movies` into the application's `Movie` model.
 */
function rowToMovie(row: UserMovieRow): Movie {
  return {
    imdbID: row.imdb_id,
    title: row.title,
    year: row.year || '',
    poster: row.poster || '',
    director: row.director || '',
    actors: row.actors || undefined,
    plot: row.plot || undefined,
    genre: row.genre || undefined,
    imdbRating: row.imdb_rating || undefined,
    runtime: row.runtime || undefined,
    countryRaw: row.country_raw || '',
    countryCodes: row.country_codes || [],
    userRating: row.user_rating ?? undefined,
    userNote: row.user_note ?? undefined,
    addedAt: row.added_at || Date.now(),
  };
}

/**
 * Converts a `Movie` object into a database row payload for Supabase.
 */
function movieToRow(movie: Movie, userId: string): Omit<UserMovieRow, 'id' | 'created_at'> {
  return {
    user_id: userId,
    imdb_id: movie.imdbID,
    title: movie.title,
    year: movie.year || null,
    poster: movie.poster || null,
    director: movie.director || null,
    actors: movie.actors || null,
    plot: movie.plot || null,
    genre: movie.genre || null,
    imdb_rating: movie.imdbRating || null,
    runtime: movie.runtime || null,
    country_raw: movie.countryRaw || null,
    country_codes: movie.countryCodes || [],
    user_rating: movie.userRating ?? null,
    user_note: movie.userNote ?? null,
    added_at: movie.addedAt || Date.now(),
  };
}

/**
 * Loads all movies for the authenticated user from Supabase and transforms them into `UserData`.
 */
export async function fetchUserDataFromSupabase(userId: string): Promise<UserData> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  const { data, error } = await supabase
    .from('user_movies')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('Erreur lors du chargement des films depuis Supabase:', error);
    throw error;
  }

  const movies: Record<string, Movie> = {};
  const countryMovies: Record<string, string[]> = {};

  (data as UserMovieRow[] || []).forEach((row) => {
    const movie = rowToMovie(row);
    movies[movie.imdbID] = movie;

    (movie.countryCodes || []).forEach((code) => {
      if (!countryMovies[code]) {
        countryMovies[code] = [];
      }
      if (!countryMovies[code].includes(movie.imdbID)) {
        countryMovies[code].push(movie.imdbID);
      }
    });
  });

  return {
    movies,
    countryMovies,
  };
}

/**
 * Adds or updates a movie in Supabase for the authenticated user.
 */
export async function addMovieToSupabase(
  movie: Movie,
  selectedCountryCodes: string[],
  userId: string,
  existingMovie?: Movie
): Promise<Movie> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  const combinedCountryCodes = Array.from(
    new Set([...(existingMovie?.countryCodes || []), ...selectedCountryCodes])
  );

  const movieToSave: Movie = {
    ...movie,
    countryCodes: combinedCountryCodes,
    addedAt: existingMovie?.addedAt || movie.addedAt || Date.now(),
  };

  const payload = movieToRow(movieToSave, userId);

  const { error } = await supabase
    .from('user_movies')
    .upsert(payload, { onConflict: 'user_id,imdb_id' });

  if (error) {
    console.error('Erreur lors de l\'ajout du film sur Supabase:', error);
    throw error;
  }

  return movieToSave;
}

/**
 * Removes a country association from a movie in Supabase.
 * If the movie has no more country associations, it is deleted from the table.
 */
export async function removeMovieFromSupabase(
  imdbID: string,
  countryCode: string,
  currentMovie: Movie,
  userId: string
): Promise<{ remainingCodes: string[]; isDeleted: boolean }> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  const remainingCodes = (currentMovie.countryCodes || []).filter((c) => c !== countryCode);

  if (remainingCodes.length === 0) {
    // Delete the movie row completely
    const { error } = await supabase
      .from('user_movies')
      .delete()
      .match({ user_id: userId, imdb_id: imdbID });

    if (error) {
      console.error('Erreur lors de la suppression du film sur Supabase:', error);
      throw error;
    }

    return { remainingCodes: [], isDeleted: true };
  } else {
    // Update the movie with remaining country codes
    const { error } = await supabase
      .from('user_movies')
      .update({ country_codes: remainingCodes })
      .match({ user_id: userId, imdb_id: imdbID });

    if (error) {
      console.error('Erreur lors de la mise à jour des pays sur Supabase:', error);
      throw error;
    }

    return { remainingCodes, isDeleted: false };
  }
}

/**
 * Updates user rating and user note for a movie in Supabase.
 */
export async function updateMovieInSupabase(
  imdbID: string,
  updates: Partial<Pick<Movie, 'userRating' | 'userNote'>>,
  userId: string
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  const payload: Partial<UserMovieRow> = {};
  if (updates.userRating !== undefined) payload.user_rating = updates.userRating;
  if (updates.userNote !== undefined) payload.user_note = updates.userNote;

  const { error } = await supabase
    .from('user_movies')
    .update(payload)
    .match({ user_id: userId, imdb_id: imdbID });

  if (error) {
    console.error('Erreur lors de la mise à jour de la note/critique sur Supabase:', error);
    throw error;
  }
}

/**
 * Migrates local storage data to Supabase in a batch.
 */
export async function bulkMigrateLocalDataToSupabase(
  localData: UserData,
  userId: string
): Promise<{ count: number }> {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré');
  }

  const movieList = Object.values(localData.movies || {});
  if (movieList.length === 0) {
    return { count: 0 };
  }

  const rows = movieList.map((movie) => movieToRow(movie, userId));

  const { error } = await supabase
    .from('user_movies')
    .upsert(rows, { onConflict: 'user_id,imdb_id' });

  if (error) {
    console.error('Erreur lors de la migration locale vers Supabase:', error);
    throw error;
  }

  return { count: rows.length };
}
