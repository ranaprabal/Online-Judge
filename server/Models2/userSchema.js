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
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profileSchema",
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
})

module.exports = mongoose.model("userSchema", userSchema)
