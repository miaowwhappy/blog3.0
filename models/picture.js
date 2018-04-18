var mongoose = require('mongoose');
var picturesSchema = require('../schemas/pictures.js')

module.exports=mongoose.model('Picture',picturesSchema)