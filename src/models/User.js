const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
   type: String,
   unique: true, // modifies mongodb collection of users, tells mongodb that every user must have unique email
   required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.pre("save", function(next) { // has to use function , user is available as 'this', if we use arrow then this == context of this
  const user = this;
  if (!user.isModified('password')) {
    return next; //similar to middleware next
  }

  //generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => { // hash and salt password
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    })
  })
}); // pre save hook

// we could write the password checking code into our request handler, but let's write it for our schema instead. let mongooe do it using method to our user model.

userSchema.methods.comparePassword = function( //atached method to every user that gets created.
  candidatePassword
) {
  return new Promise((resolve, reject) => { // using a promise allows us to use await/async syntax when comparing passwords later.
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if(!isMatch) {
        return reject(false); // we call reject when there is not a match
      }

      resolve(true); // we call resolve when the code goes right, and there is a match
    })
  })
}


mongoose.model("User", userSchema); // associate it with mongoose library. this call does that.