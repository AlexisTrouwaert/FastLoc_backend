
const mongoose = require('mongoose');
//const { tools } = require('../app');


const articlesSchema = mongoose.Schema({
    etat: String, 
    price: Number, 
    locaduree: Date, 
    isAvailable: Boolean,
    outil :[{ type: mongoose.Schema.Types.ObjectId, ref: 'tools' }], 
});

const addressSchema = mongoose.Schema({
    adresse: String,
    city: String, 
});

const usersSchema = mongoose.Schema({
    name: String, 
    username: String,
    firstName: String, 
    telephone : Number, 
    email : String,
    password: String,
    token: String,
    note: Number,
    date: Date,
    isConnected: Boolean,
    addresse: addressSchema,
    article: [articlesSchema],


});

const User = mongoose.model('users', usersSchema)
module.exports = User;