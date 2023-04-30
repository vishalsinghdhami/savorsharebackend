const mongoose = require("mongoose");
const {Schema} =  mongoose;

const users = new Schema({
    name:{
        type:String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    recipe: {
        type:Array
    },
    blogs: {
        type:Array
    },
    savedRecipe: {
        type:Array
    }
});

mongoose.model('users',users);