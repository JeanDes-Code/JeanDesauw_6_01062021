const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');
const regex = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,120})$/);
const SALT_WORK_FACTOR = 10; //Il s'agit du coefficient de 'hashage' utilisé pour "saler" le mot de passe

const userSchema = mongoose.Schema({
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true, match :[regex, "Mot de passe trop faible. (8 charactères minimum, pas d'espace et doit contenir au moins un caractère spécial)"]},
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next) {
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