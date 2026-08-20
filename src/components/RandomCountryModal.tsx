import React, { useState } from 'react';
import type { Country } from '../types';

import { Shuffle, X, Film, Compass, Sparkles, ExternalLink } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6 text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base font-bold text-white m-0">
              Inspiration Cinématographique
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {unwatchedCountries.length === 0 ? (
          <div className="py-8 space-y-3">
            <div className="text-5xl">🏆</div>
            <h4 className="text-lg font-bold text-white">Incroyable !</h4>
            <p className="text-xs text-slate-400">
              Vous avez vu au moins un film dans chaque pays du monde !
            </p>
          </div>
        ) : currentCountry ? (
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 shadow-inner">
              <div className="text-6xl sm:text-7xl mb-3 transform hover:scale-110 transition-transform">
                {currentCountry.flag}
              </div>
              <h4 className="text-2xl font-black text-white m-0">
                {currentCountry.frenchName}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {currentCountry.name} • <span className="text-amber-400 font-semibold">{currentCountry.continent}</span>
              </p>
              <div className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-400">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{unwatchedCountries.length} pays restent à explorer</span>
              </div>
            </div>

            {/* Google Search Link helper */}
            <div>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`Liste film ${currentCountry.frenchName}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all"
              >
                <span>🔍 Trouver des idées : Liste films {currentCountry.frenchName}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRollAgain}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
              >
                <Shuffle className="w-4 h-4" />
                <span>Autre pays</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCountryToSearch(currentCountry);
                  onClose();
                }}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                <Film className="w-4 h-4" />
                <span>Ajouter un film</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

