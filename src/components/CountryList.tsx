import React, { useState, useMemo } from 'react';
import type { Continent, Country, Movie } from '../types';
import { CONTINENTS_ORDER, CONTINENT_ICONS } from '../data/countriesData';
import { CountryCard } from './CountryCard';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';


interface CountryListProps {
  countries: Country[];
  userData: {
    movies: Record<string, Movie>;
    countryMovies: Record<string, string[]>;
  };
  selectedContinent: Continent | 'Tous';
  onOpenSearchForCountry: (country: Country) => void;
  onRemoveMovie: (imdbID: string, countryCode: string) => void;
  onUpdateMovie: (
    imdbID: string,
    updates: Partial<Pick<Movie, 'userRating' | 'userNote'>>
  ) => void;
}

type StatusFilter = 'all' | 'watched' | 'unwatched';

export const CountryList: React.FC<CountryListProps> = ({
  countries,
  userData,
  selectedContinent,
  onOpenSearchForCountry,
  onRemoveMovie,
  onUpdateMovie
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [collapsedContinents, setCollapsedContinents] = useState<Record<string, boolean>>({});

  const toggleContinentCollapse = (continent: string) => {
    setCollapsedContinents((prev) => ({
      ...prev,
      [continent]: !prev[continent]
    }));
  };

  // Filter countries according to search and status
  const filteredCountries = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return countries.filter((c) => {
      // Continent filter
      if (selectedContinent !== 'Tous' && c.continent !== selectedContinent) {
        return false;
      }

      // Watched status
      const hasWatched = (userData.countryMovies[c.code] || []).length > 0;
      if (statusFilter === 'watched' && !hasWatched) return false;
      if (statusFilter === 'unwatched' && hasWatched) return false;

      // Search term
      if (term) {
        const matchesName = c.name.toLowerCase().includes(term);
        const matchesFrench = c.frenchName.toLowerCase().includes(term);
        const matchesCode = c.code.toLowerCase().includes(term) || c.cca3.toLowerCase().includes(term);
        const matchesAlias = c.aliases.some((a) => a.toLowerCase().includes(term));
        return matchesName || matchesFrench || matchesCode || matchesAlias;
      }

      return true;
    });
  }, [countries, userData.countryMovies, selectedContinent, statusFilter, searchTerm]);

  // Group by continent
  const groupedContinents = useMemo(() => {
    const groups: { continent: Continent; list: Country[] }[] = [];

    const continentsToShow =
      selectedContinent === 'Tous'
        ? CONTINENTS_ORDER
        : CONTINENTS_ORDER.filter((cont) => cont === selectedContinent);

    continentsToShow.forEach((continent) => {
      const list = filteredCountries
        .filter((c) => c.continent === continent)
        .sort((a, b) => a.frenchName.localeCompare(b.frenchName));

      if (list.length > 0) {
        groups.push({ continent, list });
      }
    });

    return groups;
  }, [filteredCountries, selectedContinent]);

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
        {/* Search input for countries */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer un pays (ex: Japon, France, Brésil, Islande)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous ({countries.length})
          </button>
          <button
            onClick={() => setStatusFilter('watched')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'watched'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vus ✅
          </button>
          <button
            onClick={() => setStatusFilter('unwatched')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'unwatched'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            À découvrir 🎯
          </button>
        </div>
      </div>

      {/* Continents groups & countries */}
      {groupedContinents.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-slate-400 text-sm font-medium">
            Aucun pays ne correspond à vos filtres actuels.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-all"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedContinents.map(({ continent, list }) => {
            const isCollapsed = collapsedContinents[continent];
            const continentAll = countries.filter((c) => c.continent === continent);
            const continentWatched = continentAll.filter(
              (c) => (userData.countryMovies[c.code] || []).length > 0
            ).length;

            return (
              <section key={continent} className="space-y-4">
                {/* Continent Section Header */}
                <div
                  onClick={() => toggleContinentCollapse(continent)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer shadow-md transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl select-none">
                      {CONTINENT_ICONS[continent] || '🌐'}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors m-0">
                        {continent}
                      </h3>
                      <p className="text-xs text-slate-400 m-0">
                        {continentWatched} sur {continentAll.length} pays explorés (
                        {Math.round((continentWatched / continentAll.length) * 100)}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {list.length} pays listés
                    </span>
                    <button className="p-1 text-slate-400 group-hover:text-white">
                      {isCollapsed ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronUp className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Countries List */}
                {!isCollapsed && (
                  <div className="grid grid-cols-1 gap-4 pl-0 sm:pl-2">
                    {list.map((country) => {
                      const movieIds = userData.countryMovies[country.code] || [];
                      const countryMoviesList = movieIds
                        .map((id) => userData.movies[id])
                        .filter(Boolean);

                      return (
                        <CountryCard
                          key={country.code}
                          country={country}
                          movies={countryMoviesList}
                          allCountries={countries}
                          onOpenSearchForCountry={onOpenSearchForCountry}
                          onRemoveMovie={onRemoveMovie}
                          onUpdateMovie={onUpdateMovie}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
