# WorldWideMovie

Application web pour tenir un défi simple : voir au moins un film de chaque pays du monde. 197 pays
groupés par continent, recherche de films, notes personnelles, et une liste qui suit d'un navigateur
à l'autre.

En ligne : https://drongier.github.io/WorldWideMovie/

## Fonctionnalités

- liste de 197 pays en français avec drapeaux et continents, complétée au chargement par l'API REST
  Countries. Les alias couvrent les États qui n'existent plus (URSS, Yougoslavie, Tchécoslovaquie,
  Allemagne de l'Ouest) pour que les films anciens restent rattachables
- recherche de films sur TMDB avec affiches, année, réalisateur, genre, durée et synopsis
- détection automatique des pays de production et de coproduction : un film franco-italien peut
  compter pour la France et l'Italie, avec les pays partenaires affichés sur la fiche
- note sur cinq étoiles et commentaire libre pour chaque film
- filtres par continent, recherche par nom, tri entre pays vus et pays à découvrir, barre de
  statistiques
- tirage au sort d'un pays où rien n'a encore été vu
- ajout manuel pour les films introuvables dans la base
- mode invité sans inscription (localStorage), export et import de la liste en JSON, puis migration
  vers le compte à la première connexion
- compte utilisateur et synchronisation de la liste dans Supabase

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4, Lucide React, canvas-confetti
- Supabase : authentification, base Postgres, Edge Function Deno
- TMDB pour les données de films, REST Countries pour le rafraîchissement des pays
- oxlint pour le lint
- GitHub Pages et GitHub Actions pour le déploiement

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

| Script | Effet |
|---|---|
| `npm run dev` | serveur de développement Vite |
| `npm run build` | vérification TypeScript puis build de production dans `dist/` |
| `npm run preview` | sert le build de production en local |
| `npm run lint` | oxlint |

## Variables d'environnement

Dans `.env`, toutes optionnelles pour un premier lancement :

- `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` : projet Supabase. Sans ces valeurs, l'application
  démarre en mode invité et propose de saisir la configuration dans l'interface, qu'elle garde
  ensuite dans le localStorage.
- `VITE_TMDB_API_KEY` : secours uniquement. La recherche passe normalement par l'Edge Function, qui
  garde la clé côté serveur.

## Backend Supabase

Pour activer les comptes et la synchronisation :

1. Créer un projet Supabase et récupérer l'URL du projet avec la clé `anon`.
2. Créer la table `user_movies` avec le schéma attendu par l'application :

```sql
create table public.user_movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  imdb_id text not null,
  title text not null,
  year text,
  poster text,
  director text,
  actors text,
  plot text,
  genre text,
  imdb_rating text,
  runtime text,
  country_raw text,
  country_codes text[] not null default '{}',
  user_rating integer,
  user_note text,
  added_at bigint not null,
  created_at timestamptz not null default now(),
  unique (user_id, imdb_id)
);

alter table public.user_movies enable row level security;

create policy "own_rows" on public.user_movies
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

La contrainte `unique (user_id, imdb_id)` porte l'upsert : un film déjà présent pour un utilisateur
est mis à jour au lieu d'être dupliqué, ce qui permet d'ajouter un second pays à un même film.

3. Déployer l'Edge Function qui sert de proxy TMDB :

```bash
supabase functions deploy tmdb-proxy
supabase secrets set TMDB_API_KEY=votre_cle_tmdb
```

Elle accepte `TMDB_API_KEY` ou `TMDB_ACCESS_TOKEN`, et expose les actions `search` et `detail`. Le
navigateur n'a jamais la clé : l'authentification auprès de TMDB se fait dans la fonction.

4. Renseigner les secrets du dépôt GitHub pour le déploiement : `VITE_SUPABASE_URL` et
   `VITE_SUPABASE_ANON_KEY` (secrets ou variables, le workflow accepte les deux).

## Déploiement

Le workflow `.github/workflows/deploy.yml` construit l'application à chaque push sur `main` et la
publie sur GitHub Pages. Vite utilise `base: /WorldWideMovie/` en production, ce qui correspond au
chemin du site de projet sur Pages.

## Structure du projet

```
src/App.tsx                    état de l'application et orchestration des modales
src/components/                Navbar, CountryList, CountryCard, MovieCard,
                               MovieSearchModal, ManualMovieModal, RandomCountryModal,
                               StatsBar, AuthModal, ErrorBoundary
src/contexts/AuthContext.tsx   session Supabase et utilisateur courant
src/services/                  accès aux données : tmdbApi, countriesApi, supabase,
                               supabaseStorage, storage
src/data/countriesData.ts      liste locale des 197 pays (nom, drapeau, continent, alias)
src/types.ts                   types partagés
supabase/functions/tmdb-proxy  Edge Function Deno qui masque la clé TMDB
```

## Restes à faire

- les films dont la production n'est pas identifiable (souvent des coproductions mal renseignées
  dans la base) demandent encore un ajout manuel
- aucun test automatisé pour l'instant
