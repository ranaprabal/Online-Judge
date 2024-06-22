const mongoose = require("mongoose")

const competitionSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "ongoing", "finished"],
    required: true,
  },
  problems: [
    {
      problem_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "problemSchema",
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      solver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
        default: null,
      },
    },
  ],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model("competitionSchema", competitionSchema)
