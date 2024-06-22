const express = require("express")
const router = express.Router()
const {
  createCompetition,
  checkSubmission,
  getCompetitions,
  getCompetitionById,
} = require("../controllers/competition")

// Route to create a competition
router.post("/createCompetitions", createCompetition)

// Route to get all competitions
router.get("/competitions", getCompetitions)

// Route to get a specific competition by ID
router.get("/competitions/:id", getCompetitionById)
router.get("/competition/check-solutions/:id", checkSubmission)

module.exports = router
