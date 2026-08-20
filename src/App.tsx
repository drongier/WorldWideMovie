import { useState, useEffect } from 'react';
import type { Country, Continent, Movie, UserData } from './types';
import { INITIAL_COUNTRIES } from './data/countriesData';
import { fetchCountries } from './services/countriesApi';
import {
  loadUserData,
  getStoredApiKey,
  setStoredApiKey,
  addMovieToStorage,
  removeMovieFromStorage,
  updateMovieInStorage,
  exportDataToJson,
  importDataFromJson
} from './services/storage';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { CountryList } from './components/CountryList';
import { MovieSearchModal } from './components/MovieSearchModal';
import { ManualMovieModal } from './components/ManualMovieModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { RandomCountryModal } from './components/RandomCountryModal';
import { Key, Film } from 'lucide-react';


export default function App() {
  const [countries, setCountries] = useState<Country[]>(INITIAL_COUNTRIES);
  const [userData, setUserData] = useState<UserData>(() => loadUserData());
  const [apiKey, setApiKey] = useState<string>(() => getStoredApiKey());
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'Tous'>('Tous');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchPresetCode, setSearchPresetCode] = useState<string | undefined>(undefined);

  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualPresetCode, setManualPresetCode] = useState<string | undefined>(undefined);

  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isRandomOpen, setIsRandomOpen] = useState(false);

  // Fetch enriched country data from REST Countries API on startup
  useEffect(() => {
    fetchCountries().then((list) => {
      if (list && list.length > 0) {
        setCountries(list);
      }
    });
  }, []);

  // Handler for adding a movie (automatic from OMDb or manual)
  const handleAddMovie = (movie: Movie, countryCodes: string[]) => {
    const { updatedData } = addMovieToStorage(movie, countryCodes, userData);
    setUserData(updatedData);
  };

  // Handler for removing a movie from a country
  const handleRemoveMovie = (imdbID: string, countryCode: string) => {
    if (window.confirm('Voulez-vous retirer ce film de ce pays ?')) {
      const updated = removeMovieFromStorage(imdbID, countryCode, userData);
      setUserData(updated);
    }
  };

  // Handler for updating movie details (rating, note)
  const handleUpdateMovie = (
    imdbID: string,
    updates: Partial<Pick<Movie, 'userRating' | 'userNote'>>
  ) => {
    const updated = updateMovieInStorage(imdbID, updates, userData);
    setUserData(updated);
  };

  // Handler for saving API key
  const handleSaveApiKey = (key: string) => {
    setStoredApiKey(key);
    setApiKey(key);
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
        onOpenApiKeyModal={() => setIsApiKeyOpen(true)}
        onOpenRandomCountry={() => setIsRandomOpen(true)}
        hasApiKey={Boolean(apiKey)}
        onExport={() => exportDataToJson(userData)}
        onImport={(jsonStr) => {
          try {
            const imported = importDataFromJson(jsonStr);
            setUserData(imported);
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
        {/* API Key Reminder Banner (if not set) */}
        {!apiKey && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-amber-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Key className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-amber-300 m-0">
                  Activez la recherche OMDb complète en 10 secondes
                </p>
                <p className="text-slate-400 m-0 text-xs">
                  Ajoutez votre clé gratuite pour charger instantanément les affiches et informations de tous les films.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsApiKeyOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0"
            >
              Configurer ma clé
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
        <CountryList
          countries={countries}
          userData={userData}
          selectedContinent={selectedContinent}
          onOpenSearchForCountry={handleOpenSearchForCountry}
          onRemoveMovie={handleRemoveMovie}
          onUpdateMovie={handleUpdateMovie}
        />
      </main>

      {/* Modals */}
      <MovieSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        apiKey={apiKey}
        allCountries={countries}
        onAddMovie={handleAddMovie}
        onOpenApiKeyModal={() => {
          setIsSearchOpen(false);
          setIsApiKeyOpen(true);
        }}
        initialPresetCountryCode={searchPresetCode}
      />

      <ManualMovieModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        allCountries={countries}
        onAddMovie={handleAddMovie}
        presetCountryCode={manualPresetCode}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
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
            Données pays propulsées par REST Countries • Métadonnées cinématographiques fournies par OMDb API.
          </p>
        </div>
      </footer>
    </div>
  );
}
