So Peckocko - Plateforme de partage et de notation de sauces piquantes.

Mise en place :

Dans un terminal depuis la racine du dépot :  
    "
    cd frontend 
    npm install (installation des dépendances)
    npm start (après quelques instants la console devrait afficher "Compiled successfully.")
    "
    
Dans le dossier backend :
    Dans un second terminal:
    "
    npm install (installation des dépendances)
    "
    Ouvrir le fichier .env-exemple,
    Remplir les différentes informations (DB_HOST, DB_USER, DB_PASS, TOKEN).
    Renommer le fichier "mongoDB.env"

    Puis dans ce second terminal :
    "
    nodemon start (la console devrait afficher "Connexion à MongoDB réussie !")
    "

Si vous n'avez pas de compte MongoDB vous pouvez me contactez pour tester l'app : desauwjean@gmail.com

Rendez-vous sur "http://localhost:4200/" pour créer votre compte utilisateur.

NB : Plusieurs règles sont à respecter pour le mot de passe : 
                    - entre 8 et 120 signes
                    - pas d'espace
                    - au minimum une lettre minuscule
                    - au minimum une lettre majuscule
                    - au minimum un chiffre
                    - au minimum un des symboles suivant $ @ % * + - _ ! 