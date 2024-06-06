const express = require("express")

const router = express.Router()

const { createProblem } = require("../controllers/createProblem")

const { getAllProblems } = require("../controllers/problem")

router.post("/create", createProblem)
router.get("/allProblems", getAllProblems)

module.exports = router
