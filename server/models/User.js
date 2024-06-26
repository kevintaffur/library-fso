const mongoose = require("mongoose");

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  passwordHash: String,
  favouriteGenre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", schema);
