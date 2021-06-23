const Sauce = require('../models/sauce');
const likeEnum = require ("../enum/like-enum");
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
  switch (req.body.like) {
    case likeEnum.neutral: //like = 0 (renvoyé par le front)
      Sauce.findOne({ _id: req.params.id })//Récupération de la sauce
        .then((sauce) => {
          //L'utilisateur aime déja la sauce
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },//On retire le like du nombre de likes
                $pull: { usersLiked: req.body.userId },//On retire le User ID du tableau userLiked
                _id: req.params.id,
              }
            )
              .then(() => res.status(201).json({ message: "Ton avis a été pris en compte!" }))
              .catch((error) => res.status(400).json({ error: error }));
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },//
              {
                $inc: { dislikes: -1 },//On retire le dislike du nombre de dislikes
                $pull: { usersDisliked: req.body.userId },//On retire le User ID du tableau userDisliked
                _id: req.params.id,
              }
            )
              .then(() => res.status(201).json({ message: "Ton avis a été pris en compte!" }))
              .catch((error) => res.status(400).json({ error: error }));
          }
        })
        .catch((error) => res.status(404).json({ error: error }));
      break;
    case likeEnum.like: //like = 1 (renvoyé par le front)
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },//On ajoute un like au nombre de likes
          $push: { usersLiked: req.body.userId },//On ajoute le User ID au tableau userLiked
          _id: req.params.id,
        }
      )
        .then(() => res.status(201).json({ message: "Ton like a été pris en compte!" }))
        .catch((error) => res.status(400).json({ error: error }));
      break;
    case likeEnum.dislike: //like = -1 (renvoyé par le front)
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 }, //On ajoute un dislike au nombre de dislikes
          $push: { usersDisliked: req.body.userId }, //On ajoute le User ID au tableau userDisliked
          _id: req.params.id,
        }
      )
        .then(() => res.status(201).json({ message: "Ton dislike a été pris en compte!" }))
        .catch((error) => res.status(400).json({ error: error }));
      break;
    default:
      console.error("mauvaise requête");
  }
};