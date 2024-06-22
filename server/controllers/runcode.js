const axios = require("axios")

const WORKER_SERVER_URL = process.env.WORKER_SERVER_URL

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
      let output

      if (language == "cpp") {
        const response = await axios.post(`${WORKER_SERVER_URL}/compileCpp`, {
          code,
        })

        if (response.data.success === false) {
          return res.status(400).json({
            success: false,
            message: "Error in compilation",
            error: response.data.error,
            stderr: response.data.stderr,
          })
        }

        const outputFilePath = response.data.outputPath
        const response2 = await axios.post(`${WORKER_SERVER_URL}/executeCpp`, {
          input,
          outputFilePath,
        })
        output = response2.data.output
      } else if (language == "py") {
        const response = await axios.post(`${WORKER_SERVER_URL}/compilePy`, {
          code,
        })

        if (response.data.success === false) {
          return res.status(400).json({
            success: false,
            message: "Error in compilation",
            error: response.data.error,
            stderr: response.data.stderr,
          })
        }

        const outputFilePath = response.data.outputPath
        const response2 = await axios.post(`${WORKER_SERVER_URL}/executePy`, {
          input,
          outputFilePath,
        })
        output = response2.data.output
      } else if (language == "java") {
        const response = await axios.post(`${WORKER_SERVER_URL}/compileJava`, {
          code,
        })

        if (response.data.success === false) {
          return res.status(400).json({
            success: false,
            message: "Error in compilation",
            error: response.data.error,
            stderr: response.data.stderr,
          })
        }

        const outputFilePath = response.data.outputPath
        const response2 = await axios.post(`${WORKER_SERVER_URL}/executeJava`, {
          input,
          outputFilePath,
        })

        output = response2.data.output
      } else {
        console.log("No other language supported")
      }

      return res.status(200).json({ success: true, stdout: output })
    } catch (error) {
      if (
        error.response.data.message == "Execution stopped due to time limit"
      ) {
        return res.status(400).json({
          message: error.response.data.message,
          stderr: "error: Time Limit Exceeded",
          success: false,
        })
      }
      res.status(500).json({
        message: error.response.data.message,
        stderr:
          (error.response.data.stderr
            ? error.response.data.stderr.toString()
            : " ") || error.response.data.message,
        success: false,
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Internal server error",
    })
  }
}
