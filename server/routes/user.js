const express = require("express")

const router = express.Router()

const {
  getUserName,
  updateDetails,
  getUserDetailsWithId,
} = require("../controllers/user")

router.post("/getUserName", getUserName)
router.get("/getUser/:id", getUserDetailsWithId)
router.put("/updateDetails/:id", updateDetails)

module.exports = router
