import React from 'react';
import type { Continent, Country } from '../types';
import { CONTINENTS_ORDER, CONTINENT_ICONS } from '../data/countriesData';
import { Film, Award, Compass, Activity } from 'lucide-react';

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

  return (
    <div className="box-y2k rounded-xl p-4 sm:p-5 mb-6 border-2 border-[#1e3a8a]">
      {/* Top Banner & LED Counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white m-0 flex items-center gap-1.5">
              <span>★ TABLEAU DE BORD : LE TOUR DU MONDE EN FILMS ★</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 m-0">
            Objectif Cinéphile : enregistrer au moins <span className="text-amber-300 font-bold">1 film vu par pays</span>.
          </p>
        </div>

        {/* 2000s Digital Counters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Total Movies Counter */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#070e1a] border border-[#1e3a8a] shadow-inner">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-[11px] font-bold uppercase">Films vus :</span>
            <span className="font-mono font-black text-amber-400 text-sm tracking-widest bg-[#030712] px-2 py-0.5 rounded border border-amber-500/30">
              {String(totalUniqueMovies).padStart(3, '0')}
            </span>
          </div>

          {/* Countries Unlocked Counter */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#070e1a] border border-[#1e3a8a] shadow-inner">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-[11px] font-bold uppercase">Pays débloqués :</span>
            <span className="font-mono font-black text-emerald-400 text-sm tracking-widest bg-[#030712] px-2 py-0.5 rounded border border-emerald-500/30">
              {String(watchedCount).padStart(3, '0')} / {totalCountries}
            </span>
          </div>
        </div>
      </div>

      {/* 2000s Segmented / LED Progress Bar */}
      <div className="py-4 space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-300 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Progression Planétaire
          </span>
          <span className="font-mono text-amber-400 text-sm font-black bg-[#070e1a] px-2 py-0.5 rounded border border-[#1e3a8a]">
            {percentage}%
          </span>
        </div>

        {/* Segmented bar container */}
        <div className="w-full h-4 bg-[#050b14] rounded-md overflow-hidden p-0.5 border-2 border-[#1e293b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex gap-[2px]">
          {/* Segmented active chunks */}
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-[2px] transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            style={{ width: `${Math.max(Number(percentage), 1.5)}%` }}
          />
        </div>
      </div>

      {/* Continent Navigation Folder Tabs (2000s Classic Tabs) */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => onSelectContinent('Tous')}
            className={`px-3 py-1.5 rounded-t-lg font-bold transition-all shrink-0 border-t-2 border-l border-r ${
              selectedContinent === 'Tous'
                ? 'bg-[#1b2f4a] border-t-amber-400 border-l-[#334155] border-r-[#0f172a] text-amber-300 shadow-[0_-2px_6px_rgba(0,0,0,0.4)]'
                : 'bg-[#0a1322] border-t-[#1e293b] border-l-[#1e293b] border-r-[#0b1320] text-slate-400 hover:text-slate-200 hover:bg-[#111e33]'
            }`}
          >
            🌐 [ TOUS LES CONTINENTS ]
          </button>

          {CONTINENTS_ORDER.map((continent) => {
            const icon = CONTINENT_ICONS[continent] || '📍';
            const isSelected = selectedContinent === continent;
            const continentCountries = countries.filter((c) => c.continent === continent);
            const continentWatched = continentCountries.filter((c) =>
              watchedCountryCodes.has(c.code)
            ).length;

            return (
              <button
                key={continent}
                onClick={() => onSelectContinent(continent)}
                className={`px-3 py-1.5 rounded-t-lg font-bold transition-all shrink-0 border-t-2 border-l border-r flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#1b2f4a] border-t-amber-400 border-l-[#334155] border-r-[#0f172a] text-amber-300 shadow-[0_-2px_6px_rgba(0,0,0,0.4)]'
                    : 'bg-[#0a1322] border-t-[#1e293b] border-l-[#1e293b] border-r-[#0b1320] text-slate-400 hover:text-slate-200 hover:bg-[#111e33]'
                }`}
              >
                <span>{icon}</span>
                <span>{continent}</span>
                <span className="text-[10px] font-mono opacity-70">
                  ({continentWatched}/{continentCountries.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
