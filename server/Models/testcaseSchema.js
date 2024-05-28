const mongoose = require("mongoose")

const testCaseSchema = new mongoose.Schema({
  inputData: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "problemSchema",
  },
})

module.exports = mongoose.model("testcaseSchema", testCaseSchema)
