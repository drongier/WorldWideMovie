import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'worldwidemovie_supabase_url';
const STORAGE_ANON_KEY = 'worldwidemovie_supabase_anon_key';

export function isValidHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      !str.includes('votre-projet') &&
      !str.includes('example')
    );
  } catch {
    return false;
  }
}

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

  let localUrl = '';
  let localKey = '';
  try {
    localUrl = localStorage.getItem(STORAGE_URL_KEY)?.trim() || '';
    localKey = localStorage.getItem(STORAGE_ANON_KEY)?.trim() || '';
  } catch {
    // localStorage not accessible
  }

  const url = envUrl && isValidHttpUrl(envUrl) ? envUrl : localUrl;
  const anonKey = envKey && !envKey.includes('votre_cle') ? envKey : localKey;

  return { url, anonKey };
}

export function setStoredSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  } catch (err) {
    console.error('Impossible d\'enregistrer la configuration Supabase dans le localStorage', err);
  }
}

export function clearStoredSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
  } catch (err) {
    console.error('Impossible d\'effacer la configuration Supabase du localStorage', err);
  }
}

const config = getStoredSupabaseConfig();
export const isSupabaseConfigured = Boolean(
  config.url &&
  config.anonKey &&
  isValidHttpUrl(config.url) &&
  !config.anonKey.includes('votre_cle')
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du client Supabase:', error);
    client = null;
  }
}

export const supabase = client;
