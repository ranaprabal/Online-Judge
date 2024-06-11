const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
  },
  lName: {
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  accountType: {
    type: String,
    enum: ["User", "Problem Setter", "Admin"],
    required: true,
  },
  solvedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "problemSchema",
    },
  ],
  attemptedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "problemSchema",
    },
  ],
  image: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
  },
  DOB: {
    type: Date,
  },
  about: {
    type: String,
  },
  organisation: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  country: {
    type: String,
  },
})

module.exports = mongoose.model("userSchema", userSchema)
