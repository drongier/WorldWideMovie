import { useState, useEffect, useCallback } from 'react';
import type { Country, Continent, Movie, UserData } from './types';
import { INITIAL_COUNTRIES } from './data/countriesData';
import { fetchCountries } from './services/countriesApi';
import {
  loadUserData,
  addMovieToStorage,
  removeMovieFromStorage,
  updateMovieInStorage,
  exportDataToJson,
  importDataFromJson
} from './services/storage';
import {
  fetchUserDataFromSupabase,
  addMovieToSupabase,
  removeMovieFromSupabase,
  updateMovieInSupabase,
  bulkMigrateLocalDataToSupabase
} from './services/supabaseStorage';
import { useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { CountryList } from './components/CountryList';
import { MovieSearchModal } from './components/MovieSearchModal';
import { ManualMovieModal } from './components/ManualMovieModal';
import { RandomCountryModal } from './components/RandomCountryModal';
import { AuthModal } from './components/AuthModal';
import { Film, CloudUpload, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [countries, setCountries] = useState<Country[]>(INITIAL_COUNTRIES);
  const [userData, setUserData] = useState<UserData>(() => loadUserData());
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'Tous'>('Tous');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [hasLocalDataToMigrate, setHasLocalDataToMigrate] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationSuccess, setMigrationSuccess] = useState<string | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchPresetCode, setSearchPresetCode] = useState<string | undefined>(undefined);

  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualPresetCode, setManualPresetCode] = useState<string | undefined>(undefined);

  const [isRandomOpen, setIsRandomOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Fetch enriched country data from REST Countries API on startup
  useEffect(() => {
    fetchCountries().then((list) => {
      if (list && list.length > 0) {
        setCountries(list);
      }
    });
  }, []);

  // Synchronize data when user logs in or logs out
  const refreshUserData = useCallback(async () => {
    if (user) {
      setIsLoadingData(true);
      try {
        const cloudData = await fetchUserDataFromSupabase(user.id);
        setUserData(cloudData);

        // Check if there are local movies that could be migrated to cloud
        const localData = loadUserData();
        const localMovieKeys = Object.keys(localData.movies || {});
        if (localMovieKeys.length > 0) {
          const unsyncedCount = localMovieKeys.filter((id) => !cloudData.movies[id]).length;
          if (unsyncedCount > 0) {
            setHasLocalDataToMigrate(true);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données Supabase:', error);
      } finally {
        setIsLoadingData(false);
      }
    } else {
      // Fallback to local storage when logged out
      setUserData(loadUserData());
      setHasLocalDataToMigrate(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      refreshUserData();
    }
  }, [user, authLoading, refreshUserData]);

  // Handler for adding a movie (automatic from TMDB or manual)
  const handleAddMovie = async (movie: Movie, countryCodes: string[]) => {
    if (user) {
      try {
        const existing = userData.movies[movie.imdbID];
        const savedMovie = await addMovieToSupabase(movie, countryCodes, user.id, existing);

        const updatedMovies = { ...userData.movies, [savedMovie.imdbID]: savedMovie };
        const updatedCountryMovies = { ...userData.countryMovies };

        countryCodes.forEach((code) => {
          const currentList = updatedCountryMovies[code] || [];
          if (!currentList.includes(savedMovie.imdbID)) {
            updatedCountryMovies[code] = [...currentList, savedMovie.imdbID];
          }
        });

        setUserData({
          ...userData,
          movies: updatedMovies,
          countryMovies: updatedCountryMovies
        });
      } catch (err) {
        alert('Erreur lors de la sauvegarde du film dans Supabase. Veuillez réessayer.');
      }
    } else {
      // Guest mode (localStorage)
      const { updatedData } = addMovieToStorage(movie, countryCodes, userData);
      setUserData(updatedData);
    }
  };

  // Handler for removing a movie from a country
  const handleRemoveMovie = async (imdbID: string, countryCode: string) => {
    if (!window.confirm('Voulez-vous retirer ce film de ce pays ?')) return;

    if (user && userData.movies[imdbID]) {
      try {
        const { remainingCodes, isDeleted } = await removeMovieFromSupabase(
          imdbID,
          countryCode,
          userData.movies[imdbID],
          user.id
        );

        const updatedMovies = { ...userData.movies };
        const updatedCountryMovies = { ...userData.countryMovies };

        if (isDeleted) {
          delete updatedMovies[imdbID];
        } else {
          updatedMovies[imdbID] = {
            ...updatedMovies[imdbID],
            countryCodes: remainingCodes
          };
        }

        if (updatedCountryMovies[countryCode]) {
          updatedCountryMovies[countryCode] = updatedCountryMovies[countryCode].filter(
            (id) => id !== imdbID
          );
          if (updatedCountryMovies[countryCode].length === 0) {
            delete updatedCountryMovies[countryCode];
          }
        }

        setUserData({
          ...userData,
          movies: updatedMovies,
          countryMovies: updatedCountryMovies
        });
      } catch (err) {
        alert('Erreur lors de la suppression sur Supabase.');
      }
    } else {
      const updated = removeMovieFromStorage(imdbID, countryCode, userData);
      setUserData(updated);
    }
  };

  // Handler for updating movie details (rating, note)
  const handleUpdateMovie = async (
    imdbID: string,
    updates: Partial<Pick<Movie, 'userRating' | 'userNote'>>
  ) => {
    if (user) {
      try {
        await updateMovieInSupabase(imdbID, updates, user.id);
        const updatedMovies = {
          ...userData.movies,
          [imdbID]: {
            ...userData.movies[imdbID],
            ...updates
          }
        };
        setUserData({
          ...userData,
          movies: updatedMovies
        });
      } catch (err) {
        alert('Erreur lors de la mise à jour sur Supabase.');
      }
    } else {
      const updated = updateMovieInStorage(imdbID, updates, userData);
      setUserData(updated);
    }
  };

  // Handler for migrating local storage movies to user's Supabase account
  const handleMigrateLocalData = async () => {
    if (!user) return;
    setIsMigrating(true);
    try {
      const localData = loadUserData();
      const { count } = await bulkMigrateLocalDataToSupabase(localData, user.id);
      await refreshUserData();
      setHasLocalDataToMigrate(false);
      setMigrationSuccess(`${count} film(s) local(aux) synchronisé(s) sur votre compte avec succès !`);
      setTimeout(() => setMigrationSuccess(null), 5000);
    } catch (err) {
      alert('Erreur lors de la synchronisation des données locales.');
    } finally {
      setIsMigrating(false);
    }
  };

  // Open search modal with a preset country (shortcut from Country card)
  const handleOpenSearchForCountry = (country: Country) => {
    setSearchPresetCode(country.code);
    setIsSearchOpen(true);
  };

  // Open random country suggestion and direct to search
  const handleSelectRandomCountry = (country: Country) => {
    setSearchPresetCode(country.code);
    setIsSearchOpen(true);
  };

  const totalUniqueMovies = Object.keys(userData.movies).length;
  const watchedCountriesCount = Object.keys(userData.countryMovies).filter(
    (code) => (userData.countryMovies[code] || []).length > 0
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onOpenSearch={() => {
          setSearchPresetCode(undefined);
          setIsSearchOpen(true);
        }}
        onOpenManualAdd={() => {
          setManualPresetCode(undefined);
          setIsManualOpen(true);
        }}
        onOpenRandomCountry={() => setIsRandomOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onExport={() => exportDataToJson(userData)}
        onImport={async (jsonStr) => {
          try {
            const imported = importDataFromJson(jsonStr);
            if (user) {
              await bulkMigrateLocalDataToSupabase(imported, user.id);
              await refreshUserData();
            } else {
              setUserData(imported);
            }
            alert('Sauvegarde importée avec succès !');
          } catch (e: any) {
            alert('Erreur lors de l\'import du fichier JSON.');
          }
        }}
        totalWatchedCountries={watchedCountriesCount}
        totalCountriesCount={countries.length}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Migration banner if user has un-synced local data */}
        {user && hasLocalDataToMigrate && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 text-emerald-200 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-emerald-300 m-0 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Synchronisation disponible
                </p>
                <p className="text-slate-300 m-0 text-xs">
                  Des films ont été trouvés sur cet appareil. Souhaitez-vous les transférer sur votre compte Cloud ?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleMigrateLocalData}
                disabled={isMigrating}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isMigrating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Synchronisation...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>Synchroniser sur mon compte</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setHasLocalDataToMigrate(false)}
                className="px-2.5 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Ignorer
              </button>
            </div>
          </div>
        )}

        {/* Migration Success alert */}
        {migrationSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{migrationSuccess}</span>
          </div>
        )}

        {/* Guest Mode Banner (if not logged in) */}
        {!user && !authLoading && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 text-slate-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Film className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-slate-200 m-0">
                  Mode invité (stockage local sur ce navigateur)
                </p>
                <p className="text-slate-400 m-0 text-xs">
                  Connectez-vous pour retrouver vos films sur tous vos appareils (PC, mobile) et sécuriser votre progression.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-slate-100 font-semibold text-xs transition-all shrink-0"
            >
              Se connecter / S'inscrire
            </button>
          </div>
        )}

        {/* Global Stats & Continent Progress */}
        <StatsBar
          countries={countries}
          countryMovies={userData.countryMovies}
          totalUniqueMovies={totalUniqueMovies}
          selectedContinent={selectedContinent}
          onSelectContinent={setSelectedContinent}
        />

        {/* Country Explorer & Movie List */}
        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm">Chargement de votre collection de films...</p>
          </div>
        ) : (
          <CountryList
            countries={countries}
            userData={userData}
            selectedContinent={selectedContinent}
            onOpenSearchForCountry={handleOpenSearchForCountry}
            onRemoveMovie={handleRemoveMovie}
            onUpdateMovie={handleUpdateMovie}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          refreshUserData();
        }}
      />

      <MovieSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allCountries={countries}
        onAddMovie={handleAddMovie}
        initialPresetCountryCode={searchPresetCode}
      />

      <ManualMovieModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        allCountries={countries}
        onAddMovie={handleAddMovie}
        presetCountryCode={manualPresetCode}
      />

      <RandomCountryModal
        isOpen={isRandomOpen}
        onClose={() => setIsRandomOpen(false)}
        countries={countries}
        countryMovies={userData.countryMovies}
        onSelectCountryToSearch={handleSelectRandomCountry}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">WorldWideMovie</span>
            <span>•</span>
            <span>Tour du monde du 7ème art</span>
          </div>
          <p className="m-0">
            Données pays propulsées par REST Countries • Métadonnées cinématographiques fournies par The Movie Database (TMDB).
          </p>
        </div>
      </footer>
    </div>
  );
}
