const mongoose = require("mongoose");
require("../model/recipeschema");
require("../model/userschema");
const User = mongoose.model("users");
const Recipes = mongoose.model("recipes");
const bcrypt = require('bcryptjs');
const { ObjectId } = require("mongodb");
module.exports = (app) => {
    app.post("/recipe/add", async (req, res) => {
        try {
            const retobj = req.body;
            const Recipe = new Recipes({
                title: retobj.title,
                ingredients: retobj.ingredients,
                userid: retobj.userid,
                cookingsteps: retobj.cookingsteps,
                photos: retobj.photos,
                typeofcuisine: retobj.typeofcuisine,
                mealtype: retobj.mealtype,
                restriction: retobj.restriction,
                date: new Date(),
                comments: [],
                likes: [],
                share:0
            });

            const response = await Recipe.save();

            await User.findOneAndUpdate(
            { _id: new ObjectId(retobj.userid) }, 
            { $addToSet: { recipe: response._id } }
            );
            
            res.status(200).send(response);
        } catch (err) {
            res.status(500).send({ "error": err })
        }
    }
    );
    app.get("/recipe/getall", async (req, res) => {
        try {
            const response = await Recipes.find({});
            res.status(200).send(response);
        }
        catch (err)
        {
            res.status(500).send({"error":err})
        }
    })
    app.post("/recipe/getbyid", async (req, res) => {
        try {
            const response = await Recipes.find({ userid: req.body.userid });
            res.status(200).send(response);
        }
        catch (err) {
            res.status(500).send({ "error": err })
        }
    });
    app.post("/recipe/incsharecount", async (req, res) => {
        try {
            const response = await Recipes.findOneAndUpdate({ _id: new ObjectId(req.body.recipeid) },
            {$inc : {share : 1}});
            res.status(200).send(response);
        }
        catch (err) {
            res.status(500).send({ "error": err })
        }
    });
    app.post('/recipe/likes', async (req, res) => {

    try {
        
        if (req.body.type === 'add') {
            await Recipes.updateOne({ _id: new ObjectId(req.body.recipeid) }, {
                $addToSet: {
                    likes: req.body.userid
                }
            });
            res.status(200).send({ "status": "added" })
        }
        else {
            
            await Recipes.updateOne({ _id: new ObjectId(req.body.recipeid) }, {
                $pull: {
                    likes: req.body.userid
                }
            });
            res.status(200).send({ "status": "removed" })

        }
    } catch (err) {
        res.status(500).send({ error: err });
    }
    });
    app.post('/recipe/addcomment', async (req, res) => {
        try {
            await Recipes.findOneAndUpdate({ _id: new ObjectId(req.body.recipeid) }, {
                $push: {
                    comments: {
                        email: req.body.email,
                        comment: req.body.comment,
                        date: new Date()
                    }
                }
            });
            res.status(200).send({ 'msg': 'comment added' })
        } catch (err) {
            res.status(500).send({ error: err })
        }
    });
    app.post('/recipe/saverecipe', async (req, res) => {
        try {
            const response = await User.findOneAndUpdate({ _id: new ObjectId(req.body.userid) }, {
                $addToSet: { savedRecipe: req.body.recipeid }
            });
            res.status(500).send(response);
        } catch (err) {
            res.status(500).send({ error: err });
        }
    });
    app.post('/recipe/getsaverecipe', async (req, res) => {
        
        try {
            const response = await User.findOne({ _id: new ObjectId(req.body.userid) });    

            let arr = [];
            response.savedRecipe.map((it, index) => {
                arr.push(new ObjectId(it));
            });

            const retdata = await Recipes.find({ _id: arr });

            res.status(500).send(retdata);
        } catch (err) {
            res.status(500).send({ error: err });
        }
    });
    

}