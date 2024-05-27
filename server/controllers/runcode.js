const { generateFile } = require("./generateFile")
const { executeCpp, executePy, executeJava } = require("./executeCode")

exports.runcode = async (req, res) => {
  try {
    const { code, lang = "cpp", input } = req.body

    //   check if code exits
    if (code == undefined) {
      return res.status(400).json({
        success: false,
        message: "Code must not be empty",
      })
    }
    try {
      //we need to generate the file and we need to send the response
      const filePath = await generateFile(lang, code)
      let output

      if (lang == "cpp") {
        output = await executeCpp(filePath, input)
      } else if (lang == "py") {
        output = await executePy(filePath, input)
      } else if (lang == "java") {
        output = await executeJava(filePath, input)
      } else {
        console.log("NO other language supported")
      }

      return res.json({ filePath, output })
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Error file generating file or executing file",
      })
    }
  } catch (error) {
    console.error(error)
    console.log("could not run the code")
  }
}
