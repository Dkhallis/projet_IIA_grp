# CampusHelp - Frontend

Application de gestion des signalements pour les établissements scolaires.

## Description

CampusHelp est une application web qui permet aux étudiants et au personnel de signaler facilement les problèmes rencontrés dans leur établissement.

## Technologies

- React 18 + TypeScript
- Supabase (Auth + PostgreSQL)
- React Router DOM v6
- Vite

## Installation

```bash
cd campushelp-frontend
npm install
cp .env.example .env
# Éditez .env avec vos informations Supabase
npm run dev
```

## Configuration Supabase

Voir le fichier `.env.example` pour les variables nécessaires.

## Structure

- `src/components/auth/` : Formulaires et routes protégées
- `src/context/` : Contexte d'authentification
- `src/hooks/` : Hooks personnalisés
- `src/lib/supabase/` : Client et types Supabase
- `src/pages/` : Pages de l'application
- `src/types/` : Types TypeScript

## Scripts

- `npm run dev` : Démarrer le développement
- `npm run build` : Build pour la production
- `npm run preview` : Prévision de la build
