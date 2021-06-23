//Variables d'environnement :
require("dotenv").config({ path: '.env' });
const host = process.env.DB_HOST;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;

// Modules principaux
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');

//Modules Sécurité
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require('helmet');
//Rate limit (limitation du nombre de requêtes)
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10minutes
  max: 100, //on limite chaque IP à 100 requêtes max par 10minutes (i.e 10requêtes/min)
  message: "Too many requests were made from this IP, please try again later." 
})

//Connection à la BDD MongoDB
mongoose.connect(`mongodb+srv://${username}:${password}@${host}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Résolution des problèmes de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Middlewares 
app.use(helmet()); //Masque l'utilisation d'express
app.use(express.json()); //Permet de parser les requètes
app.use(express.urlencoded({ extended: true })); //
app.use(mongoSanitize()); //Nettoie les données pour éviter les tentatives d'injection
app.use(limiter);//Limite le nombre de requêtes par @IP et par minute.
app.use('/images', express.static(path.join(__dirname, 'images'))); // Chemin vers les images stockées

// Routes Sauces et Users
const sauceRoutes = require('./routes/sauce-routes');
const userRoutes = require('./routes/user-routes');
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;