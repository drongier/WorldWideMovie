import React from 'react';
import type { Continent, Country } from '../types';
import { CONTINENTS_ORDER, CONTINENT_ICONS } from '../data/countriesData';
import { Film, Award, Compass } from 'lucide-react';


interface StatsBarProps {
  countries: Country[];
  countryMovies: Record<string, string[]>;
  totalUniqueMovies: number;
  selectedContinent: Continent | 'Tous';
  onSelectContinent: (continent: Continent | 'Tous') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  countries,
  countryMovies,
  totalUniqueMovies,
  selectedContinent,
  onSelectContinent
}) => {
  const totalCountries = countries.length;

  // Calculate watched count
  const watchedCountryCodes = new Set(
    Object.keys(countryMovies).filter(
      (code) => (countryMovies[code] || []).length > 0
    )
  );
  const watchedCount = watchedCountryCodes.size;
  const percentage = totalCountries > 0 ? ((watchedCount / totalCountries) * 100).toFixed(1) : '0';

  // Stats per continent
  const continentStats = CONTINENTS_ORDER.map((continent) => {
    const continentCountries = countries.filter((c) => c.continent === continent);
    const continentTotal = continentCountries.length;
    const continentWatched = continentCountries.filter((c) =>
      watchedCountryCodes.has(c.code)
    ).length;
    const pct = continentTotal > 0 ? Math.round((continentWatched / continentTotal) * 100) : 0;

    return {
      continent,
      icon: CONTINENT_ICONS[continent] || '🌐',
      total: continentTotal,
      watched: continentWatched,
      percentage: pct
    };
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl backdrop-blur-sm">
      {/* Global overview header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight m-0">
              Progression du Défi Mondial
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1 m-0">
            Objectif : regarder au moins <span className="text-amber-300 font-semibold">1 film par pays</span> dans le monde.
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Films au total :</span>
            <span className="font-bold text-amber-400 text-base">{totalUniqueMovies}</span>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Pays explorés :</span>
            <span className="font-bold text-emerald-400 text-base">
              {watchedCount} <span className="text-slate-500 font-normal">/ {totalCountries}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Couverture mondiale</span>
          <span className="text-amber-400 font-bold text-sm">{percentage}%</span>
        </div>
        <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500 shadow-md shadow-amber-500/20"
            style={{ width: `${Math.max(Number(percentage), 1)}%` }}
          />
        </div>
      </div>

      {/* Continents Navigation Pills */}
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2.5">
          Filtrer par continent :
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Tous */}
          <button
            onClick={() => onSelectContinent('Tous')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              selectedContinent === 'Tous'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <span>🌍</span>
              <span>Tous</span>
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                selectedContinent === 'Tous'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-slate-700/60 text-slate-300'
              }`}
            >
              {watchedCount}/{totalCountries}
            </span>
          </button>

          {/* Continents */}
          {continentStats.map((item) => {
            const isSelected = selectedContinent === item.continent;
            return (
              <button
                key={item.continent}
                onClick={() => onSelectContinent(item.continent)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="flex items-center space-x-1.5 truncate">
                  <span>{item.icon}</span>
                  <span className="truncate">{item.continent}</span>
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                    isSelected
                      ? 'bg-slate-950/20 text-slate-950'
                      : item.watched > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-700/60 text-slate-400'
                  }`}
                >
                  {item.watched}/{item.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
