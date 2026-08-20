export interface Country {
  code: string; // ISO 2-letter (cca2, e.g. "FR")
  cca3: string; // ISO 3-letter (e.g. "FRA")
  name: string; // Common English name (e.g. "France")
  frenchName: string; // French name (e.g. "France", "États-Unis")
  continent: Continent; // Europe, Asia, Africa, Americas, Oceania, Antarctic
  flag: string; // Emoji flag (e.g. "🇫🇷")
  flagUrl?: string; // SVG or PNG flag URL
  aliases: string[]; // Variations (e.g. ["USA", "United States of America", "US", "Etats-Unis"])
}

export type Continent = 'Europe' | 'Asie' | 'Afrique' | 'Amériques' | 'Océanie' | 'Antarctique';

export interface Movie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  director: string;
  actors?: string;
  plot?: string;
  genre?: string;
  imdbRating?: string;
  runtime?: string;
  countryRaw: string; // OMDb country string (e.g. "France, Italy, United States")
  countryCodes: string[]; // List of matched cca2 codes
  addedAt: number;
  userRating?: number; // 1-5
  userNote?: string;
}

export interface OMDbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDbMovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Response: string;
  Error?: string;
}

export interface UserData {
  movies: Record<string, Movie>; // Keyed by imdbID
  // Mapping of countryCode -> list of imdbIDs
  countryMovies: Record<string, string[]>;
  omdbApiKey?: string;
}

export interface UserMovieRow {
  id?: string;
  user_id: string;
  imdb_id: string;
  title: string;
  year?: string | null;
  poster?: string | null;
  director?: string | null;
  actors?: string | null;
  plot?: string | null;
  genre?: string | null;
  imdb_rating?: string | null;
  runtime?: string | null;
  country_raw?: string | null;
  country_codes: string[];
  user_rating?: number | null;
  user_note?: string | null;
  added_at: number;
  created_at?: string;
}
