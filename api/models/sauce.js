const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * Sauce Schema
 * @property {String} userId 
 * @property {String} name  
 * @property {String} manufacturer 
 * @property {String} description
 * @property {String} mainPepper 
 * @property {String} imageUrl 
 * @property {Number} heat
 * @property {Number} likes
 * @property {Number} dislikes
 * @property {Array} usersLiked
 * @property {Array} usersDisliked
 */
const sauceSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        unique: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    usersLiked: {
        type: [String],
        default: []
    },
    usersDisliked: {
        type: [String],
        default: []
    }
});

// Add unique validator to sauceSchema
sauceSchema.plugin(require('mongoose-unique-validator'));

// Add mongoose-error to sauceSchema
sauceSchema.plugin(require('mongoose-error'));

// Export Sauce model
module.exports = mongoose.model('Sauce', sauceSchema);
