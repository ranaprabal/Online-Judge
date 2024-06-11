const { generateFile } = require("./generateFile")
const { executeCpp, executePy, executeJava } = require("./executeCode")

exports.runcode = async (req, res) => {
  try {
    const { code, language = "cpp", input } = req.body

    //   check if code exits
    if (code == undefined) {
      return res.status(400).json({
        success: false,
        message: "Code must not be empty",
      })
    }
    try {
      //we need to generate the file and we need to send the response
      const filePath = await generateFile(language, code)
      let output

      if (language == "cpp") {
        output = await executeCpp(filePath, input)
      } else if (language == "py") {
        output = await executePy(filePath, input)
      } else if (language == "java") {
        output = await executeJava(filePath, input)
      } else {
        console.log("NO other languageuage supported")
      }

      return res.json({ filePath, output })
    } catch (error) {
      res.status(500).json({
        error: error.toString(), // Convert error object to string
        stderr: error.stderr ? error.stderr.toString() : "", // Convert stderr to string
        success: false,
        message: "Error generating file or executing file",
      })
    }
  } catch (error) {
    console.error(error)
    console.log("could not run the code")
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Internal server error",
    })
  }
}
