const submissionSchema = require("../Models2/submissionSchema")
const problemSchema = require("../Models2/problemSchema")
const axios = require("axios")

const WORKER_SERVER_URL = process.env.WORKER_SERVER_URL

exports.createSubmission = async (req, res) => {
  const { problemId, userId, code, language = "cpp" } = req.body

  try {
    const problem = await problemSchema.findById(problemId)
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      })
    }

    const submission = new submissionSchema({
      problemId,
      userId,
      code,
      language,
      status: "Pending",
    })
    await submission.save()

    submission.status = "Running"
    await submission.save()

    let response

    if (language == "cpp") {
      response = await axios.post(`${WORKER_SERVER_URL}/compileCpp`, {
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
    } else if (language == "py") {
      response = await axios.post(`${WORKER_SERVER_URL}/compilePy`, {
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
    } else if (language == "java") {
      response = await axios.post(`${WORKER_SERVER_URL}/compileJava`, {
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
    }

    const outputFilePath = response.data.outputPath

    let allPassed = true
    let totalTime = 0
    let totalMemory = 0
    let totalTestcasePassed = 1
    try {
      for (const testCase of problem.testcases) {
        let response2
        if (language == "cpp") {
          response2 = await axios.post(`${WORKER_SERVER_URL}/executeCpp`, {
            input: testCase.input,
            outputFilePath,
          })
        } else if (language == "py") {
          response2 = await axios.post(`${WORKER_SERVER_URL}/executePy`, {
            input: testCase.input,
            outputFilePath,
          })
        } else if (language == "java") {
          response2 = await axios.post(`${WORKER_SERVER_URL}/executeJava`, {
            input: testCase.input,
            outputFilePath,
          })
        }

        if (response2.data.output.trim() != testCase.output.trim()) {
          allPassed = false
          submission.status = "Completed"
          submission.verdict = "Wrong Answer"
          submission.result = `Test case failed: ${testCase.input} -> Expected: ${testCase.output}, Got: ${response2.output}`
          submission.passedTestcase = totalTestcasePassed
          break
        }
        totalTestcasePassed += 1
        //   totalTime += response2.time
        //   totalMemory += response2.memory
      }
    } catch (error) {
      return res.status(500).json({
        error: error.response.data,
        success: false,
        message: error.response.data.message,
      })
    }

    if (allPassed) {
      submission.status = "Completed"
      submission.verdict = "Accepted"
      submission.result = "All test cases passed"
      submission.passedTestcase = totalTestcasePassed
      //   submission.runtime = totalTime
      //   submission.memoryUsed = totalMemory
    }

    await submission.save()

    // Cleanup compiled files
    // fs.unlinkSync(compileResult.compiledCodePath)

    return res.status(201).json({
      success: true,
      data: submission,
      message: "Submission successful",
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Can not submit currently",
    })
  }
}

exports.showProblemSubmissions = async (req, res) => {
  try {
    const { userId, problemId } = req.query

    const submission = await submissionSchema.find({ userId, problemId })

    return res.status(201).json({
      success: true,
      data: submission,
      message: "Submissions fetched successful",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in Submissions fetching",
    })
  }
}
