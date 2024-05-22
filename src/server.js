//import express
const express = require("express")

//create app
const app = express()

// load the env file to process object
require("dotenv").config()

// fetch PORT details
const PORT = process.env.PORT || 8000

//to read data from json
app.use(express.json())

//connect to database
const dbConnect = require("./config/database")
dbConnect()

// import routes
const auth = require("./routes/auth")
app.use("/api", auth)

//activate the app
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
