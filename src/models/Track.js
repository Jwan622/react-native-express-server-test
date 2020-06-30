const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  timeStamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  }
});

const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ref to some other object in mongodb
    ref: 'User' // used by mongoose tells userId has an intsance of user. the string 'User' points go mongoose.model('User'... at bottom of User.js file.
  },
  name: {
    type: String, //provides a little validation on the mongoose layer.
    default: '',
  },
  locations: [pointSchema] //defined above
});

mongoose.model("Track", trackSchema); // points are embeddded in trackschema so this is all we need. we don't have collections of points in mongodb.
