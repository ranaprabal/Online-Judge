//import express
const express = require("express")

//import cors
const cors = require("cors")

//create app
const app = express()

// load the env file to process object
require("dotenv").config()

// fetch PORT details
const PORT = process.env.PORT || 8000

//to read data from json
app.use(express.urlencoded())
app.use(express.json())
app.use(cors())

//connect to database
const dbConnect = require("./config/database")
dbConnect()

// import routes
const auth = require("./routes/auth")
const runcode = require("./routes/runcode")
const problem = require("./routes/problem")
const submission = require("./routes/submission")
const user = require("./routes/user")
const competition = require("./routes/competition")
app.use("/api", auth)
app.use("/api", runcode)
app.use("/api", problem)
app.use("/api", submission)
app.use("/api", user)
app.use("/api", competition)

//activate the app
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
