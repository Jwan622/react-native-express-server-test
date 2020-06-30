const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model("User"); // allows us access user model that allows us to access user collection in mongodb

const router = express.Router(); // object to associate route handlers with it

router.post('/signup', async (req, res) => { //receieve post request to signup
  const { email, password } = req.body
  try {
    const user = new User({ email, password }); // only creates object.
    await user.save(); // async operation
    const token = jwt.sign({ userId: user._id }, "MY SECRET KEY"); // the 2nd arg to sign is the server kept secret
    res.send({ token }); // we send a token which is to be used in any followup request.
  } catch (err) {
    return res.status(422).send(err.message)
  }
});

router.post('/signin', async (req, res) => {
 // email and pass on req body
 const { email, password } = req.body; //the password here is provided from signin method

 if (!email || !password) {
   return res.status(422).send({ error: "Must supply email and password" });
 }

 const user = await User.findOne({ email });
 if (!user) {
   return res.status(422).send({ error: "Email not found" });
 }

 try {
   await user.comparePassword(password); // we use await since comparePassword returns a promise that we wrote.
   const token = jwt.sign({ userId: user._id }, "MY SECRET KEY" ); //user can still authenticate themslves on future requests. we need to use the same jwt signing key that we use to verify.
   res.send({ token })
 } catch (err) {
   return res.status(422).send({ error: "Invalid password or email" })
 }




});

module.exports = router;