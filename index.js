const express = require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');
const bodyParser = require("body-parser");
const keys = require('./config/keys');
const mongoose = require('mongoose');
const cors = require("cors");
async function main(){

const app = express();
app.use(cookieParser());

mongoose.connection.on('connecting', () => { 
  console.log('connecting')
  console.log(mongoose.connection.readyState); //logs 2
});
mongoose.connection.on('connected', () => {
  console.log('connected');
  console.log(mongoose.connection.readyState); //logs 1
});
mongoose.connection.on('disconnecting', () => {
  console.log('disconnecting');
  console.log(mongoose.connection.readyState); // logs 3
});
mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
  console.log(mongoose.connection.readyState); //logs 0
});

await mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(
    session({
 
        // It holds the secret key for session
        secret: keys.cookieKey,
 
        // Forces the session to be saved
        // back to the session store
        resave: true,
 
        // Forces a session that is "uninitialized"
        // to be saved to the store
        saveUninitialized: false,
        cookie: {
 
            // Session expires after 7days of inactivity.
            expires: 7*24*60*60*1000
        }
    })
);
app.use(bodyParser.json());
app.use(
	  	cors()
		); 

app.get('/', (req, res) => {
    res.json({
        hello: "hi!"
    });
});

require('./routes/authroute')(app);
require('./routes/reciperoute')(app);
require('./routes/blogroute')(app);

let port = process.env.PORT || 8000
			app.listen(port);

}
main();