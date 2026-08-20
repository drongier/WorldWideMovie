# 🎬 WorldWideMovie — Défi Cinéma Mondial (1 film par pays)

**WorldWideMovie** est une application web conçue pour répertorier, suivre et découvrir au moins un film dans chaque pays du monde.

---

## ✨ Fonctionnalités

- 🌍 **Découpage par Continents & Tous les Pays du Monde** :
  - Groupement par continent (Europe, Asie, Afrique, Amériques, Océanie).
  - Intégration de l'API **REST Countries** avec base locale complète en français, drapeaux emojis et alias.
  - Filtres interactifs : par continent, par recherche de nom, et par statut (*Tous*, *Films vus uniquement ✅*, *À découvrir 🎯*).

- 🔍 **Recherche et Ajout de Films via OMDb API** :
  - Recherche instantanée avec affichage des affiches, années, types.
  - Récupération automatique des métadonnées (réalisateur, genre, note IMDb, durée, synopsis).
  - Détection automatique intelligente des pays d'origine et de co-production (ex: un film franco-italien est automatiquement proposé pour la France et l'Italie).

- 🤝 **Support des Co-productions** :
  - Possibilité d'associer un film à plusieurs pays en co-écriture/co-production.
  - Badges visuels indiquant les pays partenaires sur la fiche du film.

- ⭐ **Notes et Avis Personnels** :
  - Évaluation par étoiles (1 à 5 ⭐).
  - Notes et commentaires personnels sauvegardés pour chaque film.

- 🎲 **Mode Découverte & Hasard** :
  - Tireur au sort d'un pays où vous n'avez pas encore vu de film pour vous inspirer dans vos visionnages.

- 💾 **Sauvegarde locale & Export/Import JSON** :
  - Persistance automatique dans le navigateur (`localStorage`).
  - Exportation et importation en un clic de votre collection au format JSON pour ne jamais perdre vos données.

- ➕ **Ajout Manuel** :
  - Pour ajouter des films rares ou indépendants sans passer par OMDb.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancer l'application en mode développement
```bash
npm run dev
```
Ouvrez le lien indiqué (par exemple `http://localhost:5173`) dans votre navigateur.

### 3. Clé OMDb API (Gratuite)
1. Rendez-vous sur [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx).
2. Choisissez l'option **FREE**, indiquez votre nom et adresse email.
3. Validez l'email reçu pour activer votre clé.
4. Dans l'application WorldWideMovie, cliquez sur **« Clé OMDb »** en haut à droite et collez votre clé.

---

## 🛠️ Stack Technique

- **Framework** : React 19 + TypeScript + Vite
- **Styles** : Tailwind CSS v4 (Design cinéma sombre moderne)
- **Icônes** : Lucide React
- **Animations / Effets** : Canvas-Confetti
- **APIs** : REST Countries API & OMDb API

