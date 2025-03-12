const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//A schema defines the structure of a document in MongoDB.

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);