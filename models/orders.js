
const mongoose = require('mongoose');
//const { tools } = require('../app');

const ordersSchema = mongoose.Schema({
   locUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
   louUser: {type: mongoose.Schema.Types.ObjectId, ref: 'users' },
   date: Date, 
   article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }],



});

const Order = mongoose.model('orders', ordersSchema)
module.exports = Order;