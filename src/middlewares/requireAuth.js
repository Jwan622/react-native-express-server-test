const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // next is a function that signal that request can move onto next middleware, or ultimatley run request handler after teh middleware
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "you msut be logged in"})
  }

  console.log(authorization); // this is just the authoirzation header sent from postman

  const token = authorization.replace("Bearer ", ''); // just leave us with token.

  jwt.verify(token, "MY SECRET KEY", async (err, payload) => { // teh 2nd arg is the secret MY SECRET KEY. payload is the info in the JWT
    if (err) {
      return res.status(401).send({ error: "You must be logged in"})
    }

    const { userId } = payload;
    const user = await User.findById(userId);

    // attach user to req object to be used in the routes
    req.user = user;
    next(); // call next middleware or go back to request handler.
  })
};