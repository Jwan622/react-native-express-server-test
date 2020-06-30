require('./models/User'); //should only require one way. mongoose expects the las lin of User.js to be executed one time. the require executes it. but there can only be one User model. so only require this once.
require('./models/Track');

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const requireAuth = require("./middlewares/requireAuth");
const trackRoutes = require('./routes/trackRoutes');

const app = express();

app.use(bodyParser.json()); //parse json information first, has to be above authRoutes. this parses json from incoming request. places on body of req.
app.use(authRoutes);
app.use(trackRoutes); //associates routes with app object.

const mongoUri = 'mongodb+srv://admin:qwer1234@cluster0-2sdoa.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
 useNewUrlParser: true,
 useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
 console.log("connected to mongo instance");
}); // when we connect successfully, this callback is called

mongoose.connection.on('error', (err) => {
 console.log("Error on connection to mongo", err)
});

app.get('/', requireAuth, (req, res) => {//runs requireAuth first
 res.send(`Your email: ${req.user.email}`);
});


app.listen(3000, () => {
 console.log("listneing on port 3000")
});