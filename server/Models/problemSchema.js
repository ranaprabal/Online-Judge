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
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  examples: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  testcases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "testcaseSchema",
    },
  ],
  setterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
  },
  tags: [
    {
      type: String,
    },
  ],
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
  },
})

module.exports = mongoose.model("problemSchema", problemSchema)
