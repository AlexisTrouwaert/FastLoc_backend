const mongoose = require('mongoose');
//const { tools } = require('../app');

const avisSchema = mongoose.Schema({
   userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
   userIdAvis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
   Note: Number, 
   Avis: String,
   date: Date,


});

const Avis = mongoose.model('avis', avisSchema)
module.exports = Avis;