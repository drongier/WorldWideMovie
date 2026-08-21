import React, { useState, useEffect } from 'react';
import type {
  Country,
  Movie,
  TMDBMovieDetail,
  TMDBSearchResult
} from '../types';

import {
  searchMoviesTMDB,
  getMovieDetailsTMDB,
  matchCountriesFromTMDB,
  convertTMDBToMovie,
  getTMDBPosterUrl
} from '../services/tmdbApi';
import confetti from 'canvas-confetti';
import {
  Search,
  X,
  Loader2,
  Check,
  Star,
  Film,
  Calendar,
  Plus,
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface MovieSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCountries: Country[];
  onAddMovie: (movie: Movie, countryCodes: string[]) => void;
  initialPresetCountryCode?: string;
}

export const MovieSearchModal: React.FC<MovieSearchModalProps> = ({
  isOpen,
  onClose,
  allCountries,
  onAddMovie,
  initialPresetCountryCode
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Selected movie detail for confirmation step
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovieDetail | null>(null);
  const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userNote, setUserNote] = useState<string>('');
  const [extraCountryToAdd, setExtraCountryToAdd] = useState<string>('');

  // Handle hotkeys (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search on TMDB
  useEffect(() => {
    if (!query.trim() || selectedMovie) {
      if (!query.trim()) {
        setResults([]);
        setError(null);
      }
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await searchMoviesTMDB(query);
        setResults(list);
        if (list.length === 0) {
          setError('Aucun film trouvé sur TMDB pour cette recherche.');
        }
      } catch (err: any) {
        setError(err?.message || 'Erreur lors de la recherche sur TMDB.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, selectedMovie]);

  // When clicking on a search result, fetch full details from TMDB
  const handleSelectSearchResult = async (tmdbId: number) => {
    setDetailLoading(true);
    setError(null);
    try {
      const details = await getMovieDetailsTMDB(tmdbId);
      setSelectedMovie(details);

      // Automatically match countries with ISO codes from TMDB
      const matched = matchCountriesFromTMDB(details, allCountries);
      const codes = matched.map((c) => c.code);

      // If preset country is provided and not already in matched, include it
      if (initialPresetCountryCode && !codes.includes(initialPresetCountryCode)) {
        codes.push(initialPresetCountryCode);
      }

      setSelectedCountryCodes(codes);
    } catch (err: any) {
      setError(err?.message || 'Impossible de charger les détails du film.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleCountry = (code: string) => {
    setSelectedCountryCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleAddExtraCountry = () => {
    if (!extraCountryToAdd) return;
    if (!selectedCountryCodes.includes(extraCountryToAdd)) {
      setSelectedCountryCodes((prev) => [...prev, extraCountryToAdd]);
    }
    setExtraCountryToAdd('');
  };

  const handleConfirmAdd = () => {
    if (!selectedMovie) return;

    if (selectedCountryCodes.length === 0) {
      alert('Veuillez sélectionner au moins un pays pour associer ce film.');
      return;
    }

    const movieObj = convertTMDBToMovie(selectedMovie, selectedCountryCodes);
    if (userRating > 0) movieObj.userRating = userRating;
    if (userNote.trim()) movieObj.userNote = userNote.trim();

    onAddMovie(movieObj, selectedCountryCodes);

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if confetti fails
    }

    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setSelectedMovie(null);
    setSelectedCountryCodes([]);
    setUserRating(0);
    setUserNote('');
    setQuery('');
    setResults([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            {selectedMovie ? (
              <button
                onClick={() => setSelectedMovie(null)}
                className="mr-1 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Retour à la recherche"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <Film className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="text-lg font-bold text-white m-0">
              {selectedMovie ? 'Confirmer et associer le film' : 'Rechercher un film (TMDB)'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!selectedMovie ? (
            /* STEP 1: SEARCH & RESULTS */
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tapez le titre d'un film (ex: Parasite, Amélie, Le Parrain...)"
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm shadow-inner"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status or Spinner */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                  <p className="text-sm">Recherche des films sur TMDB...</p>
                </div>
              )}

              {detailLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                  <p className="text-sm">Chargement des détails et des pays...</p>
                </div>
              )}

              {error && !loading && !detailLoading && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Results List */}
              {!loading && !detailLoading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {results.map((item) => {
                    const posterUrl = getTMDBPosterUrl(item.poster_path);
                    const releaseYear = item.release_date ? item.release_date.slice(0, 4) : '';

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item.id)}
                        className="flex items-start space-x-3 p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all group shadow-sm"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={item.title}
                            className="w-16 h-24 object-cover rounded-lg bg-slate-800 shadow shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-16 h-24 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 shrink-0">
                            <Film className="w-6 h-6" />
                            <span className="text-[9px] mt-1">Sans affiche</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0 py-0.5 space-y-1">
                          <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1 m-0">
                            {item.title}
                          </h4>
                          {item.original_title && item.original_title !== item.title && (
                            <p className="text-xs text-slate-400 italic line-clamp-1 m-0">
                              {item.original_title}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-xs text-slate-400 pt-0.5">
                            {releaseYear && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300">
                                {releaseYear}
                              </span>
                            )}
                            {item.vote_average ? (
                              <span className="flex items-center space-x-0.5 text-amber-400 font-medium text-[11px]">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{item.vote_average.toFixed(1)}</span>
                              </span>
                            ) : null}
                          </div>
                          {item.overview && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 m-0 pt-1 leading-relaxed">
                              {item.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!loading && !detailLoading && !query && (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Film className="w-12 h-12 mx-auto text-slate-700 stroke-[1.5]" />
                  <p className="text-sm m-0">Recherchez parmi des millions de films du monde entier.</p>
                  <p className="text-xs text-slate-600 m-0">Les données, affiches et résumés sont fournis par TMDB.</p>
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: MOVIE DETAILS & COUNTRY ASSIGNMENT */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                {selectedMovie.poster_path ? (
                  <img
                    src={getTMDBPosterUrl(selectedMovie.poster_path)}
                    alt={selectedMovie.title}
                    className="w-28 sm:w-36 h-40 sm:h-52 object-cover rounded-xl shadow-lg shrink-0 mx-auto sm:mx-0"
                  />
                ) : (
                  <div className="w-28 sm:w-36 h-40 sm:h-52 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 shrink-0 mx-auto sm:mx-0">
                    <Film className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 space-y-2.5">
                  <div>
                    <h3 className="text-xl font-bold text-white m-0">
                      {selectedMovie.title}
                    </h3>
                    {selectedMovie.original_title && selectedMovie.original_title !== selectedMovie.title && (
                      <p className="text-xs text-slate-400 italic m-0">
                        Titre original : {selectedMovie.original_title}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    {selectedMovie.release_date && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>{selectedMovie.release_date.slice(0, 4)}</span>
                      </span>
                    )}
                    {selectedMovie.runtime ? (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800">
                        {selectedMovie.runtime} min
                      </span>
                    ) : null}
                    {selectedMovie.vote_average ? (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{selectedMovie.vote_average.toFixed(1)}/10</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Cast and crew */}
                  <div className="text-xs text-slate-400 space-y-1">
                    {selectedMovie.credits?.crew?.some((c) => c.job === 'Director') && (
                      <p className="m-0">
                        <span className="text-slate-300 font-semibold">Réalisation : </span>
                        {selectedMovie.credits.crew.filter((c) => c.job === 'Director').map((c) => c.name).join(', ')}
                      </p>
                    )}
                    {selectedMovie.credits?.cast && selectedMovie.credits.cast.length > 0 && (
                      <p className="m-0">
                        <span className="text-slate-300 font-semibold">Avec : </span>
                        {selectedMovie.credits.cast.slice(0, 4).map((c) => c.name).join(', ')}
                      </p>
                    )}
                    {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                      <p className="m-0">
                        <span className="text-slate-300 font-semibold">Genres : </span>
                        {selectedMovie.genres.map((g) => g.name).join(', ')}
                      </p>
                    )}
                  </div>

                  {selectedMovie.overview && (
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed pt-1 m-0">
                      {selectedMovie.overview}
                    </p>
                  )}
                </div>
              </div>

              {/* Country Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pays associés à ce film (co-productions)</span>
                  </label>
                  <span className="text-xs text-amber-400 font-medium">
                    {selectedCountryCodes.length} pays sélectionné{selectedCountryCodes.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Badges of selected countries */}
                <div className="flex flex-wrap gap-2">
                  {allCountries
                    .filter((c) => selectedCountryCodes.includes(c.code))
                    .map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleToggleCountry(country.code)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 group hover:bg-amber-400 transition-all"
                      >
                        <span className="text-base">{country.flag}</span>
                        <span>{country.frenchName}</span>
                        <X className="w-3.5 h-3.5 ml-1 opacity-70 group-hover:opacity-100" />
                      </button>
                    ))}
                </div>

                {/* Add other country dropdown */}
                <div className="flex items-center space-x-2 pt-1">
                  <select
                    value={extraCountryToAdd}
                    onChange={(e) => setExtraCountryToAdd(e.target.value)}
                    className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">+ Associer un autre pays...</option>
                    {allCountries
                      .filter((c) => !selectedCountryCodes.includes(c.code))
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.frenchName} ({c.name})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddExtraCountry}
                    disabled={!extraCountryToAdd}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* User Rating and Review */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Votre note personnelle</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(userRating === star ? 0 : star)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= userRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="text-xs text-amber-400 font-bold ml-2">
                        {userRating}/5
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Vos notes ou critique (optionnel)</label>
                  <textarea
                    rows={2}
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Votre avis sur le film, les thèmes abordés..."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Choisir un autre film
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  disabled={selectedCountryCodes.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer dans ma collection</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
