import React, { useState } from 'react';
import type { Country } from '../types';

import { Shuffle, X, Compass, ExternalLink, Disc } from 'lucide-react';

interface RandomCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  countryMovies: Record<string, string[]>;
  onSelectCountryToSearch: (country: Country) => void;
}

export const RandomCountryModal: React.FC<RandomCountryModalProps> = ({
  isOpen,
  onClose,
  countries,
  countryMovies,
  onSelectCountryToSearch
}) => {
  const unwatchedCountries = countries.filter(
    (c) => !(countryMovies[c.code] && countryMovies[c.code].length > 0)
  );

  const [currentCountry, setCurrentCountry] = useState<Country | null>(() => {
    if (unwatchedCountries.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * unwatchedCountries.length);
    return unwatchedCountries[randomIndex];
  });

  if (!isOpen) return null;

  const handleRollAgain = () => {
    if (unwatchedCountries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * unwatchedCountries.length);
    setCurrentCountry(unwatchedCountries[randomIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0d1724] border-2 border-[#1e3a8a] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden text-center">
        {/* Retro Window Titlebar */}
        <div className="window-titlebar px-4 py-2 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider font-sans">
            <Disc className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Générateur Aléatoire de Pays</span>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center border-t border-l border-red-300 border-b-2 border-r-2 border-red-950 shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {unwatchedCountries.length === 0 ? (
            <div className="py-8 space-y-2">
              <div className="text-5xl">🏆</div>
              <h4 className="text-base font-black text-white uppercase">Incroyable !</h4>
              <p className="text-xs text-slate-400">
                Vous avez vu au moins un film dans chaque pays du monde !
              </p>
            </div>
          ) : currentCountry ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#070e1a] border-2 border-[#1e3a8a] shadow-inner">
                <div className="text-6xl mb-2 select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {currentCountry.flag}
                </div>
                <h4 className="text-xl font-black text-white m-0 uppercase tracking-wide">
                  ★ {currentCountry.frenchName} ★
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentCountry.name} • <span className="text-amber-300 font-bold">{currentCountry.continent}</span>
                </p>
                <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#030712] text-[10px] text-slate-300 border border-[#1e293b]">
                  <Compass className="w-3 h-3 text-amber-400" />
                  <span>{unwatchedCountries.length} pays restants à explorer</span>
                </div>
              </div>

              {/* Google Search Link helper */}
              <div>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`Liste film ${currentCountry.frenchName}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold bg-[#0c1a2e] px-3 py-1 rounded border border-[#1e3a8a] transition-all"
                >
                  <span>🔍 Trouver des idées de films {currentCountry.frenchName}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={handleRollAgain}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded btn-y2k-secondary text-xs"
                >
                  <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[ Relancer ]</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCountryToSearch(currentCountry);
                    onClose();
                  }}
                  className="flex items-center space-x-1 px-4 py-1.5 rounded btn-y2k-primary text-xs"
                >
                  <span>[ Rechercher un film ]</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
