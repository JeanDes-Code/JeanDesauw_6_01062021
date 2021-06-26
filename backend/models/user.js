const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt'); //Permet de Hasher le mot de passe
const regex = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,120})$/); //Permettra de vérifier le niveau de sécurité du mot de passe
const SALT_WORK_FACTOR = 10; //Il s'agit du coefficient de 'hashage' utilisé pour crypter le mot de passe

//Schéma type de l'objet User qui sera enregistré sur la BDD
const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        match: [regex, "Mot de passe trop faible. (8 charactères minimum, au moins une majuscule, une minuscule, un chiffre, au moins un caractère spécial et aucun espace )"] 
    },
});

//Permet de valider les données avant qu'elles ne soient modifiées à l'étape suivant puis stockées. 
userSchema.plugin(uniqueValidator);

//Va permettre de hasher le mot de passe avant de le stocker dans la BDD
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    //on ne sale et hashe le mot de passe que s'il vient d'être créé ou s'il vient d'être modifié
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


module.exports = mongoose.model('User', userSchema);