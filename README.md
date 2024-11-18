Mon Vieux Grimoire - Backend

Ce dépôt contient le backend de l'application Mon Vieux Grimoire : un site web de référencement et de notation de livres.
Prérequis

Avant d'installer et d'exécuter ce projet, assurez-vous d'avoir installé :

    Node.js (version v21.7.3)
    npm (version 10.5.0)

Installation

Suivez les étapes ci-dessous pour installer et configurer le projet localement :

    Clonez ce dépôt sur votre machine :
    git clone https://github.com/SanYoan/Vieux-grimoire.git

    Accédez au répertoire du projet :
    cd Vieux-grimoire
    cd backend

    Installez les dépendances nécessaires avec la commande suivante :
    npm install

Configuration de la Base de Données

Avant de lancer le projet, assurez-vous d'avoir configuré votre base de données MongoDB. Vous pouvez suivre les étapes suivantes :

Installez xammp server ( lancer xammp control panel ) 
- lancez apache & mySQL depuis xammp
- ensuite configuré une BDD sur phpMyAdmin "oldgrimoire" ,
- nom utilisateur pour mySQL par défaut 'root' dans le fichier config -> database.js remplacé par le votre
- mdp dans une variable d'environemment crée un fichier .env a la racine du backend

MDP_MYSQL=   "VOTRE_MDP_MySQL"
KEY_SECRET = "CLE_DE_VOTRE_CHOIX" ( pour la clef secrete du token )

  
    Remplacez MDP_MYSQL par le mdp  de connexion à votre base de données MySQL.
    Remplacez KEY_SECRET par une clé secrète de votre choix pour les tokens JWT.

Lancement du backend :

Lancez l'application avec la commande suivante :
npm start

( Si vous voulez éffectué des modifications sur le code et voir les différence en direct , installer nodemon : 

Exécutez npm install -g nodemon

et ensuite lancez l'application avec la commande suivante : 

npm node 
)

L'application sera accessible à l'adresse http://localhost:4000. Si le serveur fonctionne sur un port différent pour une raison quelconque, le numéro de port correspondant s'affichera dans la console.
Fonctionnalités :

Gestion des livres : ajout, mise à jour et suppression de livres.
Notation des livres : possibilité de noter les livres sur une échelle de 0 à 5.
Authentification : inscription et connexion des utilisateurs.
Front-End

Le frontend de l'application est accessible dans le référentiel suivant :
https://github.com/SanYoan/Vieux-grimoire/tree/main/frontend

Pour l'utiliser, procédez comme suit :

    Depuis votre terminal accedez au dossier frontend 
    cd Vieux-grimoire
    cd frontend
    Exécutez npm install pour installer les dépendances du projet.\
    Exécutez npm start pour démarrer le projet.\

L'application sera accessible à l'adresse http://localhost:3000. Si le serveur fonctionne sur un port différent pour une raison quelconque, le numéro de port correspondant s'affichera dans la console.
