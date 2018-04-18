var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: String,
    src:{
        type:String,
        dafault:''
    },
        addTime: {
        type: Date,
        default: new Date()

    },
        description: {
    	type: String,
    	default:''
    }
}); 