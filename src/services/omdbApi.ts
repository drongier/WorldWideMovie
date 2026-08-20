import type { Country, Movie, OMDbMovieDetail, OMDbSearchResult } from '../types';


export async function searchMoviesOMDb(query: string, apiKey: string): Promise<OMDbSearchResult[]> {
  if (!query.trim()) return [];
  const key = apiKey.trim();
  if (!key) {
    throw new Error('Veuillez configurer votre clé API OMDb pour effectuer des recherches.');
  }
  const url = `https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}&s=${encodeURIComponent(query.trim())}&type=movie`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'True' && Array.isArray(data.Search)) {
    return data.Search;
  }
  if (data.Error) {
    throw new Error(data.Error);
  }
  return [];
}

export async function getMovieDetailsOMDb(imdbID: string, apiKey: string): Promise<OMDbMovieDetail> {
  const key = apiKey.trim();
  if (!key) {
    throw new Error('Veuillez configurer votre clé API OMDb pour afficher les détails.');
  }
  const url = `https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}&i=${encodeURIComponent(imdbID)}&plot=full`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'True') {
    return data as OMDbMovieDetail;
  }
  throw new Error(data.Error || 'Impossible de récupérer les détails du film.');
}


/**
 * Parses raw country string from OMDb (e.g. "France, Italy, United States")
 * and matches with countries in the system.
 */
export function matchCountriesFromRawString(rawCountry: string, allCountries: Country[]): Country[] {
  if (!rawCountry || rawCountry === 'N/A') return [];

  const rawNames = rawCountry
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const matchedCountries = new Map<string, Country>();

  rawNames.forEach((raw) => {
    const normalizedRaw = raw.toLowerCase().trim();

    // Special cases
    if (normalizedRaw === 'czechoslovakia' || normalizedRaw === 'tchécoslovaquie') {
      const cz = allCountries.find((c) => c.code === 'CZ');
      const sk = allCountries.find((c) => c.code === 'SK');
      if (cz) matchedCountries.set(cz.code, cz);
      if (sk) matchedCountries.set(sk.code, sk);
      return;
    }

    if (normalizedRaw === 'yugoslavia' || normalizedRaw === 'yougoslavie') {
      const rs = allCountries.find((c) => c.code === 'RS');
      const hr = allCountries.find((c) => c.code === 'HR');
      if (rs) matchedCountries.set(rs.code, rs);
      if (hr) matchedCountries.set(hr.code, hr);
      return;
    }

    // Exact or alias match
    let found = allCountries.find((c) => {
      if (c.name.toLowerCase() === normalizedRaw) return true;
      if (c.frenchName.toLowerCase() === normalizedRaw) return true;
      if (c.code.toLowerCase() === normalizedRaw) return true;
      if (c.cca3.toLowerCase() === normalizedRaw) return true;
      return c.aliases.some((alias) => alias.toLowerCase() === normalizedRaw);
    });

    // Fuzzy contains match if not found
    if (!found) {
      found = allCountries.find((c) => {
        return c.aliases.some((alias) => {
          const a = alias.toLowerCase();
          return a.includes(normalizedRaw) || normalizedRaw.includes(a);
        });
      });
    }

    if (found) {
      matchedCountries.set(found.code, found);
    }
  });

  return Array.from(matchedCountries.values());
}

/**
 * Helper to convert OMDb detail to our internal Movie format
 */
export function convertOMDbToMovie(detail: OMDbMovieDetail, matchedCountryCodes: string[]): Movie {
  return {
    imdbID: detail.imdbID,
    title: detail.Title,
    year: detail.Year,
    poster: detail.Poster !== 'N/A' ? detail.Poster : '',
    director: detail.Director !== 'N/A' ? detail.Director : 'Inconnu',
    actors: detail.Actors !== 'N/A' ? detail.Actors : undefined,
    plot: detail.Plot !== 'N/A' ? detail.Plot : undefined,
    genre: detail.Genre !== 'N/A' ? detail.Genre : undefined,
    imdbRating: detail.imdbRating !== 'N/A' ? detail.imdbRating : undefined,
    runtime: detail.Runtime !== 'N/A' ? detail.Runtime : undefined,
    countryRaw: detail.Country || '',
    countryCodes: matchedCountryCodes,
    addedAt: Date.now()
  };
}
