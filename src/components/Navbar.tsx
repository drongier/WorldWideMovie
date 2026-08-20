import React, { useRef } from 'react';
import { Globe, Search, Key, Download, Upload, Plus, Shuffle } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenManualAdd: () => void;
  onOpenApiKeyModal: () => void;
  onOpenRandomCountry: () => void;
  hasApiKey: boolean;
  onExport: () => void;
  onImport: (jsonStr: string) => void;
  totalWatchedCountries: number;
  totalCountriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenManualAdd,
  onOpenApiKeyModal,
  onOpenRandomCountry,
  hasApiKey,
  onExport,
  onImport,
  totalWatchedCountries,
  totalCountriesCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImport(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl shadow-md shadow-amber-500/20 text-slate-950">
              <Globe className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
                  WorldWide<span className="text-amber-400">Movie</span>
                </h1>
                <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium hidden sm:inline-block">
                  {totalWatchedCountries}/{totalCountriesCount} pays
                </span>
              </div>
              <p className="text-xs text-slate-400 m-0">
                1 film pour chaque pays du monde
              </p>
            </div>
          </div>


          {/* Center Search Bar Trigger */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-300 transition-all group shadow-inner"
            >
              <span className="flex items-center space-x-2.5 text-sm text-slate-400 group-hover:text-slate-200">
                <Search className="w-4 h-4 text-amber-400" />
                <span>Rechercher un film à ajouter (OMDb)...</span>
              </span>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-900/80 rounded border border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
              title="Rechercher un film"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Random Country Discovery */}
            <button
              onClick={onOpenRandomCountry}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all"
              title="Découvrir un pays au hasard qui n'a pas encore de film"
            >
              <Shuffle className="w-4 h-4 text-emerald-400" />
              <span>Hasard</span>
            </button>

            {/* Manual Add */}
            <button
              onClick={onOpenManualAdd}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all"
              title="Ajouter un film manuellement sans OMDb"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Manuel</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                hasApiKey
                  ? 'bg-slate-800/80 border-emerald-500/40 text-emerald-300 hover:bg-slate-800'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
              }`}
              title="Configurer la clé API OMDb"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">
                {hasApiKey ? 'Clé OMDb' : 'Clé OMDb requise'}
              </span>
            </button>

            {/* Export & Import */}
            <div className="flex items-center space-x-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60">
              <button
                onClick={onExport}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
                title="Exporter ma collection (JSON)"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
                title="Importer une sauvegarde (JSON)"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
