import React, { useRef, useState } from 'react';
import {
  Search,
  Download,
  Upload,
  Plus,
  Shuffle,
  User as UserIcon,
  LogOut,
  ChevronDown,
  MoreVertical,
  Settings,
  Disc,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenManualAdd: () => void;
  onOpenRandomCountry: () => void;
  onOpenAuthModal: () => void;
  onExport: () => void;
  onImport: (jsonStr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenManualAdd,
  onOpenRandomCountry,
  onOpenAuthModal,
  onExport,
  onImport
}) => {
  const { user, signOut, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-30 bg-[#0c1626] border-b-2 border-[#1e3a8a] shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
      {/* Top Filmstrip Perforation Bar */}
      <div className="bg-[#050b14] h-2.5 w-full flex items-center justify-around border-b border-[#1e293b] px-2 overflow-hidden">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-[#1e293b] rounded-[1px] shrink-0" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand / Logo 2000s Style */}
          <div className="flex items-center space-x-3 cursor-pointer select-none">
            <div className="p-2 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 rounded-lg border-t border-l border-amber-200 border-r-2 border-b-2 border-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.5)] text-slate-950 flex items-center justify-center">
              <Disc className="w-6 h-6 animate-[spin_8s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white m-0 uppercase font-sans drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  WorldWide<span className="text-amber-400 font-extrabold underline decoration-amber-500 decoration-2">Movie</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 m-0 font-medium tracking-tight">
                ★ Le Tour du Monde du 7ème Art ★
              </p>
            </div>
          </div>

          {/* Center Search Bar 2000s Style */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#070e1a] hover:bg-[#0a1424] border-2 border-[#1e3a8a] text-slate-300 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] group text-left"
            >
              <span className="flex items-center space-x-2 text-xs text-slate-400 group-hover:text-amber-300">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Rechercher un film (TMDB)...</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#162438] text-amber-300 border border-[#334155] rounded">
                ⌘K
              </span>
            </button>
          </div>

          {/* Action Buttons 2000s Style */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-lg btn-y2k-primary text-slate-950"
              title="Rechercher un film"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Random Country Button */}
            <button
              onClick={onOpenRandomCountry}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg btn-y2k-secondary text-xs"
              title="Découvrir un pays au hasard"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              <span>[ Hasard ]</span>
            </button>

            {/* Manual Add Button */}
            <button
              onClick={onOpenManualAdd}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg btn-y2k-secondary text-xs"
              title="Ajouter un film manuellement"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>[ Manuel ]</span>
            </button>

            {/* Hidden JSON file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            {/* User Auth Section */}
            {!loading && (
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg btn-y2k-secondary text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-black flex items-center justify-center text-[10px] border border-amber-100">
                        {userInitial}
                      </div>
                      <span className="hidden md:inline-block max-w-[110px] truncate font-bold text-slate-100">
                        {user.email?.split('@')[0]}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Synchronisé au cloud" />
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {/* Authenticated Dropdown Menu 2000s Style */}
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-[#0e1a2d] border-2 border-[#1e3a8a] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.8)] z-50 p-2 space-y-1 animate-fade-in divide-y divide-[#1e293b]">
                          {/* User Header */}
                          <div className="px-2.5 py-2">
                            <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                              <HardDrive className="w-3 h-3" />
                              <span>Serveur Cloud Connecté</span>
                            </div>
                            <p className="text-xs text-white font-bold truncate m-0 font-mono">
                              {user.email}
                            </p>
                          </div>

                          {/* Data backup options */}
                          <div className="py-1 space-y-0.5">
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                onExport();
                              }}
                              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs text-slate-300 hover:text-amber-300 hover:bg-[#162740] transition-colors text-left"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>💾 Exporter ma collection (.JSON)</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                fileInputRef.current?.click();
                              }}
                              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs text-slate-300 hover:text-amber-300 hover:bg-[#162740] transition-colors text-left"
                            >
                              <Upload className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>📂 Importer une sauvegarde (.JSON)</span>
                            </button>
                          </div>

                          {/* Logout */}
                          <div className="pt-1">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-bold text-left"
                            >
                              <LogOut className="w-3.5 h-3.5 shrink-0" />
                              <span>[ Déconnexion ]</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    {/* Login / Signup Button */}
                    <button
                      onClick={onOpenAuthModal}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg btn-y2k-primary text-xs"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>[ Connexion ]</span>
                    </button>

                    {/* Guest Options Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsGuestMenuOpen(!isGuestMenuOpen)}
                        className="p-1.5 rounded-lg btn-y2k-secondary text-slate-300"
                        title="Options et sauvegardes"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {isGuestMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsGuestMenuOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 w-56 bg-[#0e1a2d] border-2 border-[#1e3a8a] rounded-lg shadow-2xl z-50 p-2 space-y-1 animate-fade-in">
                            <div className="px-2 py-1 text-[10px] text-amber-400 font-bold uppercase tracking-wider border-b border-[#1e293b]">
                              ★ Sauvegardes Locales
                            </div>

                            <button
                              onClick={() => {
                                setIsGuestMenuOpen(false);
                                onExport();
                              }}
                              className="w-full flex items-center space-x-2 px-2 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-[#162740] transition-colors text-left"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-400" />
                              <span>💾 Exporter (.JSON)</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsGuestMenuOpen(false);
                                fileInputRef.current?.click();
                              }}
                              className="w-full flex items-center space-x-2 px-2 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-[#162740] transition-colors text-left"
                            >
                              <Upload className="w-3.5 h-3.5 text-amber-400" />
                              <span>📂 Importer (.JSON)</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsGuestMenuOpen(false);
                                onOpenAuthModal();
                              }}
                              className="w-full flex items-center space-x-2 px-2 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-[#162740] transition-colors text-left border-t border-[#1e293b] pt-1.5"
                            >
                              <Settings className="w-3.5 h-3.5 text-amber-400" />
                              <span>⚙️ Configuration Clés</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filmstrip Lower Border */}
      <div className="bg-[#050b14] h-1.5 w-full border-t border-[#1e293b]" />
    </header>
  );
};
