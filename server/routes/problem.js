const express = require("express")

const router = express.Router()

const { createProblem } = require("../controllers/createProblem")

router.post("/create", createProblem)

module.exports = router
