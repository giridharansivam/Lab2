
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const category= new mongoose.Schema({
    name:String
})

module.exports = mongoose.model('Category',category)