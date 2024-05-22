const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },
  img: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
  },
  exampleInput: {
    type: String,
    required: true,
  },
  exampleOutput: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: now(),
  },
  testcases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "testcasesSchema",
    },
  ],
  setterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
  },
  tags: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tagsSchema",
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
  },
})

module.exports = mongoose.model("problemSchema", problemSchema)
