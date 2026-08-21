import React, { useState } from 'react';
import type { Country, Movie } from '../types';

import { X, Check, Disc } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManualMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCountries: Country[];
  onAddMovie: (movie: Movie, countryCodes: string[]) => void;
  presetCountryCode?: string;
}

export const ManualMovieModal: React.FC<ManualMovieModalProps> = ({
  isOpen,
  onClose,
  allCountries,
  onAddMovie,
  presetCountryCode
}) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [director, setDirector] = useState('');
  const [genre, setGenre] = useState('');
  const [poster, setPoster] = useState('');
  const [userRating, setUserRating] = useState<number>(0);
  const [userNote, setUserNote] = useState('');
  const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>(
    presetCountryCode ? [presetCountryCode] : []
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Veuillez entrer un titre de film.');
      return;
    }
    if (selectedCountryCodes.length === 0) {
      alert('Veuillez sélectionner au moins un pays.');
      return;
    }

    const matchedCountries = allCountries.filter((c) =>
      selectedCountryCodes.includes(c.code)
    );
    const countryRaw = matchedCountries.map((c) => c.frenchName).join(', ');

    const manualMovie: Movie = {
      imdbID: `manual_${Date.now()}`,
      title: title.trim(),
      year: year.trim() || 'Inconnue',
      poster: poster.trim(),
      director: director.trim() || 'Inconnu',
      genre: genre.trim() || undefined,
      countryRaw,
      countryCodes: selectedCountryCodes,
      addedAt: Date.now(),
      userRating: userRating > 0 ? userRating : undefined,
      userNote: userNote.trim() || undefined
    };

    onAddMovie(manualMovie, selectedCountryCodes);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setYear(new Date().getFullYear().toString());
    setDirector('');
    setGenre('');
    setPoster('');
    setUserRating(0);
    setUserNote('');
    setSelectedCountryCodes(presetCountryCode ? [presetCountryCode] : []);
    onClose();
  };

  const handleToggleCountry = (code: string) => {
    setSelectedCountryCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0d1724] border-2 border-[#1e3a8a] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Retro Window Titlebar */}
        <div className="window-titlebar px-4 py-2 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider font-sans">
            <Disc className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Ajout Manuel d'un Film</span>
          </div>

          <button
            onClick={handleClose}
            className="w-6 h-6 rounded bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center border-t border-l border-red-300 border-b-2 border-r-2 border-red-950 shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-300">Titre du film *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: La Grande Illusion"
              className="w-full px-3 py-1.5 bg-[#050b14] border-2 border-[#1e3a8a] rounded text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-300">Année de sortie</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="ex: 1937"
                className="w-full px-3 py-1.5 bg-[#050b14] border-2 border-[#1e3a8a] rounded text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-300">Réalisateur(trice)</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="ex: Jean Renoir"
                className="w-full px-3 py-1.5 bg-[#050b14] border-2 border-[#1e3a8a] rounded text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-300">Genre(s)</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="ex: Drame, Guerre"
                className="w-full px-3 py-1.5 bg-[#050b14] border-2 border-[#1e3a8a] rounded text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-300">URL de l'affiche</label>
              <input
                type="url"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-[#050b14] border-2 border-[#1e3a8a] rounded text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="space-y-1 bg-[#070e1a] p-2.5 rounded border border-[#1e3a8a]">
            <label className="text-[11px] font-bold uppercase text-amber-300">
              Pays associé(s) * ({selectedCountryCodes.length})
            </label>
            <div className="max-h-28 overflow-y-auto p-1.5 bg-[#030712] rounded border border-[#1e293b] grid grid-cols-2 gap-1 text-[11px]">
              {allCountries.map((country) => {
                const isSelected = selectedCountryCodes.includes(country.code);
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleToggleCountry(country.code)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-left truncate transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-[#162740]'
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span className="truncate">{country.frenchName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-300">Notes / Critique (optionnel)</label>
            <textarea
              rows={2}
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Votre avis sur le film..."
              className="w-full px-3 py-1.5 bg-[#050b14] border-2 border-[#1e3a8a] rounded text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 rounded btn-y2k-secondary text-xs"
            >
              [ Annuler ]
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded btn-y2k-primary text-xs flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>[ Enregistrer le film ]</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
