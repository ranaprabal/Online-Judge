const express = require("express")

const router = express.Router()

const {
  getUserName,
  updateDetails,
  getUserDetailsWithId,
  getAllUsers,
} = require("../controllers/user")

router.post("/getUserName", getUserName)
router.get("/getUser/:id", getUserDetailsWithId)
router.get("/getAllUser", getAllUsers)
router.put("/updateDetails/:id", updateDetails)

module.exports = router
