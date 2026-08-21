import { supabase } from './supabase';
import type { Country, Movie, TMDBMovieDetail, TMDBSearchResult } from '../types';

const DIRECT_TMDB_API_KEY = (import.meta.env.VITE_TMDB_API_KEY as string | undefined)?.trim() || '';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * Searches movies via Supabase Edge Function proxy (or direct TMDB fallback).
 */
export async function searchMoviesTMDB(query: string): Promise<TMDBSearchResult[]> {
  if (!query.trim()) return [];

  // 1. Try via Supabase Edge Function proxy
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('tmdb-proxy', {
        body: {
          action: 'search',
          query: query.trim(),
          language: 'fr-FR',
        },
      });

      if (!error && data && Array.isArray(data.results)) {
        return data.results as TMDBSearchResult[];
      }
      if (error) {
        console.warn('Erreur Edge Function TMDB proxy:', error);
      }
    } catch (e) {
      console.warn('Impossible de joindre l\'Edge Function TMDB:', e);
    }
  }

  // 2. Fallback to direct client call if VITE_TMDB_API_KEY is configured
  if (DIRECT_TMDB_API_KEY) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${DIRECT_TMDB_API_KEY}&query=${encodeURIComponent(
      query.trim()
    )}&language=fr-FR&include_adult=false`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur de communication avec TMDB');
    const data = await res.json();
    return (data.results || []) as TMDBSearchResult[];
  }

  throw new Error(
    'L\'Edge Function "tmdb-proxy" n\'est pas encore déployée sur Supabase ou la clé TMDB_API_KEY est manquante.'
  );
}

/**
 * Gets full movie details via Supabase Edge Function proxy.
 */
export async function getMovieDetailsTMDB(id: number | string): Promise<TMDBMovieDetail> {
  // 1. Try via Supabase Edge Function proxy
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('tmdb-proxy', {
        body: {
          action: 'detail',
          id,
          language: 'fr-FR',
        },
      });

      if (!error && data && data.id) {
        return data as TMDBMovieDetail;
      }
      if (error) {
        console.warn('Erreur Edge Function TMDB detail:', error);
      }
    } catch (e) {
      console.warn('Impossible de joindre l\'Edge Function TMDB:', e);
    }
  }

  // 2. Fallback to direct client call if VITE_TMDB_API_KEY is configured
  if (DIRECT_TMDB_API_KEY) {
    const url = `https://api.themoviedb.org/3/movie/${encodeURIComponent(
      String(id)
    )}?api_key=${DIRECT_TMDB_API_KEY}&language=fr-FR&append_to_response=credits,external_ids`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur lors de la récupération des détails sur TMDB');
    return (await res.json()) as TMDBMovieDetail;
  }

  throw new Error(
    'L\'Edge Function "tmdb-proxy" n\'a pas pu renvoyer les détails du film.'
  );
}

/**
 * Extracts matched country objects from TMDB movie detail.
 * TMDB natively gives ISO 3166-1 2-letter country codes (e.g. "FR", "US", "KR", "JP").
 */
export function matchCountriesFromTMDB(detail: TMDBMovieDetail, allCountries: Country[]): Country[] {
  const matchedCodes = new Set<string>();

  // 1. Production countries ISO codes
  (detail.production_countries || []).forEach((pc) => {
    if (pc.iso_3166_1) {
      matchedCodes.add(pc.iso_3166_1.toUpperCase());
    }
  });

  // 2. Origin country codes
  (detail.origin_country || []).forEach((code) => {
    if (code) {
      matchedCodes.add(code.toUpperCase());
    }
  });

  const result: Country[] = [];

  matchedCodes.forEach((code) => {
    const country = allCountries.find(
      (c) => c.code.toUpperCase() === code || c.cca3.toUpperCase() === code
    );
    if (country && !result.some((r) => r.code === country.code)) {
      result.push(country);
    }
  });

  return result;
}

/**
 * Helper to build full poster URL from TMDB poster_path
 */
export function getTMDBPosterUrl(posterPath?: string | null): string {
  if (!posterPath) return '';
  if (posterPath.startsWith('http')) return posterPath;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

/**
 * Converts a TMDB detail object into the internal Movie model.
 */
export function convertTMDBToMovie(detail: TMDBMovieDetail, matchedCountryCodes: string[]): Movie {
  const releaseYear = detail.release_date ? detail.release_date.slice(0, 4) : '';
  const poster = getTMDBPosterUrl(detail.poster_path);

  // Find Director(s)
  const directors = (detail.credits?.crew || [])
    .filter((member) => member.job === 'Director')
    .map((member) => member.name);
  const director = directors.length > 0 ? directors.join(', ') : 'Inconnu';

  // Find top 4 actors
  const actors = (detail.credits?.cast || [])
    .slice(0, 4)
    .map((member) => member.name)
    .join(', ');

  const genres = (detail.genres || []).map((g) => g.name).join(', ');
  const runtime = detail.runtime ? `${detail.runtime} min` : undefined;
  const rating = detail.vote_average ? `${detail.vote_average.toFixed(1)}/10` : undefined;
  const countryRaw = (detail.production_countries || []).map((p) => p.name).join(', ');

  // Use IMDb ID if available, otherwise fallback to "tmdb-ID"
  const imdbID = detail.external_ids?.imdb_id || `tmdb-${detail.id}`;

  return {
    imdbID,
    title: detail.title || detail.original_title,
    year: releaseYear,
    poster,
    director,
    actors: actors || undefined,
    plot: detail.overview || undefined,
    genre: genres || undefined,
    imdbRating: rating,
    runtime,
    countryRaw: countryRaw || 'Inconnu',
    countryCodes: matchedCountryCodes,
    addedAt: Date.now(),
  };
}
