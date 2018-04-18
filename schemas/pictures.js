var mongoose = require('mongoose');

module.exports = new mongoose.Schema({    
	picCategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PicCategory'
	},
    title: {
        type: String,
        default:''
    },
    description: {
        type: String,
        default:''
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    addTime: {
        type: Date,
        default: new Date()
    },
    src:{
        type:String,
        dafault:''
    }
});