const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const product = new mongoose.Schema({
    _id:Number,
    name:String,
    description:String,
    price:Number,
    quantity:Number,
    category:Number,
    
})


module.exports = mongoose.model('product',product)
