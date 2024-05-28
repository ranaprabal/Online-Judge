const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "problemSchema",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now(),
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Compiled",
      "Compilation Error",
      "Running",
      "Completed",
      "Error",
    ],
    default: "Pending",
  },
  verdict: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded"],
  },
  memoryUsed: {
    type: Number, //kilobytes
  },
  runtime: {
    type: Number, //milliseconds
  },
})

module.exports = mongoose.model("submissionSchema", submissionSchema)
