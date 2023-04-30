const mongoose = require("mongoose");
require("../model/userschema");
const User = mongoose.model("users");
const bcrypt = require('bcryptjs');
module.exports = (app) => {

app.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});
  
app.get("/auth/getuser", (req, res) => {
    console.log(req.session.user)
    res.status(200).send(req.session.user);
});

app.post('/auth/login', async (req, res) => {
    const email=req.body.email
  const password = req.body.password
  let hashedPassword = await bcrypt.hashSync(password, 10);
   const user = await User.findOne({
     email: email
   });
  let auth = false;
  if(user)
  auth =await bcrypt.compareSync(req.body.password, user["password"]);
  if (auth) {
    user['password']='';
   
      var redir = { redirect: "/", message: "login successfull", user: user };	
    req.session.user = user;
    return res.status(200).send(redir);
  }
  else return res.status(401).send({'error':'email or password incorrect'})
  
})

app.delete('/auth/logout', function(req, res){
	req.session.destroy();
	return res.status(200).send({message: 'LOGOUT_SUCCESS'});
  });
  
app.post('/auth/signup', async(req, res)=>{
  
  const name = req.body.name
  const email=req.body.email
  const password=req.body.password
  
  const user = await User.findOne({
    email: email
  });       

    if(user && (user.email!=undefined)) {
        var redir = { redirect: "/" , message:"id already exists" , email:user.email };	
        return res.json(redir);
    }
    else {
         let hashedPassword = await bcrypt.hashSync(password, 10);
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const newUser = new User({
          email: req.body.email,
          password: hashedPassword,
          name: name,
          recipe: [],
          blogs: [],
          savedRecipe:[]
            
      });


      const response = await newUser.save();
      console.log('response', response);
      
     const sessionuser = {
          email: req.body.email,
          id:response._id,
          name:name
      }
      response['id'] = response._id;
      
      req.session.user = sessionuser;
      response['password']=''
      var redir = { redirect: "/", message:"New user Created", user: response};
      return res.status(200).send(redir);
    }
});
}