const express = require("express")

const router = express.Router()

const { createSubmission } = require("../controllers/submission")

router.post("/submit", createSubmission)

module.exports = router
