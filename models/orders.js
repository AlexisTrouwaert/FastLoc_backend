
const mongoose = require('mongoose');
//const { tools } = require('../app');

const ordersSchema = mongoose.Schema({
   locUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
   Orders : [{
      louUser: {type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      article : {
         Categorie : String,
         Brand : String,
         Model : String,
         Price : Number
      },
      Cart : Boolean,
      Pending : Boolean,
      Finish : Boolean
   }]
});

const Order = mongoose.model('orders', ordersSchema)
module.exports = Order;