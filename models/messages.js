const mongoose = require('mongoose');
//const { tools } = require('../app');

const messagesSchema = mongoose.Schema({
   from: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
   to: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
   message: String, 
   date: Date,


});

const Message = mongoose.model('messages', messagesSchema)
module.exports = Message;