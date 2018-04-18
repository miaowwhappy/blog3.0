var mongoose = require('mongoose');
var picCategoriesSchema = require('../schemas/picCategories')

module.exports=mongoose.model('PicCategory',picCategoriesSchema)
