const mongoose = require("mongoose");
const { Schema } = mongoose;
// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    require: [true, "please enter username"],
    max: [20, "username should be under 20 characters"],
    lowercase: true,
    unique: true,
  },
  hash: {
    type: String,
    require: true,
  },
  salt: String,
});

exports.User = mongoose.model("User", UserSchema);
