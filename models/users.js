
const mongoose = require('mongoose');
//const { tools } = require('../app');

const usersSchema = mongoose.Schema({
    name: String, 
    firstName: String, 
    telephone : Number, 
    email : String,
    password: String,
    token: String,
    date: Date,


});

const User = mongoose.model('users', usersSchema)
module.exports = User;