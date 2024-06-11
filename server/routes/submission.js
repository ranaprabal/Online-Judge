const express = require("express")

const router = express.Router()

const {
  createSubmission,
  showProblemSubmissions,
} = require("../controllers/submission")

router.post("/submit", createSubmission)
router.get("/showProblemSubmissions", showProblemSubmissions)

module.exports = router
