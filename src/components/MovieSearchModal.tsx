import React, { useState, useEffect } from 'react';
import type {
  Country,
  Movie,
  OMDbMovieDetail,
  OMDbSearchResult
} from '../types';

import {
  searchMoviesOMDb,
  getMovieDetailsOMDb,
  matchCountriesFromRawString,
  convertOMDbToMovie
} from '../services/omdbApi';
import confetti from 'canvas-confetti';
import {
  Search,
  X,
  Loader2,
  Check,
  Star,
  Film,
  Calendar,
  User,
  Plus,
  AlertCircle,
  Key
} from 'lucide-react';

interface MovieSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  allCountries: Country[];
  onAddMovie: (movie: Movie, countryCodes: string[]) => void;
  onOpenApiKeyModal: () => void;
  initialPresetCountryCode?: string; // If user clicked "Add movie for this country"
}

export const MovieSearchModal: React.FC<MovieSearchModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  allCountries,
  onAddMovie,
  onOpenApiKeyModal,
  initialPresetCountryCode
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [results, setResults] = useState<OMDbSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Selected movie detail for confirmation step
  const [selectedMovie, setSelectedMovie] = useState<OMDbMovieDetail | null>(null);
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Open triggered by parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
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
        const list = await searchMoviesOMDb(query, apiKey);
        setResults(list);
        if (list.length === 0) {
          setError('Aucun film trouvé pour cette recherche.');
        }
      } catch (err: any) {
        setError(err?.message || 'Erreur lors de la recherche sur OMDb.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query, apiKey, selectedMovie]);

  // When clicking on a search result, fetch full details and match countries
  const handleSelectSearchResult = async (imdbID: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const details = await getMovieDetailsOMDb(imdbID, apiKey);
      setSelectedMovie(details);

      // Match countries
      const matched = matchCountriesFromRawString(details.Country, allCountries);
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

    const movieObj = convertOMDbToMovie(selectedMovie, selectedCountryCodes);
    if (userRating > 0) movieObj.userRating = userRating;
    if (userNote.trim()) movieObj.userNote = userNote.trim();

    onAddMovie(movieObj, selectedCountryCodes);

    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

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
            <Film className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white m-0">
              {selectedMovie ? 'Confirmer et associer le film' : 'Rechercher un film'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!selectedMovie ? (
            /* Search view */
            <>
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tapez le titre d'un film (ex: Parasite, Amélie, Le Fabuleux Destin, Spirited Away)..."
                  className="w-full pl-12 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status / Loading / Errors */}
              {loading && (
                <div className="flex items-center justify-center py-12 space-x-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Recherche en cours sur OMDb...</span>
                </div>
              )}

              {error && !loading && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{error}</p>
                    {error.toLowerCase().includes('key') && (
                      <button
                        onClick={onOpenApiKeyModal}
                        className="mt-2 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                      >
                        <Key className="w-4 h-4" />
                        <span>Configurer votre clé OMDb gratuite</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Search Results List */}
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {results.map((item) => (
                    <div
                      key={item.imdbID}
                      onClick={() => handleSelectSearchResult(item.imdbID)}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center border border-slate-800">
                        {item.Poster !== 'N/A' ? (
                          <img
                            src={item.Poster}
                            alt={item.Title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Film className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors m-0">
                          {item.Title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{item.Year}</span>
                          </span>
                          <span>•</span>
                          <span className="capitalize">{item.Type}</span>
                        </div>
                      </div>
                      <span className="p-2 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 transition-colors shrink-0">
                        <Plus className="w-4 h-4" />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State / Hints */}
              {!query && !loading && (
                <div className="py-8 text-center text-slate-500">
                  <Film className="w-12 h-12 mx-auto mb-3 text-slate-700 stroke-[1.5]" />
                  <p className="text-sm text-slate-400 font-medium">
                    Trouvez n'importe quel film mondial grâce à la base OMDb
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Les pays d'origine et de co-production seront automatiquement détectés !
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Selected Movie Confirmation View */
            <div className="space-y-6">
              {detailLoading ? (
                <div className="flex items-center justify-center py-12 space-x-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Chargement des détails du film...</span>
                </div>
              ) : (
                <>
                  {/* Movie Summary Card */}
                  <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="w-28 sm:w-32 h-40 sm:h-44 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800 shadow-md">
                      {selectedMovie.Poster !== 'N/A' ? (
                        <img
                          src={selectedMovie.Poster}
                          alt={selectedMovie.Title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-8 h-8 text-slate-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xl font-black text-white m-0">
                          {selectedMovie.Title}
                        </h3>
                        {selectedMovie.imdbRating !== 'N/A' && (
                          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{selectedMovie.imdbRating} / 10</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>{selectedMovie.Year}</span>
                        <span>•</span>
                        <span>{selectedMovie.Runtime}</span>
                        <span>•</span>
                        <span>{selectedMovie.Genre}</span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Réalisateur : </span>
                        <strong className="text-white">{selectedMovie.Director}</strong>
                      </div>

                      {selectedMovie.Plot !== 'N/A' && (
                        <p className="text-xs text-slate-400 line-clamp-3 italic">
                          "{selectedMovie.Plot}"
                        </p>
                      )}

                      <div className="text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Pays détecté(s) par OMDb : </span>
                        <span className="text-amber-300">{selectedMovie.Country || 'Non spécifié'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Country Association selector */}
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <label className="block text-sm font-bold text-white">
                      Associer ce film aux pays suivants :
                    </label>
                    <p className="text-xs text-slate-400 m-0">
                      Cochez les pays dans lesquels ce film doit compter (idéal pour les co-productions) :
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedCountryCodes.map((code) => {
                        const country = allCountries.find((c) => c.code === code);
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleToggleCountry(code)}
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{country?.flag || '🏳️'}</span>
                            <span>{country?.frenchName || code}</span>
                            <span className="text-emerald-400 text-xs">✕</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Add extra country selector */}
                    <div className="flex items-center space-x-2 pt-2">
                      <select
                        value={extraCountryToAdd}
                        onChange={(e) => setExtraCountryToAdd(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="">+ Ajouter un autre pays manuellement...</option>
                        {allCountries
                          .filter((c) => !selectedCountryCodes.includes(c.code))
                          .sort((a, b) => a.frenchName.localeCompare(b.frenchName))
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.frenchName} ({c.continent})
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddExtraCountry}
                        disabled={!extraCountryToAdd}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Personal Rating & Review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Votre note personnelle (optionnel) :
                      </label>
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
                                userRating >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                        {userRating > 0 && (
                          <span className="text-xs text-amber-400 font-bold ml-2">
                            {userRating} / 5
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Votre avis / commentaire (optionnel) :
                      </label>
                      <input
                        type="text"
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="Ex: Chef-d'oeuvre du cinéma d'animation..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          {selectedMovie ? (
            <>
              <button
                type="button"
                onClick={() => setSelectedMovie(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Retour aux résultats
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                disabled={selectedCountryCodes.length === 0}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Ajouter à ma collection ({selectedCountryCodes.length} pays)</span>
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-slate-500">
              <span>
                Astuce : Tapez le titre en anglais ou dans la langue originale pour plus de résultats OMDb.
              </span>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
