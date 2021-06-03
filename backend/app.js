const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Sauce = require('./models/sauce')

const app = express();
mongoose.connect('mongodb+srv://jean:jean@sopekocko.h5o77.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

/*app.post('/api/sauces', (req, res, next) => {
  const sauce = new Sauce({
      ...req.body
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
});
*/

app.get('/api/sauces', (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json(error));
});

app.get('/api/sauces/:id', (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json(error));
});


module.exports = app;