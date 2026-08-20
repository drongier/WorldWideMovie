import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  X,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Film,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthTab = 'login' | 'register' | 'forgot_password';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const {
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPasswordForEmail
  } = useAuth();

  const [tab, setTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleTabChange = (newTab: AuthTab) => {
    resetFormState();
    setTab(newTab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (tab === 'login') {
        const { error } = await signInWithEmail(email.trim(), password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Email ou mot de passe incorrect.');
          } else if (error.message.includes('Email not confirmed')) {
            setErrorMessage('Veuillez confirmer votre email avant de vous connecter (vérifiez vos spams).');
          } else {
            setErrorMessage(error.message || 'Erreur lors de la connexion.');
          }
        } else {
          onSuccess?.();
          onClose();
        }
      } else if (tab === 'register') {
        if (password.length < 6) {
          setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Les mots de passe ne correspondent pas.');
          setIsLoading(false);
          return;
        }

        const { error, user } = await signUpWithEmail(email.trim(), password);
        if (error) {
          if (error.message.includes('already registered')) {
            setErrorMessage('Un compte existe déjà avec cet email.');
          } else {
            setErrorMessage(error.message || 'Erreur lors de la création du compte.');
          }
        } else {
          if (user && user.identities && user.identities.length === 0) {
            setErrorMessage('Cet email est déjà enregistré.');
          } else {
            setSuccessMessage(
              'Compte créé avec succès ! Si la confirmation par email est activée, vérifiez votre boîte de réception.'
            );
            // If session auto-created:
            setTimeout(() => {
              onSuccess?.();
              onClose();
            }, 1500);
          }
        }
      } else if (tab === 'forgot_password') {
        if (!email) {
          setErrorMessage('Veuillez entrer votre adresse email.');
          setIsLoading(false);
          return;
        }
        const { error } = await resetPasswordForEmail(email.trim());
        if (error) {
          setErrorMessage(error.message || 'Erreur lors de l\'envoi du lien de réinitialisation.');
        } else {
          setSuccessMessage('Un email de réinitialisation vous a été envoyé si l\'adresse existe.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage('Erreur de connexion avec Google : ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Cinema branding */}
        <div className="relative p-6 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
                {tab === 'login' && 'Connexion'}
                {tab === 'register' && 'Créer un compte'}
                {tab === 'forgot_password' && 'Mot de passe oublié'}
              </h2>
              <p className="text-xs text-slate-400">
                {tab === 'login' && 'Synchronisez vos films et accédez-y de partout'}
                {tab === 'register' && 'Démarrez votre carnet de voyage cinématographique'}
                {tab === 'forgot_password' && 'Recevez un lien par email pour réinitialiser votre accès'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missing Supabase configuration alert (if applicable) */}
        {!isConfigured && (
          <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 text-amber-200 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Configuration Supabase requise</span>
            </div>
            <p className="text-slate-300">
              Les variables <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_URL</code> et <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code> ne sont pas encore configurées dans votre fichier <code className="text-amber-300">.env</code>.
            </p>
          </div>
        )}

        {/* Tabs for switching Login / Register */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1 gap-1">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              tab === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Se connecter</span>
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              tab === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>S'inscrire</span>
          </button>
        </div>

        {/* Modal Body & Form */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Adresse Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Password Field (for login / register) */}
            {tab !== 'forgot_password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mot de passe</span>
                  </label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleTabChange('forgot_password')}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Oublié ?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>
            )}

            {/* Confirm Password (only for register) */}
            {tab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confirmer le mot de passe</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isConfigured}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  {tab === 'login' && <LogIn className="w-4 h-4" />}
                  {tab === 'register' && <UserPlus className="w-4 h-4" />}
                  {tab === 'forgot_password' && <KeyRound className="w-4 h-4" />}
                  <span>
                    {tab === 'login' && 'Se connecter'}
                    {tab === 'register' && 'Créer mon compte'}
                    {tab === 'forgot_password' && 'Envoyer le lien de réinitialisation'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social Google Login */}
          {tab !== 'forgot_password' && isConfigured && (
            <div className="space-y-3 pt-2">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-900 px-3 text-xs text-slate-500 font-medium uppercase tracking-wider">
                  ou
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-xs flex items-center justify-center space-x-2.5 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>
            </div>
          )}

          {/* Benefits summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avantages d'un compte WorldWideMovie</span>
            </div>
            <p className="m-0 leading-relaxed">
              • Sauvegarde automatique dans le Cloud (Supabase PostgreSQL)<br />
              • Vos films et statistiques accessibles sur ordinateur, smartphone et tablette<br />
              • Espace 100% privé et sécurisé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
