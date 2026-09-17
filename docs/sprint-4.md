# Sprint 4 — Intégration, déploiement & rendu

- **Date :** mercredi 16 septembre 2026 (après-midi, 0,5 j) + merges finaux jeudi 17 au matin
- **Équipe :** Hadrien Cup, Oscar Beaugas, Kylian Dupuis, Inâs Tifaoui

## Sprint Goal

Assembler les modules sur `main`, finaliser l'interface, déployer l'application en public et préparer le rendu.

## Sprint Backlog

| # | Tâche | Responsable | Estimation | Statut |
|---|-------|-------------|:----------:|:------:|
| T1 | Finaliser l'interface CampusHelp | Hadrien | 3 pts | ✅ |
| T2 | Déploiement WAMP + `.htaccess` | Hadrien | 2 pts | ✅ |
| T3 | Mise en production publique (Vercel) | Hadrien | 2 pts | ✅ |
| T4 | Merge de `Produit-final` dans `main` + conflits README | Hadrien | 3 pts | ✅ |
| T5 | Remplacement de l'admin de démo par `ADMINISTRATEUR` | Hadrien | 1 pt | ✅ |
| T6 | Mise à jour du lien de production | Oscar | 1 pt | ✅ |
| T7 | Merge des branches `messagerie-et-notifications` et `CampusHelp` sur `main` | Kylian, Inâs | 3 pts | ✅ |
| T8 | Brancher Supabase sur l'app React (auth, profils, notifications, commentaires) | Oscar, Inâs | 5 pts | ✅ |
| T9 | Inscription + connexion auto, page de profil, commentaires, attribution + priorité | Kylian, Oscar, Inâs | 5 pts | ✅ |
| T10 | Câblage Supabase complet dans le dépôt (client, dépendance, migrations, `.env`) | Oscar | 5 pts | ⏳ |
| T11 | Statistiques / historique dans l'app livrée (US18, US19) | Équipe | 11 pts | ⏳ |

![Sprint Backlog — Sprint 4](../captures/sprint-4-backlog.png)

## Qui a fait quoi

- **Hadrien Cup** — Finalisation de l'interface, déploiement WAMP + `.htaccess`, mise en production sur Vercel, merge de `Produit-final` dans `main` avec résolution des conflits README, remplacement de l'administrateur de démo par `ADMINISTRATEUR`.
- **Oscar Beaugas** — Mise à jour du lien de production ; branchement de Supabase sur l'app React (auth, profils, requêtes `demandes` / `commentaires` / `notifications`), attribution d'un intervenant et priorité modifiable sur les signalements.
- **Kylian Dupuis** — Merge de la branche `CampusHelp` sur `main` ; champ « Lieu » libre + connexion auto après inscription, affichage/ajout des commentaires, correction des droits de gestion des signalements.
- **Inâs Tifaoui** — Merge de `main` dans `messagerie-et-notifications`, ajout des notifications, de l'inscription et de la page de profil dans l'app React, easter egg « Où est le dino », et rédaction de la documentation du sprint et du bilan de projet.

## Tâches terminées

- Interface finalisée et application fonctionnelle.
- Déploiement public sur Vercel : https://projet-iia-grp.vercel.app/
- Déploiement local WAMP + `.htaccess` opérationnel.
- Toutes les branches mergées sur `main` (`Produit-final`, `CampusHelp`, `messagerie-et-notifications`).
- **App React branchée sur Supabase** : connexion + **inscription** (connexion auto), **profil** (nom, mot de passe), **notifications** en base, **commentaires** affichés et ajoutables sous un signalement.
- **US14** attribution d'un intervenant et **US20** priorité (`Faible` / `Normale` / `Haute` / `Urgente`) sur les signalements.
- Easter egg « Où est le dino » caché sur toutes les pages ; renommage de l'établissement en « IIA de Laval ».
- Merge final conservant la **version Supabase** de `App.jsx`.
- Nettoyage des données de démo.

## Tâches non terminées

