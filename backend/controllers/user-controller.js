require("dotenv").config({ path: 'mongoDB.env'});

const bcrypt = require('bcrypt'); //Module de Hash
const jwt = require('jsonwebtoken'); //Module de gestion de token
const User = require('../models/user'); // le modele user
const randomToken = process.env.TOKEN; // Utilise la chaine de caratère du fichier ".env" pour randomiser le token
const {Base64} = require('js-base64'); // Module qui permet d'encrypter en base 64 (email)

//Création d'un nouveau compte
exports.signup = (req, res, next) => {
  const user = new User({ 
    email: Base64.encode(req.body.email), // on encrypte l'email avant de la stocker dans la BDD
    password: req.body.password // on ne hash pas le mot de passe à cette étape pour pouvoir vérifier la force du mdp dans le model user.js
  });
  user.save()// l'utilisateur est sauvegardé dans la BDD
    .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
    .catch((error) => res.status(400).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: Base64.encode(req.body.email) }) //On cherche l'utilisateur en fonction de son email (unique)
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt
          .compare(req.body.password, user.password)  // On compare les mots de passe
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign( // On génère un token de session valide pendant 24h.
                  { userId: user._id },
                  randomToken,
                  { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};