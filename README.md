# CampusHelp

Application web de gestion des **signalements** pour les établissements scolaires.
Les étudiants signalent un problème (matériel, Wi-Fi, salle…), le personnel le prend en charge et le suit, l'administrateur gère les référentiels et consulte des statistiques.

- 🌐 **En production :** https://projet-iia-grp.vercel.app/
- 📦 **Dépôt :** [Dkhallis/projet_IIA_grp](https://github.com/Dkhallis/projet_IIA_grp)
- 👥 **Groupe 1** — Hadrien Cup · Oscar Beaugas · Kylian Dupuis · Inâs Tifaoui

---

## Documentation Scrum

### Product Backlog & cadre

- [Product Backlog](docs/product-backlog.md)
- [User Stories](docs/product-backlog.md#6-user-stories-détaillées)
- [Critères d'acceptation](docs/product-backlog.md#6-user-stories-détaillées)
- [Definition of Ready (DoR)](docs/product-backlog.md#2-definition-of-ready-dor)
- [Definition of Done (DoD)](docs/product-backlog.md#3-definition-of-done-dod)
- [Estimation — Planning Poker](docs/product-backlog.md#4-estimation--planning-poker-fibonacci)
- [Modèle de données (schéma Supabase)](docs/product-backlog.md#5-modèle-de-données-schéma-supabase)

### Sprint 1 — Cadrage & initialisation → [`docs/sprint-1.md`](docs/sprint-1.md)

[Sprint Goal](docs/sprint-1.md#sprint-goal) · [Sprint Backlog](docs/sprint-1.md#sprint-backlog) · [Qui a fait quoi](docs/sprint-1.md#qui-a-fait-quoi) · [Tâches terminées](docs/sprint-1.md#tâches-terminées) · [Tâches non terminées](docs/sprint-1.md#tâches-non-terminées) · [Problèmes rencontrés](docs/sprint-1.md#problèmes-rencontrés) · [Décisions prises](docs/sprint-1.md#décisions-prises) · [Daily Scrum](docs/sprint-1.md#comptes-rendus-des-daily-scrum) · [Sprint Review](docs/sprint-1.md#sprint-review) · [Rétrospective](docs/sprint-1.md#sprint-retrospective-keep--drop--try)

### Sprint 2 — Première brique : signalements → [`docs/sprint-2.md`](docs/sprint-2.md)

[Sprint Goal](docs/sprint-2.md#sprint-goal) · [Sprint Backlog](docs/sprint-2.md#sprint-backlog) · [Qui a fait quoi](docs/sprint-2.md#qui-a-fait-quoi) · [Tâches terminées](docs/sprint-2.md#tâches-terminées) · [Tâches non terminées](docs/sprint-2.md#tâches-non-terminées) · [Problèmes rencontrés](docs/sprint-2.md#problèmes-rencontrés) · [Décisions prises](docs/sprint-2.md#décisions-prises) · [Daily Scrum](docs/sprint-2.md#comptes-rendus-des-daily-scrum) · [Sprint Review](docs/sprint-2.md#sprint-review) · [Rétrospective](docs/sprint-2.md#sprint-retrospective-keep--drop--try)

### Sprint 3 — Développement cœur multi-profils → [`docs/sprint-3.md`](docs/sprint-3.md)

[Sprint Goal](docs/sprint-3.md#sprint-goal) · [Sprint Backlog](docs/sprint-3.md#sprint-backlog) · [Qui a fait quoi](docs/sprint-3.md#qui-a-fait-quoi) · [Tâches terminées](docs/sprint-3.md#tâches-terminées) · [Tâches non terminées](docs/sprint-3.md#tâches-non-terminées) · [Problèmes rencontrés](docs/sprint-3.md#problèmes-rencontrés) · [Décisions prises](docs/sprint-3.md#décisions-prises) · [Daily Scrum](docs/sprint-3.md#comptes-rendus-des-daily-scrum) · [Sprint Review](docs/sprint-3.md#sprint-review) · [Rétrospective](docs/sprint-3.md#sprint-retrospective-keep--drop--try)

### Sprint 4 — Intégration, déploiement & rendu → [`docs/sprint-4.md`](docs/sprint-4.md)

[Sprint Goal](docs/sprint-4.md#sprint-goal) · [Sprint Backlog](docs/sprint-4.md#sprint-backlog) · [Qui a fait quoi](docs/sprint-4.md#qui-a-fait-quoi) · [Tâches terminées](docs/sprint-4.md#tâches-terminées) · [Tâches non terminées](docs/sprint-4.md#tâches-non-terminées) · [Problèmes rencontrés](docs/sprint-4.md#problèmes-rencontrés) · [Décisions prises](docs/sprint-4.md#décisions-prises) · [Daily Scrum](docs/sprint-4.md#comptes-rendus-des-daily-scrum) · [Sprint Review](docs/sprint-4.md#sprint-review) · [Rétrospective](docs/sprint-4.md#sprint-retrospective-keep--drop--try) · [Bilan de fin de projet](docs/sprint-4.md#bilan-de-fin-de-projet)

---

## Équipe, rôles & branches

| Membre | GitHub | Module | Branche |
|--------|--------|--------|---------|
| Hadrien Cup | `@BLN53z00` | Connexion / utilisateurs / interface / déploiement | `Connexion-et-Utilisateurs`, `Produit-final` |
| Oscar Beaugas | `@Dkhallis` | Recherche / administration / base Supabase | `personne4-recherche-admin-bdd` |
| Kylian Dupuis | — | Signalements (création, recherche, statut, commentaires) | `CampusHelp` |
| Inâs Tifaoui | — | Messagerie / notifications · Documentation du projet | `messagerie-et-notifications` |

Documentation rédigée et mise en forme par **Inâs Tifaoui**. Toutes les branches ont été mergées sur `main`.

---

## Stack technique

- **Front-end :** React + Vite (JavaScript), CSS — persistance en `localStorage`.
- **Base de données :** Supabase / PostgreSQL — schéma `profiles`, `categories`, `lieux`, `demandes`, `reports` (`supabase/migrations/0001_init_schema.sql`), module admin/recherche en TypeScript.
- **Qualité :** Oxlint.
- **Déploiement :** Vercel (public) + WAMP (local, `.htaccess`).

## Installation

```bash
npm install
npm run dev
```

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur de développement |
| `npm run lint` | Analyse du code (Oxlint) |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation de la build |

---

## Déroulé des sprints

| Sprint | Date | Objectif |
|:------:|------|----------|
| 1 | Mar. 15 sept. 2026 (matin) | Cadrage & initialisation |
| 2 | Mar. 15 sept. 2026 (après-midi) | Première brique : signalements |
| 3 | Mer. 16 sept. 2026 (matin) | Développement cœur multi-profils |
| 4 | Mer. 16 sept. 2026 (après-midi) | Intégration, déploiement & rendu |

---

## Autres documents

- [`doc.md`](doc.md) — documentation de cadrage du Sprint 1.
- [`CampusHelp_Documentation.md`](CampusHelp_Documentation.md) — catalogue détaillé des 20 User Stories par profil.
- [`Répartiton.md`](Répartiton.md) — répartition des modules.
- [`Lien_de_mise_Prod.md`](Lien_de_mise_Prod.md) — lien de mise en production.
