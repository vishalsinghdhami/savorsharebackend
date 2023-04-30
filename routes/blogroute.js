const mongoose = require("mongoose");
require("../model/blogschema");
require("../model/userschema");
const User = mongoose.model("users");
const Blogs = mongoose.model("blogs");
const bcrypt = require('bcryptjs');
const { ObjectId } = require("mongodb");
module.exports = (app) => {
    app.post("/blog/add", async (req, res) => {
        try {
            const retobj = req.body;
            const Blog = new Blogs({
                title:retobj.title,
                photos: retobj.photos,
                description: retobj.description,
                userid:retobj.userid,
                date: new Date(),
                comments: [],
                likes: [],
                share:0
            });

            const response = await Blog.save();

            await User.findOneAndUpdate(
            { _id: new ObjectId(retobj.userid) }, 
            { $addToSet: { blogs: response._id } }
            );
            
            res.status(200).send(response);
        } catch (err) {
            res.status(500).send({ "error": err })
        }
    }
    );
    app.get("/blog/getall", async (req, res) => {
        try {
            const response = await Blogs.find({});
            res.status(200).send(response);
        }
        catch (err)
        {
            res.status(500).send({"error":err})
        }
    })
    app.post("/blog/getbyid", async (req, res) => {
        try {
            const response = await Blogs.find({ userid: req.body.userid });
            res.status(200).send(response);
        }
        catch (err) {
            res.status(500).send({ "error": err })
        }
    });
    app.post("/blog/incsharecount", async (req, res) => {
        try {
            const response = await Blogs.findOneAndUpdate({ userid: new ObjectId(req.body.blogid) },
            {$inc : {'share' : 1}});
            res.status(200).send(response);
        }
        catch (err) {
            res.status(500).send({ "error": err })
        }
    });
    app.post('/blog/likes', async (req, res) => {
    
        try {
            
            if (req.body.type === 'add') {
                await Blogs.updateOne({ _id: new ObjectId(req.body.blogid) }, {
                    $addToSet: {
                        likes: req.body.userid,
                    }
                });
                res.status(200).send({ "status": "added" })
            }
            else {
                
                await Blogs.updateOne({ _id: new ObjectId(req.body.blogid) }, {
                    $pull: {
                        likes: req.body.userid,
                    }
                });
                res.status(200).send({ "status": "removed" })

            }
        } catch (err) {
            res.status(500).send({ error: err });
        }
    });
    app.post('/blog/addcomment', async (req, res) => {
        try {
            await Blogs.findOneAndUpdate({ _id: new ObjectId(req.body.blogid) }, {
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

}