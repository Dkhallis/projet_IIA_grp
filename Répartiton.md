## Répartition des Taches
## 1. Personne 1 — Connexion / Utilisateurs

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


## 2. Personne 2 — Demandes d'aide

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


## 3. Personne 3 — Messagerie / Notifications

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

## 4. Personne 4 — Recherche / Administration / Base de données

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
