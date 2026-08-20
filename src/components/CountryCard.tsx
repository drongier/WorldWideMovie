import React, { useState } from 'react';
import type { Country, Movie } from '../types';

import { MovieCard } from './MovieCard';
import { Plus, ChevronDown, ChevronUp, CheckCircle2, Film, ExternalLink } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  movies: Movie[];
  allCountries: Country[];
  onOpenSearchForCountry: (country: Country) => void;
  onRemoveMovie: (imdbID: string, countryCode: string) => void;
  onUpdateMovie: (
    imdbID: string,
    updates: Partial<Pick<Movie, 'userRating' | 'userNote'>>
  ) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({
  country,
  movies,
  allCountries,
  onOpenSearchForCountry,
  onRemoveMovie,
  onUpdateMovie
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasMovies = movies.length > 0;

  return (
    <div
      id={`country-${country.code}`}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        hasMovies
          ? 'bg-slate-900/80 border-slate-700/80 shadow-lg shadow-black/20 hover:border-slate-600'
          : 'bg-slate-900/40 border-slate-800/60 opacity-85 hover:opacity-100 hover:border-slate-700'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
        <div className="flex items-center space-x-3.5">
          <span className="text-3xl sm:text-4xl select-none transform transition-transform group-hover:scale-110">
            {country.flag}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-white m-0">
                {country.frenchName}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                ({country.code})
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">
              {country.name} • <span className="text-slate-500">{country.continent}</span>
            </p>
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center space-x-2.5 self-end sm:self-center">
          {hasMovies ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {movies.length} film{movies.length > 1 ? 's' : ''} vu{movies.length > 1 ? 's' : ''}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/80 text-xs font-medium">
              <span>🎯 À découvrir</span>
            </span>
          )}

          {/* Add movie button */}
          <button
            onClick={() => onOpenSearchForCountry(country)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
            title={`Ajouter un film pour ${country.frenchName}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>

          {/* Toggle Expand/Collapse */}
          {hasMovies && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isExpanded ? 'Réduire' : 'Développer'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Movies Content list */}
      {hasMovies && isExpanded && (
        <div className="p-4 sm:p-5 pt-0 space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-3 border-t border-slate-800/80">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                currentCountryCode={country.code}
                allCountries={allCountries}
                onRemove={onRemoveMovie}
                onUpdateMovie={onUpdateMovie}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State when no movie */}
      {!hasMovies && (
        <div className="px-5 py-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <span className="italic flex items-center space-x-1.5">
            <Film className="w-3.5 h-3.5 text-slate-600" />
            <span>Aucun film enregistré pour le moment.</span>
          </span>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`Liste film ${country.frenchName}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium hover:underline text-[11px] bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/20 transition-all"
            title={`Rechercher des idées de films sur Google pour ${country.frenchName}`}
          >
            <span>Liste films {country.frenchName}</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      )}
    </div>
  );
};