- **Câblage Supabase à finir dans le dépôt** : `src/App.jsx` appelle Supabase, mais le module client `src/lib/supabase.js`, la dépendance `@supabase/supabase-js`, les migrations SQL et les valeurs du `.env` ne sont pas encore commités → l'app ne se lance pas telle quelle après un `git clone`.
- Le merge final a **conservé la version Supabase** de `App.jsx` : la variante `localStorage` plus riche (messagerie, page « Tous les signalements », statistiques, historique) n'est pas dans l'app livrée sur `main`.
- US18 (statistiques) et US19 (historique) : présentes dans la variante `localStorage` mais pas dans l'app Supabase livrée.
- Pages HTML/JS autonomes historiques (`messages.html`, `notifications.html`, `demandes/`) laissées dans le dépôt, non reliées à l'app React.

## Problèmes rencontrés

- L'intégration a été le principal goulot d'étranglement : assembler 4 branches aux approches différentes (application React + pages HTML autonomes, JS + TS, localStorage + Supabase) a pris le temps prévu pour finaliser les écrans admin.
- Conflits Git au merge de `Produit-final` (README notamment), résolus manuellement.
- Merges finaux réalisés jeudi matin, juste avant le rendu.
- Écart entre la stack annoncée dans le README (TypeScript + Supabase) et la stack effectivement déployée (JavaScript + localStorage).

## Décisions prises

- Prioriser un produit déployé et démontrable (Vercel, localStorage) plutôt qu'une intégration Supabase incomplète avant le rendu.
- Tout merger sur `main`, y compris les modules de chacun.
- Documenter l'intégration Supabase comme chantier restant.
- Reporter statistiques/historique/priorités et l'attribution d'intervention.

## Comptes rendus des Daily Scrum

**Daily — 14h10**
- Fait : interface en cours de finalisation, WAMP configuré.
- À faire : déployer en public, merger les branches sur `main`.
- Blocages : intégration Supabase lourde.

**Daily — 15h15**
- Fait : déploiement Vercel en ligne, lien de production documenté.
- À faire : merge `Produit-final`, résoudre les conflits README.
- Blocages : conflits Git à résoudre.

**Daily — 16h30**
- Fait : `Produit-final` mergé sur `main`, admin de démo nettoyé.
- À faire : merges finaux des branches restantes.
- Blocages : Supabase non intégrable dans le temps restant.

**Daily — jeudi 17, 09h45**
- Fait : merge de `messagerie-et-notifications` et `CampusHelp` sur `main`.
- À faire : vérifier `main`, envoyer le rendu.
- Blocages : aucun.

## Sprint Review

Présentation de l'application en ligne sur Vercel : connexion, création/consultation/recherche/modification/commentaires de signalements, changement de statut, messagerie/notifications. La base Supabase et les écrans admin existent mais ne sont pas branchés à l'app livrée. Produit déployé et mergé sur `main`, avec un chantier d'intégration identifié.

## Sprint Retrospective (Keep / Drop / Try)

| Keep | Drop | Try |
|------|------|-----|
| Le déploiement public livré (Vercel) | Repousser toute l'intégration au dernier sprint | Intégrer en continu tout au long des sprints |
| Le merge complet sur `main` | Laisser diverger annonce README et stack réelle | Aligner la doc sur ce qui est déployé |
| La couverture fonctionnelle large | Les merges de dernière minute | Figer une seule cible technique dès le sprint 2 |

## Bilan de fin de projet

- **Livré et en ligne (Vercel) :** connexion + inscription, profil, signalements (création, liste, recherche, filtres, commentaires, statut, priorité, attribution d'intervenant), notifications, gestion des utilisateurs — app React **branchée sur Supabase**.
- **Développé en parallèle mais non retenu sur `main` :** variante `localStorage` avec messagerie, page « Tous les signalements », statistiques, historique.
- **À finir :** committer la config Supabase (client, dépendance, migrations, `.env`) pour un dépôt exécutable ; réintégrer statistiques (US18) et historique (US19).
- **Hébergement public :** en ligne sur Vercel.
- **Merge :** toutes les branches consolidées sur `main`.
