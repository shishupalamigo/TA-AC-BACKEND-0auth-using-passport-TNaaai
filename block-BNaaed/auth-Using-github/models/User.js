var mongoose = require('mongoose');

var Schema =  mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    profilePic: { type: String }
});

var User = mongoose.model('User', userSchema);

module.exports = User;