# projet_IIA_grp

## Nom du projet : CampusHelp
## Concept : Application qui permettrait de signaler et suivre les problèmes présent dans sont établissement.

CampusHelp est une application destinée aux établissements scolaires afin de faciliter le signalement et le suivi des problèmes rencontrés au quotidien.

L'application permet aux étudiants et au personnel de signaler facilement un problème, comme un ordinateur en panne, un problème de Wi-Fi, du matériel défectueux ou un problème dans une salle. Le signalement peut contenir une description, une catégorie, un lieu et éventuellement une photo.

Les membres du personnel peuvent ensuite consulter les signalements, les prendre en charge et modifier leur statut afin de permettre aux utilisateurs de suivre leur avancement.

Un espace administrateur permet également de gérer les utilisateurs, les catégories, les lieux et de consulter des statistiques sur les problèmes rencontrés dans l'établissement.

L'objectif de CampusHelp est donc de centraliser les signalements, faciliter leur traitement et améliorer la communication entre les étudiants et le personnel.



1er Sprint : 

- 1/ créer le doc.md  <- info !!!
- 2/ Sprint backlog = Qu'est-ce qu'on fait avant 16h30.
- 3/ Répartir les tâches
      -> planning poker
      -> daily toutes les heures (pendant 5 minutes)
- 4/ sprint review et + restore


## Répartition des Taches : 
1. Personne 1 — Connexion / Utilisateurs

Fichiers :

login.html
register.html
profil.html
js/auth.js
js/user.js

À coder :

Inscription
Connexion / déconnexion
Gestion de session
Création du profil
Modification du profil
Suppression du compte
Gestion des rôles
Vérification des utilisateurs connectés

Fonctions principales :

login()
logout()
register()
updateProfile()
deleteAccount()
checkSession()
2. Personne 2 — Demandes d'aide

Fichiers :

demandes.html
create-demande.html
js/demandes.js

À coder :

Affichage des demandes
Création d'une demande
Modification d'une demande
Suppression d'une demande
Catégories d'aide
Statut d'une demande
Acceptation d'une aide
Historique des demandes

Fonctions principales :

createDemande()
getDemandes()
updateDemande()
deleteDemande()
acceptDemande()
changeStatus()
3. Personne 3 — Messagerie / Notifications

Fichiers :

messages.html
conversation.html
notifications.html
js/messages.js
js/notifications.js

À coder :

Liste des conversations
Ouverture d'une conversation
Envoi de messages
Réception des messages
Suppression d'un message
Notifications
Notification lorsqu'une demande reçoit une réponse
Notification lorsqu'une aide est acceptée

Fonctions principales :

sendMessage()
getMessages()
deleteMessage()
createConversation()
getNotifications()
markAsRead()
4. Personne 4 — Recherche / Administration / Base de données

Fichiers :

search.html
admin.html
js/search.js
js/admin.js
database.sql

À coder :

Recherche :

searchDemandes()
filterByCategory()
filterByLocation()
filterByDate()

Administration :

getUsers()
deleteUser()
blockUser()
getReports()
deleteDemandeAdmin()

Base de données :

Création des tables
Relations entre les tables
Clés primaires / étrangères
Requêtes SQL
Données de test
