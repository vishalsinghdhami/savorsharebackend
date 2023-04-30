const mongoose = require("mongoose");
const {Schema} =  mongoose;

const blogs = new Schema({
    title: {
        type:String
    },
    photos: {
        type:Object
    },
    description: {
        type:String
    },
    userid: {
        type: String
    },
    date: {
        type:Date
    },
    comments: {
        type: Array
    },
    likes: {
        type:Array
    },
    share: {
        type:Number
    }
});

mongoose.model('blogs',blogs);