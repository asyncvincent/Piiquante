const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * User Schema
 * @property {String} email 
 * @property {String} password 
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Add unique validator to userSchema
userSchema.plugin(require('mongoose-unique-validator'));

// Export User model
module.exports = mongoose.model('User', userSchema);


