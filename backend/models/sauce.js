const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
    name: { type: String },
    manufacturer: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    mainPepper: { type: String },
    heat: { type: Number },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array, default: 0 },
    usersDisliked: { type: Array, default: 0 },
});

module.exports = mongoose.model('Sauce', sauceSchema);