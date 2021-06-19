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
    usersLiked: { type: Array },
    usersDisliked: { type: Array },
    userId : { type: String }
});

module.exports = mongoose.model('Sauce', sauceSchema);