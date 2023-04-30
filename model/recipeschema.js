const mongoose = require("mongoose");
const {Schema} =  mongoose;

const recipes = new Schema({
    title:{
        type:String
    },
    ingredients: {
        type: String
    },
    userid: {
        type: String
    },
    cookingsteps: {
        type:Array
    },
    photos: {
        type:Object
    },
    typeofcuisine: {
        type:String
    },
    mealtype: {
        type:String
    },
    restriction: {
        type:Array
    },
    date: {
        type:Date
    },
    comments: {
        type:Array
    },
    likes: {
        type:Array
    },
    share: {
        type:Number
    }
});

mongoose.model('recipes',recipes);