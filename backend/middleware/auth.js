//Permet de vérifier l'authentification de l'utilisateur à chaque requête

require("dotenv").config({ path: '.env' });
const jwt = require('jsonwebtoken');
const randomToken = process.env.TOKEN;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //On récupère le token de session qui est dans le header sous la forme "Bearer #ID"
        const decodedToken = jwt.verify(token, randomToken); //On le décode
        const userId = decodedToken.userId; //On récupère le userId qu'on avait encodé dans le token
        if (req.body.userId && req.body.userId !== userId) { //S'il y a un userId dans la requête on vérifie qu'il correspond à celui que l'on a décodé
            throw 'User ID non valable !'; //les userId ne correspondent pas ! 
        } else {
            next(); //La requête est authentifiée donc on peut passer à la suite.
        }
    } catch (error) {
        res.status(401).json({ error: new Error("Requête invalide !") });
    }
}