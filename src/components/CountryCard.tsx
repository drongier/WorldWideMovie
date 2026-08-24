import React, { useState } from 'react';
import type { Country, Movie } from '../types';

import { MovieCard } from './MovieCard';
import { Plus, ChevronDown, ChevronUp, CheckCircle2, ExternalLink, Film, Star } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMovies = movies.length > 0;

  return (
    <div
      id={`country-${country.code}`}
      className={`transition-colors border-b border-[#162740] last:border-b-0 ${
        hasMovies
          ? 'bg-[#0a1728] hover:bg-[#0f2139]'
          : 'bg-[#070e1a]/90 hover:bg-[#0c192c]'
      }`}
    >
      {/* Country Row */}
      <div className="py-2.5 px-3 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Left: Flag & Country Identification */}
        <div className="flex items-center space-x-3 min-w-[220px]">
          <span className="text-2xl select-none filter drop-shadow-sm shrink-0">
            {country.flag}
          </span>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-white tracking-wide font-sans truncate">
                {country.frenchName}
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#040812] text-amber-300 border border-[#1e3a8a]">
                {country.code}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 m-0 truncate">
              {country.name}
            </p>
          </div>
        </div>

        {/* Middle: Movie Summary Preview (if watched) */}
        <div className="flex-1 min-w-0 md:px-3">
          {hasMovies ? (
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#052e16] text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>★ {movies.length} film{movies.length > 1 ? 's' : ''}</span>
              </span>

              {/* Titles preview of watched movies */}
              <div className="flex items-center space-x-1.5 truncate text-xs">
                {movies.map((m) => (
                  <span
                    key={m.imdbID}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#0f2139] border border-[#1e3a8a] text-slate-200 text-[11px] font-bold truncate max-w-[240px]"
                    title={`${m.title} (${m.year || 'Année inconnue'})`}
                  >
                    <Film className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{m.title}</span>
                    {m.userRating ? (
                      <span className="text-amber-400 font-mono text-[10px] ml-1 shrink-0 flex items-center">
                        <Star className="w-2.5 h-2.5 fill-amber-400 inline mr-0.5" />
                        {m.userRating}
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 italic hidden lg:inline">
              Aucun film enregistré pour le moment
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 self-end md:self-center shrink-0">
          {/* Google Search Ideas Link */}
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`Liste meilleurs films ${country.frenchName}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2 py-1 rounded btn-y2k-secondary text-xs"
            title={`Chercher des idées de films pour ${country.frenchName} sur Google`}
          >
            <ExternalLink className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">[ Idées ]</span>
          </a>

          {/* Add Movie button */}
          <button
            onClick={() => onOpenSearchForCountry(country)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded btn-y2k-primary text-xs"
            title={`Ajouter un film pour ${country.frenchName}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>[ Film ]</span>
          </button>

          {/* Toggle Expand/Collapse Details if has movies */}
          {hasMovies && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all ${
                isExpanded
                  ? 'btn-y2k-primary text-slate-950 font-bold'
                  : 'btn-y2k-secondary text-slate-300'
              }`}
              title={isExpanded ? 'Masquer les fiches films' : 'Afficher les fiches films'}
            >
              <span className="text-[10px] hidden sm:inline">
                {isExpanded ? '[ Fermer ]' : '[ Détails ]'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Movie Details Sub-Section */}
      {hasMovies && isExpanded && (
        <div className="p-3 sm:p-4 bg-[#050b14] border-t-2 border-[#1e3a8a] space-y-3 animate-fade-in shadow-inner">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1 mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>Films répertoriés pour {country.frenchName} ({movies.length}) :</span>
          </div>

          <div className="space-y-2.5">
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
    </div>
  );
};
