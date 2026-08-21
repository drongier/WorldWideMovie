import React, { useState } from 'react';
import type { Movie, Country } from '../types';

import {
  Film,
  Star,
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
  Check,
  X
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
    <div className="relative bg-[#0d1829] border-2 border-[#1e3a8a] rounded-lg overflow-hidden shadow-[0_3px_8px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row group">
      {/* DVD Poster Frame */}
      <div className="w-full sm:w-28 h-40 sm:h-auto bg-[#050b14] shrink-0 relative overflow-hidden flex items-center justify-center border-b sm:border-b-0 sm:border-r-2 border-[#1e3a8a]">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-slate-500">
            <Film className="w-6 h-6 mb-1 text-slate-600" />
            <span className="text-[9px] uppercase font-bold">Sans affiche</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Header row: Title & Remove button */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-black text-white leading-snug m-0 uppercase tracking-wide font-sans">
                {movie.title}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                <span className="font-bold text-amber-300">[{movie.year || 'Année inconnue'}]</span>
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5 text-slate-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{movie.runtime}</span>
                    </span>
                  </>
                )}
                {movie.genre && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300 italic">{movie.genre}</span>
                  </>
                )}
                {movie.imdbRating && (
                  <>
                    <span>•</span>
                    <span className="px-1 py-0.2 bg-[#050b14] text-amber-400 font-bold rounded border border-[#1e3a8a] text-[10px]">
                      ★ TMDB {movie.imdbRating}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Remove movie button */}
            <button
              onClick={() => onRemove(movie.imdbID, currentCountryCode)}
              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/40 transition-colors shrink-0"
              title="Retirer ce film du pays"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Director & Cast */}
          <div className="text-[11px] text-slate-300 space-y-0.5 mt-1.5 font-sans">
            {movie.director && movie.director !== 'Inconnu' && (
              <p className="m-0">
                <span className="text-amber-400 font-bold">Réal : </span>
                {movie.director}
              </p>
            )}
            {movie.actors && (
              <p className="m-0 text-slate-400 truncate">
                <span className="text-slate-300 font-bold">Avec : </span>
                {movie.actors}
              </p>
            )}
          </div>

          {/* Synopsis */}
          {movie.plot && (
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mt-1.5 m-0 bg-[#070e1a]/60 p-1.5 rounded border border-[#1e293b]">
              {movie.plot}
            </p>
          )}

          {/* Co-production badges */}
          {otherCountries.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-2 text-[10px]">
              <span className="text-slate-400 font-bold uppercase">Co-prod :</span>
              {otherCountries.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#162740] border border-[#1e3a8a] text-slate-200"
                >
                  <span>{c.flag}</span>
                  <span>{c.frenchName}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: User Star Rating & Notes Notepad */}
        <div className="pt-2 border-t border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {/* 5-Star Rating (2000s Gold Stars) */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Ma note :</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="p-0.5 text-slate-600 hover:text-amber-400 transition-colors"
                title={`Noter ${star}/5`}
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= (movie.userRating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
            {movie.userRating ? (
              <span className="text-[11px] font-bold text-amber-400 ml-1 font-mono">
                [{movie.userRating}/5]
              </span>
            ) : null}
          </div>

          {/* Note button or IMDb link */}
          <div className="flex items-center space-x-2">
            {!isEditingNote && (
              <button
                onClick={() => {
                  setTempNote(movie.userNote || '');
                  setIsEditingNote(true);
                }}
                className="flex items-center space-x-1 px-2 py-0.5 rounded btn-y2k-secondary text-[10px]"
              >
                <MessageSquare className="w-3 h-3 text-amber-400" />
                <span>{movie.userNote ? 'Modifier mon avis' : '+ Mon avis'}</span>
              </button>
            )}

            {isImdbLink && (
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#f5c518] text-black font-black text-[10px] border border-amber-300 shadow-sm"
                title="Voir la fiche IMDb"
              >
                <span>IMDb</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>

        {/* User Note Editor (if open) */}
        {isEditingNote && (
          <div className="p-2 rounded bg-[#070e1a] border border-amber-500/30 space-y-1.5 animate-fade-in mt-1">
            <textarea
              rows={2}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Votre avis / critique sur ce film..."
              className="w-full bg-[#030712] border border-[#1e3a8a] rounded p-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
              autoFocus
            />
            <div className="flex justify-end space-x-1.5">
              <button
                onClick={() => setIsEditingNote(false)}
                className="px-2 py-1 rounded bg-[#1e293b] text-slate-300 hover:text-white text-[10px] font-bold"
              >
                <X className="w-3 h-3 inline mr-0.5" /> Annuler
              </button>
              <button
                onClick={handleSaveNote}
                className="px-2.5 py-1 rounded btn-y2k-primary text-slate-950 text-[10px] font-bold"
              >
                <Check className="w-3 h-3 inline mr-0.5" /> Enregistrer l'avis
              </button>
            </div>
          </div>
        )}

        {/* Display User Note (if not editing and note exists) */}
        {!isEditingNote && movie.userNote && (
          <div className="p-2 rounded bg-[#070e1a] border-l-2 border-amber-400 text-[11px] text-amber-200/90 italic">
            « {movie.userNote} »
          </div>
        )}
      </div>
    </div>
  );
};
