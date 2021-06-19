const Sauce = require('../models/sauce');
const fs = require('fs');
const { set } = require('mongoose');

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
  } : { ...req.body }; 
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

//Permet de supprimer une sauce existante, son fichier image également
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split(`/images/`)[1];
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




//Permet à un utilisateur de noter (j'aime / j'aime pas) une sauce.
exports.likeSauce = (req, res, next) => {
  Sauce.findOne ({ _id: req.params.id })
    .then((uniqueSauce) => {
      const userID = req.body.userId;
      const like = req.body.like;

      Sauce.updateOne({ _id: req.params.id }, { $set: (() => {

        if (like === 1) {

          if (uniqueSauce.usersLiked.find((_userID) => _userID === userID)) {
            //si l'utilisateur a déja liké la sauce , on ne fait rien
            return;
          }
          return {
            //on ajoute l'identifiant utilisateur au tableau et on ajoute 1 au nombre de like
            usersLiked: [...uniqueSauce.usersLiked, userID],
            likes: uniqueSauce.usersLiked.length + 1,
          };
        }

        if (like === -1) {

          if (uniqueSauce.usersDisliked.find((_userID) => _userID === userID)) {
            //si l'utilisateur a déja disliké la sauce , on ne fait rien
            return;
          }
          return {
            //on ajoute l'identifiant utilisateur au tableau et on ajoute 1 au nombre de dislike
            usersDisliked: [...uniqueSauce.usersDisliked, userID],
            dislikes: uniqueSauce.usersDisliked.length + 1,
          };
        }

        if (like === 0) {
          //on supprime le statu 'liked' ou 'disliked' 
          if (uniqueSauce.usersLiked.find((_userID) => _userID === userID)) {
            return {
              usersLiked: uniqueSauce.usersLiked.filter((_userID) => _userID !== userID),
              likes: uniqueSauce.usersLiked.length - 1,
            };
          }

          if (uniqueSauce.usersDisliked.find((_userID) => _userID === userID)) {
            return {
              usersDisliked: uniqueSauce.usersLiked.filter((_userID) => _userID !== userID),
              dislikes: uniqueSauce.usersLiked.length - 1,
            };
          }
        }

        return;

      })(),
    })
      .then(() => res.status(200).json({ message: "Actualisation du statut 'j'aime' de la sauce" }))
      .catch((error) => res.status(409).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};