import React, { useState } from 'react';
import type { Country, Movie } from '../types';

import { Plus, X, Film, Check } from 'lucide-react';
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

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white m-0">
              Ajout manuel d'un film
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Titre du film *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Le Fabuleux Destin d'Amélie Poulain"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Année de sortie
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 2001"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: Drame, Comédie"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Réalisateur(trice)
            </label>
            <input
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="Ex: Jean-Pierre Jeunet"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL de l'affiche (optionnel)
            </label>
            <input
              type="url"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pays associé(s) * (co-productions possibles)
            </label>
            <div className="max-h-36 overflow-y-auto p-2 bg-slate-950 border border-slate-700 rounded-xl space-y-1">
              {allCountries
                .slice()
                .sort((a, b) => a.frenchName.localeCompare(b.frenchName))
                .map((c) => {
                  const isChecked = selectedCountryCodes.includes(c.code);
                  return (
                    <div
                      key={c.code}
                      onClick={() => handleToggleCountry(c.code)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-amber-500/20 text-amber-300 font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{c.flag}</span>
                        <span>{c.frenchName}</span>
                        <span className="text-slate-500 text-[10px]">({c.continent})</span>
                      </span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes / Commentaire personnel
            </label>
            <textarea
              rows={2}
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Vos impressions..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter le film</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
