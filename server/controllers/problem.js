const express = require("express")
const Problem = require("../Models2/problemSchema")

// Controller function to get all problems
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("_id title difficulty tags")
    res.status(200).json(problems)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching problems", error: error.message })
  }
}

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
    if (problem) {
      res.status(200).json({ problem })
    } else {
      res.status(404).json({ message: "Problem not found" })
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching problem", error: error.message })
  }
}

module.exports = { getAllProblems, getProblemById }
