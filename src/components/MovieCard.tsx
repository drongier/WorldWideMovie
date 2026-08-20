import React, { useState } from 'react';
import type { Movie, Country } from '../types';

import {
  Film,
  Star,
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
  User,
  Share2
} from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  currentCountryCode: string;
  allCountries: Country[];
  onRemove: (imdbID: string, countryCode: string) => void;
  onUpdateMovie: (
    imdbID: string,
    updates: Partial<Pick<Movie, 'userRating' | 'userNote'>>
  ) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  currentCountryCode,
  allCountries,
  onRemove,
  onUpdateMovie
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(movie.userNote || '');

  // Find other co-production countries
  const otherCountryCodes = (movie.countryCodes || []).filter(
    (code) => code !== currentCountryCode
  );
  const otherCountries = otherCountryCodes
    .map((code) => allCountries.find((c) => c.code === code))
    .filter(Boolean) as Country[];

  const handleStarClick = (rating: number) => {
    const newRating = movie.userRating === rating ? 0 : rating;
    onUpdateMovie(movie.imdbID, { userRating: newRating });
  };

  const handleSaveNote = () => {
    onUpdateMovie(movie.imdbID, { userNote: tempNote.trim() });
    setIsEditingNote(false);
  };

  const isImdbLink = movie.imdbID && movie.imdbID.startsWith('tt');

  return (
    <div className="relative group bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col sm:flex-row">
      {/* Poster */}
      <div className="w-full sm:w-28 h-44 sm:h-auto bg-slate-950 shrink-0 relative overflow-hidden flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-800/80">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-slate-600">
            <Film className="w-8 h-8 mb-1" />
            <span className="text-[10px] text-center">Pas d'affiche</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Header row: Title & Remove button */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm sm:text-base font-black text-white leading-snug m-0">
                {movie.title}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-1">
                <span className="font-semibold text-slate-300">{movie.year}</span>
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{movie.runtime}</span>
                    </span>
                  </>
                )}
                {movie.genre && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400">{movie.genre}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1 shrink-0">
              {isImdbLink && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  title="Voir sur IMDb"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => onRemove(movie.imdbID, currentCountryCode)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Retirer ce film pour ce pays"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Director */}
          {movie.director && movie.director !== 'Inconnu' && (
            <div className="text-xs text-slate-400 flex items-center space-x-1 mt-1.5">
              <User className="w-3 h-3 text-slate-500" />
              <span>De : <strong className="text-slate-200">{movie.director}</strong></span>
            </div>
          )}

          {/* Co-productions badges */}
          {otherCountries.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1 text-amber-400 font-medium">
                <Share2 className="w-3 h-3" />
                <span>Co-production :</span>
              </span>
              {otherCountries.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
                >
                  <span>{c.flag}</span>
                  <span>{c.frenchName}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Ratings & Notes Section */}
        <div className="pt-2 border-t border-slate-800/60 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* User Star Rating */}
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 text-[11px] mr-1">Mon avis :</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="p-0.5 text-slate-600 hover:text-amber-400 transition-colors"
                  title={`Noter ${star}/5`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      (movie.userRating || 0) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* IMDb Rating */}
            {movie.imdbRating && (
              <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>IMDb : {movie.imdbRating}/10</span>
              </div>
            )}
          </div>

          {/* User Note */}
          {isEditingNote ? (
            <div className="space-y-1.5">
              <textarea
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Votre avis / souvenir du film..."
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingNote(true)}
              className="flex items-start space-x-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer bg-slate-950/40 p-1.5 rounded-lg border border-transparent hover:border-slate-800 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
              {movie.userNote ? (
                <span className="italic text-slate-300 line-clamp-2">"{movie.userNote}"</span>
              ) : (
                <span className="text-slate-500 italic text-[11px]">+ Ajouter une note personnelle...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
