const mongoose = require('mongoose');

const toolsSchema = mongoose.Schema({
    categorie: String, 
    brand : String, 
    model : String,

});

const Tool = mongoose.model('tools', toolsSchema)
module.exports = Tool;