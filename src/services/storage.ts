import type { Movie, UserData } from '../types';


const STORAGE_KEY = 'worldwidemovie_data_v1';

const DEFAULT_USER_DATA: UserData = {
  movies: {},
  countryMovies: {}
};

export function loadUserData(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_DATA;
    const parsed = JSON.parse(raw);
    return {
      movies: parsed.movies || {},
      countryMovies: parsed.countryMovies || {}
    };
  } catch (error) {
    console.error('Failed to load user data from localStorage', error);
    return DEFAULT_USER_DATA;
  }
}

export function saveUserData(data: UserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save user data to localStorage', error);
  }
}

/**
 * Adds a movie and associates it with one or more countries (co-productions).
 */
export function addMovieToStorage(
  movie: Movie,
  selectedCountryCodes: string[],
  currentData: UserData
): { updatedData: UserData; newlyUnlockedCountries: string[] } {
  const updatedMovies = { ...currentData.movies };
  const updatedCountryMovies = { ...currentData.countryMovies };
  const newlyUnlockedCountries: string[] = [];

  // Update or set movie
  const existingMovie = updatedMovies[movie.imdbID];
  const combinedCountryCodes = Array.from(
    new Set([...(existingMovie?.countryCodes || []), ...selectedCountryCodes])
  );

  updatedMovies[movie.imdbID] = {
    ...movie,
    countryCodes: combinedCountryCodes,
    addedAt: existingMovie?.addedAt || movie.addedAt || Date.now()
  };

  selectedCountryCodes.forEach((code) => {
    const currentList = updatedCountryMovies[code] || [];
    if (currentList.length === 0) {
      newlyUnlockedCountries.push(code);
    }
    if (!currentList.includes(movie.imdbID)) {
      updatedCountryMovies[code] = [...currentList, movie.imdbID];
    }
  });

  const nextData: UserData = {
    ...currentData,
    movies: updatedMovies,
    countryMovies: updatedCountryMovies
  };

  saveUserData(nextData);
  return { updatedData: nextData, newlyUnlockedCountries };
}

/**
 * Removes a movie from a specific country.
 * If the movie is not attached to any other country, it will also be removed from movies dictionary.
 */
export function removeMovieFromStorage(
  imdbID: string,
  countryCode: string,
  currentData: UserData
): UserData {
  const updatedMovies = { ...currentData.movies };
  const updatedCountryMovies = { ...currentData.countryMovies };

  // Remove from country mapping
  if (updatedCountryMovies[countryCode]) {
    updatedCountryMovies[countryCode] = updatedCountryMovies[countryCode].filter(
      (id) => id !== imdbID
    );
    if (updatedCountryMovies[countryCode].length === 0) {
      delete updatedCountryMovies[countryCode];
    }
  }

  // Update movie countryCodes
  if (updatedMovies[imdbID]) {
    const nextCodes = (updatedMovies[imdbID].countryCodes || []).filter(
      (c) => c !== countryCode
    );
    if (nextCodes.length === 0) {
      delete updatedMovies[imdbID];
    } else {
      updatedMovies[imdbID] = {
        ...updatedMovies[imdbID],
        countryCodes: nextCodes
      };
    }
  }

  const nextData: UserData = {
    ...currentData,
    movies: updatedMovies,
    countryMovies: updatedCountryMovies
  };

  saveUserData(nextData);
  return nextData;
}

/**
 * Updates movie rating / notes
 */
export function updateMovieInStorage(
  imdbID: string,
  updates: Partial<Pick<Movie, 'userRating' | 'userNote'>>,
  currentData: UserData
): UserData {
  if (!currentData.movies[imdbID]) return currentData;

  const nextData: UserData = {
    ...currentData,
    movies: {
      ...currentData.movies,
      [imdbID]: {
        ...currentData.movies[imdbID],
        ...updates
      }
    }
  };

  saveUserData(nextData);
  return nextData;
}

/**
 * Export data to JSON file
 */
export function exportDataToJson(data: UserData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `worldwidemovie_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON string
 */
export function importDataFromJson(jsonStr: string): UserData {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Format JSON invalide');
  }
  const validData: UserData = {
    movies: parsed.movies || {},
    countryMovies: parsed.countryMovies || {}
  };
  saveUserData(validData);
  return validData;
}
