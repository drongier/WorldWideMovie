import React, { useState, useMemo } from 'react';
import type { Continent, Country, Movie } from '../types';
import { CONTINENTS_ORDER, CONTINENT_ICONS } from '../data/countriesData';
import { CountryCard } from './CountryCard';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp
} from 'lucide-react';

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

  // Check if all visible continents are currently collapsed
  const areAllCollapsed = useMemo(() => {
    if (groupedContinents.length === 0) return false;
    return groupedContinents.every(({ continent }) => Boolean(collapsedContinents[continent]));
  }, [groupedContinents, collapsedContinents]);

  const handleCollapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    groupedContinents.forEach(({ continent }) => {
      allCollapsed[continent] = true;
    });
    setCollapsedContinents(allCollapsed);
  };

  const handleExpandAll = () => {
    setCollapsedContinents({});
  };

  const handleToggleCollapseAll = () => {
    if (areAllCollapsed) {
      handleExpandAll();
    } else {
      handleCollapseAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar 2000s Style */}
      <div className="box-y2k rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-2 border-[#1e3a8a]">
        {/* Search input for countries */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un pays (ex: Japon, France, Brésil, Islande)..."
            className="w-full pl-9 pr-4 py-2 bg-[#050b14] border-2 border-[#1e3a8a] rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-inner font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Tabs (2000s Button Group) */}
          <div className="flex items-center space-x-1 bg-[#050b14] p-1 rounded-lg border border-[#1e293b]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'btn-y2k-primary text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tous ({countries.length})
            </button>
            <button
              onClick={() => setStatusFilter('watched')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'watched'
                  ? 'bg-emerald-600 text-white border-t border-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vus ✅
            </button>
            <button
              onClick={() => setStatusFilter('unwatched')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'unwatched'
                  ? 'bg-slate-700 text-white border-t border-slate-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              À découvrir 🎯
            </button>
          </div>

          {/* Quick Expand / Collapse All Continents button */}
          {groupedContinents.length > 1 && (
            <button
              onClick={handleToggleCollapseAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg btn-y2k-secondary text-xs"
              title={areAllCollapsed ? 'Déplier tous les continents' : 'Replier tous les continents'}
            >
              {areAllCollapsed ? (
                <>
                  <ChevronsDown className="w-3.5 h-3.5 text-amber-400" />
                  <span>[ Tout déplier ]</span>
                </>
              ) : (
                <>
                  <ChevronsUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>[ Tout replier ]</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Continents groups & countries list */}
      {groupedContinents.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl box-y2k border-2 border-[#1e3a8a]">
          <p className="text-slate-300 text-sm font-bold">
            Aucun pays ne correspond à vos filtres actuels.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-3 px-4 py-2 rounded-lg btn-y2k-primary text-xs font-bold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedContinents.map(({ continent, list }) => {
            const isCollapsed = collapsedContinents[continent];
            const continentAll = countries.filter((c) => c.continent === continent);
            const continentWatched = continentAll.filter(
              (c) => (userData.countryMovies[c.code] || []).length > 0
            ).length;

            return (
              <section key={continent} className="shadow-lg">
                {/* Continent Section Header (Unified Table Top Bar) */}
                <div
                  onClick={() => toggleContinentCollapse(continent)}
                  className={`flex items-center justify-between p-3 sm:p-3.5 bg-gradient-to-r from-[#172c49] via-[#0f2037] to-[#0a1525] border-2 border-[#1e3a8a] hover:border-amber-400/60 cursor-pointer shadow-md transition-all group select-none ${
                    isCollapsed ? 'rounded-xl' : 'rounded-t-xl border-b-0'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl select-none filter drop-shadow">
                      {CONTINENT_ICONS[continent] || '🌐'}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors m-0 uppercase tracking-wide font-sans flex items-center gap-1.5">
                        <span>★ {continent} ★</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 m-0">
                        {continentWatched} sur {continentAll.length} pays explorés (
                        {Math.round((continentWatched / continentAll.length) * 100)}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#070e1a] border border-[#1e3a8a] text-amber-300 font-bold">
                      {list.length} PAYS
                    </span>
                    <button className="p-1 rounded bg-[#0a1424] border border-[#1e3a8a] text-slate-300 group-hover:text-amber-400">
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Unified Continuous Countries Directory Table */}
                {!isCollapsed && (
                  <div className="bg-[#070e1a] border-2 border-t-0 border-[#1e3a8a] rounded-b-xl overflow-hidden shadow-xl animate-fade-in divide-y divide-[#162740]">
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
