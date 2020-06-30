const express = require('express');
const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth'); //make sure user is signed in.
const Track = mongoose.model('Track'); //cant require it because runs the .model code multiple times and you can't define track model multiple times. we have to require it once in index.js
const router = express.Router();

router.use(requireAuth); //ensure all request Handlers require user is signed in. all routes will use the middleware now

router.get('/tracks', async (req, res) => {
  const tracks = await Track.find({ userId: req.user._id });

  res.send(tracks);
});

router.post('/tracks', async (req, res) => { // info will be in req.body
  const { name, locations } = req.body;

  if(!name || !locations) {
    return res
      .status(422)
      .send({ error: 'You must provide a name and locations' })
  }

  try {
    const track = new Track({ name, locations, userId: req.user._id })
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message })
  }
});
module.exports = router;




