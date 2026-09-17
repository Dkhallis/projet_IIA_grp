# Documentation — CampusHelp

**Repo :** [Dkhallis/projet_IIA_grp](https://github.com/Dkhallis/projet_IIA_grp)

---

## 1. Présentation générale

**CampusHelp** est une application destinée aux établissements scolaires pour faciliter le **signalement** et le **suivi** des problèmes rencontrés au quotidien : ordinateur en panne, problème de Wi-Fi, matériel défectueux, souci dans une salle, etc.

### Objectif de l'application

- **Centraliser** tous les signalements de dysfonctionnements dans un seul outil, au lieu d'emails ou de passages physiques dispersés.
- **Faciliter le traitement** de ces signalements par le personnel technique/administratif.
- **Améliorer la communication** entre les étudiants (ou personnel) qui signalent un problème et les équipes qui le résolvent, grâce à un suivi de statut et des notifications.

### Public cible (3 profils)

| Profil | Rôle dans l'application |
|---|---|
| 🎓 **Étudiant** | Signale un problème et suit son avancement |
| 🏫 **Personnel** | Consulte, prend en charge et traite les signalements |
| 💼 **Administrateur** | Gère les utilisateurs, catégories, lieux et consulte les statistiques |

---

## 2. Fonctionnalités par profil

### 🎓 Profil Étudiant

| # | Fonctionnalité | Description |
|---|---|---|
| US01 | **Se connecter** | L'étudiant s'authentifie avec identifiant et mot de passe ; un message d'erreur s'affiche en cas d'échec. |
| US02 | **Créer un signalement** | Déclaration d'un problème avec titre, description, catégorie, lieu et photo optionnelle. |
| US03 | **Consulter mes signalements** | Liste de ses propres signalements avec date de création et statut ; accès au détail. |
| US04 | **Suivre l'avancement d'un signalement** | Visualisation de l'évolution du statut (Nouveau → En cours → Résolu). |
| US05 | **Recevoir une notification** | Alerte envoyée à chaque changement important sur un signalement. |
| US06 | **Ajouter un commentaire** | Possibilité de compléter son signalement avec des précisions horodatées. |
| US07 | **Modifier un signalement** | Correction possible tant que le signalement n'a pas été pris en charge ; verrouillé après résolution. |
| US08 | **Rechercher un signalement** | Recherche par titre/mot-clé et filtrage par statut parmi ses propres signalements. |

### 🏫 Profil Personnel

| # | Fonctionnalité | Description |
|---|---|---|
| US09 | **Consulter les signalements** | Vue d'ensemble de tous les signalements en attente ou en cours. |
| US10 | **Filtrer les signalements** | Filtrage par catégorie, lieu, statut ou date pour prioriser le traitement. |
| US11 | **Prendre en charge un signalement** | Auto-assignation d'un signalement pour indiquer qu'il est en cours de traitement. |
| US12 | **Modifier le statut** | Passage du signalement à "En cours" puis "Résolu", pour tenir l'étudiant informé. |
| US13 | **Ajouter un commentaire** | Échange avec l'étudiant directement sur le signalement (auteur et date enregistrés). |
| US14 | **Attribuer une intervention** | Réassignation d'un signalement à un collègue ou un autre service compétent. |

### 💼 Profil Administrateur

| # | Fonctionnalité | Description |
|---|---|---|
| US15 | **Gérer les utilisateurs** | Création, modification, blocage ou suppression de comptes, gestion des rôles. |
| US16 | **Gérer les catégories** | Création, modification, suppression ou désactivation des catégories de signalement (Wi-Fi, matériel...). |
| US17 | **Gérer les lieux** | Ajout de bâtiments et de salles, modification ou désactivation d'un lieu. |
| US18 | **Consulter les statistiques** | Vue d'ensemble chiffrée des signalements (par catégorie, lieu, statut). |
| US19 | **Consulter l'historique** | Accès à l'historique complet des signalements traités, y compris ceux clôturés. |
| US20 | **Gérer les priorités** | Ajustement du niveau de priorité des signalements pour orienter le traitement. |

---

## 3. Parcours utilisateur type

```
🎓 Étudiant                     🏫 Personnel                  💼 Administrateur
   |                                |                              |
   | Se connecte (US01)             |                              |
   | Crée un signalement (US02)     |                              |
   |------------------------------->| Consulte les signalements    |
   |                                | (US09) et les filtre (US10)  |
   |                                | Prend en charge (US11)       |
   |<-------------------------------| Modifie le statut (US12)     |
   | Reçoit une notification (US05) | Commente si besoin (US13)    |
   | Suit l'avancement (US04)       |                              |
   |                                |                              |----> Configure catégories/
   |                                |                              |      lieux/utilisateurs
   |                                |                              |      (US15-17)
   |                                |                              |----> Consulte stats et
   |                                |                              |      historique (US18-19)
```

---

## 4. Architecture technique

### Répartition du développement (4 personnes)

| Membre | Périmètre | Fichiers |
|---|---|---|
| Personne 1 | Connexion / Utilisateurs | `login.html`, `register.html`, `profil.html`, `js/auth.js`, `js/user.js` |
| Personne 2 | Signalements ("Demandes d'aide") | `demandes.html`, `create-demande.html`, `js/demandes.js` |
| Personne 3 | Messagerie / Notifications | `messages.html`, `conversation.html`, `notifications.html`, `js/messages.js`, `js/notifications.js` |
| Personne 4 | Recherche / Administration / BDD | `search.html`, `admin.html`, `js/search.js`, `js/admin.js`, `database.sql` |

### Modèle de données (extrait)

Le schéma relationnel (`database.sql`) repose sur 5 tables principales :

- **`users`** : comptes (étudiant, personnel, admin), avec statut bloqué/actif
- **`categories`** : types de problème (Wi-Fi, Matériel, Salle, Informatique...)
- **`lieux`** : localisation hiérarchique (bâtiment > salle)
- **`demandes`** : les signalements eux-mêmes (titre, description, statut, auteur, catégorie, lieu, photo)
- **`reports`** : données utilisées pour les statistiques administrateur

Ces tables sont reliées par des clés étrangères (`categorie_id`, `lieu_id`, `auteur_id`) garantissant la cohérence des données.

---

## 5. Utilité pour l'établissement

- **Gain de temps** : plus besoin d'emails ou de déplacements pour signaler un problème.
- **Traçabilité** : chaque signalement est daté, catégorisé et suivi jusqu'à sa résolution.
- **Priorisation facilitée** : le personnel peut filtrer et prioriser les interventions les plus urgentes.
- **Pilotage global** : l'administrateur dispose d'une vision statistique pour identifier les problèmes récurrents (ex. un Wi-Fi qui tombe souvent en panne dans un bâtiment précis) et ajuster les moyens en conséquence.
- **Communication fluide** : les commentaires et notifications évitent les allers-retours et gardent étudiants et personnel synchronisés sur l'avancement.
