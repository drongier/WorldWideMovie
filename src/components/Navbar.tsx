import React, { useRef, useState } from 'react';
import {
  Globe,
  Search,
  Download,
  Upload,
  Plus,
  Shuffle,
  User as UserIcon,
  LogOut,
  Cloud,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenManualAdd: () => void;
  onOpenRandomCountry: () => void;
  onOpenAuthModal: () => void;
  onExport: () => void;
  onImport: (jsonStr: string) => void;
  totalWatchedCountries: number;
  totalCountriesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenManualAdd,
  onOpenRandomCountry,
  onOpenAuthModal,
  onExport,
  onImport,
  totalWatchedCountries,
  totalCountriesCount
}) => {
  const { user, signOut, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut();
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

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
                <span>Rechercher un film à ajouter...</span>
              </span>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-900/80 rounded border border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
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
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all"
              title="Découvrir un pays au hasard qui n'a pas encore de film"
            >
              <Shuffle className="w-4 h-4 text-emerald-400" />
              <span>Hasard</span>
            </button>

            {/* Manual Add */}
            <button
              onClick={onOpenManualAdd}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all"
              title="Ajouter un film manuellement"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Manuel</span>
            </button>

            {/* Export & Import */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60">
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

            {/* User Auth Section */}
            {!loading && (
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-500/40 transition-all text-xs text-slate-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                        {userInitial}
                      </div>
                      <span className="hidden md:inline-block max-w-[120px] truncate font-medium text-slate-200">
                        {user.email?.split('@')[0]}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Synchronisé au cloud" />
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-fade-in">
                          <div className="px-3 py-2 border-b border-slate-800/80">
                            <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-medium mb-1">
                              <Cloud className="w-3.5 h-3.5" />
                              <span>Cloud Supabase actif</span>
                            </div>
                            <p className="text-xs text-slate-200 font-semibold truncate m-0">
                              {user.email}
                            </p>
                          </div>

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Se déconnecter</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onOpenAuthModal}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Connexion</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
