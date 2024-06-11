const submissionSchema = require("../Models2/submissionSchema")
const problemSchema = require("../Models2/problemSchema")
const { generateFile } = require("./generateFile")
const { executeCpp, executePy, executeJava } = require("./executeCode")

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

    let allPassed = true
    let totalTime = 0
    let totalMemory = 0
    let totalTestcasePassed = 1
    try {
      const filePath = await generateFile(language, code)

      for (const testCase of problem.testcases) {
        let runResult
        if (language == "cpp") {
          runResult = await executeCpp(filePath, testCase.input)
        } else if (language == "py") {
          runResult = await executePy(filePath, testCase.input)
        } else if (language == "java") {
          runResult = await executeJava(filePath, testCase.input)
        }

        if (runResult.trim() != testCase.output.trim()) {
          console.log(runResult, testCase.output)
          allPassed = false
          submission.status = "Completed"
          submission.verdict = "Wrong Answer"
          submission.result = `Test case failed: ${testCase.input} -> Expected: ${testCase.output}, Got: ${runResult.output}`
          submission.passedTestcase = totalTestcasePassed
          break
        }
        totalTestcasePassed += 1
        //   totalTime += runResult.time
        //   totalMemory += runResult.memory
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        success: false,
        message: "compare the outputs",
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
    // Handle errors
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "error in Submissions fetching",
    })
  }
}
