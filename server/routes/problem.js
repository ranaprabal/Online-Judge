const express = require("express")

const router = express.Router()

const { createProblem, updateProblem } = require("../controllers/createProblem")

const { getAllProblems, getProblemById } = require("../controllers/problem")

router.post("/create", createProblem)
router.get("/allProblems", getAllProblems)
router.get("/problem/:id", getProblemById)
router.put("/updateProblem/:id", updateProblem)

module.exports = router
