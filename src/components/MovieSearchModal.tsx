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
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Disc
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0d1724] border-2 border-[#1e3a8a] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Retro 2000s Window Titlebar */}
        <div className="window-titlebar px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider font-sans">
            {selectedMovie ? (
              <button
                onClick={() => setSelectedMovie(null)}
                className="mr-1 p-1 rounded bg-[#0b192c] hover:bg-[#122846] text-amber-300 border border-[#38bdf8] flex items-center gap-1 text-[11px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>[ Retour ]</span>
              </button>
            ) : (
              <Disc className="w-4 h-4 text-amber-300 animate-spin" />
            )}
            <span>
              {selectedMovie ? 'Fiche Film & Association Pays' : 'Base de Données TMDB - Recherche de Films'}
            </span>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-6 h-6 rounded bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center border-t border-l border-red-300 border-b-2 border-r-2 border-red-950 shadow-sm"
            title="Fermer la fenêtre"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {!selectedMovie ? (
            /* STEP 1: SEARCH & RESULTS */
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tapez le titre d'un film (ex: Parasite, Amélie, Le Parrain...)"
                  className="w-full pl-10 pr-9 py-2.5 bg-[#050b14] border-2 border-[#1e3a8a] rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Spinner */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">Interrogation des serveurs TMDB...</p>
                </div>
              )}

              {detailLoading && (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">Chargement des données &amp; détection des pays...</p>
                </div>
              )}

              {error && !loading && !detailLoading && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Results List 2000s Style */}
              {!loading && !detailLoading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map((item) => {
                    const posterUrl = getTMDBPosterUrl(item.poster_path);
                    const releaseYear = item.release_date ? item.release_date.slice(0, 4) : '';

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item.id)}
                        className="flex items-start space-x-3 p-2.5 bg-[#070e1a] hover:bg-[#102036] border-2 border-[#1e293b] hover:border-amber-400 rounded-lg cursor-pointer transition-all group shadow-sm"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={item.title}
                            className="w-14 h-20 object-cover rounded bg-[#030712] border border-[#1e3a8a] shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-14 h-20 bg-[#030712] rounded border border-[#1e3a8a] flex flex-col items-center justify-center text-slate-600 shrink-0">
                            <Film className="w-5 h-5" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1 m-0 uppercase tracking-wide">
                            {item.title}
                          </h4>
                          {item.original_title && item.original_title !== item.title && (
                            <p className="text-[10px] text-slate-400 italic line-clamp-1 m-0">
                              {item.original_title}
                            </p>
                          )}
                          <div className="flex items-center space-x-1.5 text-[10px] text-slate-300 pt-0.5">
                            {releaseYear && (
                              <span className="font-bold text-amber-300 bg-[#0c192c] px-1.5 py-0.2 rounded border border-[#1e3a8a]">
                                {releaseYear}
                              </span>
                            )}
                            {item.vote_average ? (
                              <span className="font-bold text-amber-400">
                                ★ {item.vote_average.toFixed(1)}/10
                              </span>
                            ) : null}
                          </div>
                          {item.overview && (
                            <p className="text-[10px] text-slate-400 line-clamp-2 m-0 pt-0.5 leading-tight">
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
                <div className="py-12 text-center text-slate-400 space-y-1.5">
                  <Film className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-300 m-0">
                    Tapez un nom de film pour débuter la recherche.
                  </p>
                  <p className="text-[11px] text-slate-500 m-0">
                    Affiches HD, résumés en français et pays officiels propulsés par TMDB.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: MOVIE DETAILS & COUNTRY ASSIGNMENT */
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-lg bg-[#070e1a] border-2 border-[#1e3a8a]">
                {selectedMovie.poster_path ? (
                  <img
                    src={getTMDBPosterUrl(selectedMovie.poster_path)}
                    alt={selectedMovie.title}
                    className="w-24 sm:w-32 h-36 sm:h-48 object-cover rounded-lg border-2 border-[#1e3a8a] shrink-0 mx-auto sm:mx-0 shadow-md"
                  />
                ) : (
                  <div className="w-24 sm:w-32 h-36 sm:h-48 bg-[#050b14] rounded-lg border-2 border-[#1e3a8a] flex items-center justify-center text-slate-600 shrink-0 mx-auto sm:mx-0">
                    <Film className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-base font-black text-white m-0 uppercase tracking-wide">
                      {selectedMovie.title}
                    </h3>
                    {selectedMovie.original_title && selectedMovie.original_title !== selectedMovie.title && (
                      <p className="text-xs text-slate-400 italic m-0">
                        {selectedMovie.original_title}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                    {selectedMovie.release_date && (
                      <span className="font-bold text-amber-300 bg-[#0f2038] px-2 py-0.5 rounded border border-[#1e3a8a]">
                        Année : {selectedMovie.release_date.slice(0, 4)}
                      </span>
                    )}
                    {selectedMovie.runtime ? (
                      <span className="bg-[#0f2038] px-2 py-0.5 rounded border border-[#1e3a8a]">
                        Durée : {selectedMovie.runtime} min
                      </span>
                    ) : null}
                    {selectedMovie.vote_average ? (
                      <span className="font-bold text-amber-400 bg-[#0f2038] px-2 py-0.5 rounded border border-[#1e3a8a]">
                        ★ {selectedMovie.vote_average.toFixed(1)}/10
                      </span>
                    ) : null}
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-0.5">
                    {selectedMovie.credits?.crew?.some((c) => c.job === 'Director') && (
                      <p className="m-0">
                        <span className="text-amber-400 font-bold">Réalisation : </span>
                        {selectedMovie.credits.crew.filter((c) => c.job === 'Director').map((c) => c.name).join(', ')}
                      </p>
                    )}
                    {selectedMovie.credits?.cast && selectedMovie.credits.cast.length > 0 && (
                      <p className="m-0">
                        <span className="text-slate-400 font-bold">Acteurs : </span>
                        {selectedMovie.credits.cast.slice(0, 4).map((c) => c.name).join(', ')}
                      </p>
                    )}
                    {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                      <p className="m-0">
                        <span className="text-slate-400 font-bold">Genres : </span>
                        {selectedMovie.genres.map((g) => g.name).join(', ')}
                      </p>
                    )}
                  </div>

                  {selectedMovie.overview && (
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed bg-[#030712] p-2 rounded border border-[#1e293b] m-0">
                      {selectedMovie.overview}
                    </p>
                  )}
                </div>
              </div>

              {/* Country Selection 2000s Style */}
              <div className="space-y-2 bg-[#070e1a] p-3 rounded-lg border border-[#1e3a8a]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pays associés à ce film (co-productions)</span>
                  </label>
                  <span className="text-[10px] text-slate-300 font-bold">
                    {selectedCountryCodes.length} pays sélectionné{selectedCountryCodes.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Selected Country Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {allCountries
                    .filter((c) => selectedCountryCodes.includes(c.code))
                    .map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleToggleCountry(country.code)}
                        className="flex items-center space-x-1.5 px-2.5 py-1 rounded btn-y2k-primary text-xs"
                      >
                        <span>{country.flag}</span>
                        <span>{country.frenchName}</span>
                        <X className="w-3 h-3 ml-1" />
                      </button>
                    ))}
                </div>

                {/* Add other country selector */}
                <div className="flex items-center space-x-2 pt-1">
                  <select
                    value={extraCountryToAdd}
                    onChange={(e) => setExtraCountryToAdd(e.target.value)}
                    className="flex-1 bg-[#030712] border border-[#1e3a8a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
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
                    className="px-3 py-1.5 btn-y2k-secondary text-xs rounded"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>

              {/* User Rating & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1 bg-[#070e1a] p-2.5 rounded-lg border border-[#1e293b]">
                  <label className="text-[10px] font-bold uppercase text-slate-300">Votre note personnelle</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(userRating === star ? 0 : star)}
                        className="p-0.5 text-slate-600 hover:text-amber-400"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= userRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="text-xs text-amber-400 font-bold ml-1 font-mono">
                        [{userRating}/5]
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 bg-[#070e1a] p-2.5 rounded-lg border border-[#1e293b]">
                  <label className="text-[10px] font-bold uppercase text-slate-300">Vos notes ou critique</label>
                  <textarea
                    rows={2}
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Votre avis sur ce film..."
                    className="w-full bg-[#030712] border border-[#1e3a8a] rounded p-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none font-sans"
                  />
                </div>
              </div>

              {/* Confirmation Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setSelectedMovie(null)}
                  className="px-3.5 py-1.5 rounded btn-y2k-secondary text-xs"
                >
                  [ Choisir un autre film ]
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  disabled={selectedCountryCodes.length === 0}
                  className="px-4 py-1.5 rounded btn-y2k-primary text-xs flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>[ ★ ENREGISTRER CE FILM ]</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
