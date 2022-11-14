const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Persone = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        // unique : true, 
        // match: /[a-z]/,   X_?
    },
    age:{
        type: Number,
        max: 120,
        min: 6
    },
    sex: {
        type: String,
        enum: ['man' , 'woman'],
        lowercase: true,
    },
    favoriteFood: {
        type: [ String ]
    },
    createdAt:{
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model('persone', Persone)