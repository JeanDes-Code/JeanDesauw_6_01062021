const Sauce = require('../models/sauce');
const fs = require('fs');

//Permet de créer une nouvelle sauce.
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

//Permet de mofifier une sauce existante 
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body } 
  Sauce.updateOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

//Permet de supprimer une sauce existante, son fichier image également
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageURL.split(`/images/`)[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Permet de récupérer les informations d'une sauce en fonction de son identifiant
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Permet de récupérer un tableau contenant toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};



/*
//Permet à un utilisateur de noter (j'aime / j'aime pas) une sauce.
exports.likeSauce = (req, res, next) => {
  if () // j'aime = 1
    //
    si userID déja dans UserLiked : ne rien faire
    si userID déja dans UserDisliked : 
        dislikes --
        supprimer userId du tableau userDisliked
      PUIS
        modifier sauce :
          likes++
          ajouter userID au tableau userLiked
    //
  if () // j'aime = -1
    //
    si userID déja dans UserDisliked : ne rien faire
    si userID déja dans UserLiked : 
        likes --
        supprimer userId du tableau userLiked
      PUIS
        modifier sauce :
          dislikes++
          ajouter userID au tableau userDisliked
    //
  if () // j'aime = 0
    //
    modifier sauce :
      Vérifier si userId est présent dans UserLiked ou UserDisliked
        Si UserLiked : 
          likes--
          supprimer UserID du tableau
        Si UserLiked : 
          dislikes --
          supprimer UserID du tableau
      ajouter userID au tableau userDisliked
    //
  Sauce.updateOne({ _id: req.params.id })
    .then()
    .catch();
  
};
*/