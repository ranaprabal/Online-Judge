const express = require("express")

const router = express.Router()

const { runcode } = require("../controllers/runcode")

router.post("/runcode", runcode)

module.exports = router
