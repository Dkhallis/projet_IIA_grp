# CAMPUSHELP - Frontend

Application de gestion des signalements pour les établissements scolaires.

## Description

CampusHelp est une application web qui permet aux étudiants et au personnel de signaler facilement les problèmes rencontrés dans leur établissement.

## Fonctionnalites

- Formulaire de connexion avec adresse e-mail et mot de passe
- Verification des champs obligatoires
- Affichage ou masquage du mot de passe
- Message de confirmation apres une connexion reussie
- Interface responsive adaptee aux ecrans mobiles et aux ordinateurs
- Gestion des signalements pour les etablissements scolaires

## Prerequis

- Node.js
- npm

## Installation

```bash
npm install
```

## Developpement

Lancez le serveur de developpement :

```bash
npm run dev
```

L'application sera ensuite accessible a l'adresse indiquee par Vite dans le terminal.

## Configuration Supabase

Voir le fichier `.env.example` pour les variables nécessaires.

## Technologies

- React 18 + TypeScript
- Supabase (Auth + PostgreSQL)
- React Router DOM v6
- Vite
- JavaScript
- CSS
- Oxlint

## Structure

- `src/components/auth/` : Formulaires et routes protegées
- `src/context/` : Contexte d'authentification
- `src/hooks/` : Hooks personnalisés
- `src/lib/supabase/` : Client et types Supabase
- `src/pages/` : Pages de l'application
- `src/types/` : Types TypeScript

## Scripts

- `npm run dev` : Démarrer le développement
- `npm run build` : Build pour la production
- `npm run preview` : Prévision de la build
- `npm run lint` : Verifie le code avec Oxlint
