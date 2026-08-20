import React, { useState } from 'react';
import { Key, Check, ExternalLink, X, AlertCircle, Loader2 } from 'lucide-react';
import { searchMoviesOMDb } from '../services/omdbApi';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey
}) => {
  const [inputValue, setInputValue] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    const key = inputValue.trim();
    if (!key) {
      onSaveApiKey('');
      setTestResult({ success: true, message: 'Clé réinitialisée.' });
      return;
    }

    setTesting(true);
    setTestResult(null);
    try {
      // Test search
      await searchMoviesOMDb('Avatar', key);
      setTestResult({ success: true, message: 'Clé valide ! Connexion à OMDb réussie.' });
      onSaveApiKey(key);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Clé invalide ou limite atteinte.'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white m-0">
              Configuration de la clé API OMDb
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed m-0">
          Pour rechercher instantanément tous les films du monde avec leurs affiches, réalisateurs et pays de production, vous avez besoin d'une clé d'API OMDb gratuite (1000 requêtes / jour).
        </p>

        {/* Tutorial box */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-amber-300">Comment obtenir votre clé en 10 secondes :</span>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>
              Rendez-vous sur{' '}
              <a
                href="https://www.omdbapi.com/apikey.aspx"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 underline hover:text-amber-300 inline-flex items-center space-x-0.5"
              >
                <span>omdbapi.com/apikey.aspx</span>
                <ExternalLink className="w-3 h-3 ml-0.5 inline" />
              </a>
            </li>
            <li>Choisissez l'option <strong className="text-slate-200">FREE</strong>, entrez votre email et votre nom.</li>
            <li>Cliquez sur le lien de validation reçu par email pour activer la clé.</li>
            <li>Collez votre clé ci-dessous !</li>
          </ol>
        </div>

        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Votre clé API OMDb :
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex: 8f4a2b9c"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Test feedback */}
        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center space-x-2 border ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleTestAndSave}
            disabled={testing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Enregistrer la clé</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
