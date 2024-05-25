// importing mongoose config
const mongoose = require("mongoose")

// loading env file into process object
require("dotenv").config()

//connecting to database
const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to database successfully"))
    .catch((err) => {
      //print error message
      console.log("issue in database connection")
      console.error(err.message)
      //recheck this
      process.exit(1)
    })
}

//exporting the dbConnect
module.exports = dbConnect
