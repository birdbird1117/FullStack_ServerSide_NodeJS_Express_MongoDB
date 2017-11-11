const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dishSchema = require('./dishes');

var favoriteSchema = new Schema({
    user:  {
        type: String,
        required: true
    },
    dishes:[dishSchema]    
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;