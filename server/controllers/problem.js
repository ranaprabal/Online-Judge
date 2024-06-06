// backend/routes/problems.js
const express = require("express")
const Problem = require("../Models2/problemSchema")

// Controller function to get all problems
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("title difficulty tags")
    res.status(200).json(problems)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching problems", error: error.message })
  }
}

module.exports = { getAllProblems }
