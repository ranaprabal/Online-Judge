const submissionSchema = require("../Models/submissionSchema")
const problemSchema = require("../Models/problemSchema")
const { generateFile } = require("./generateFile")
const { executeCpp, executePy, executeJava } = require("./executeCode")

exports.createSubmission = async (req, res) => {
  const { problemId, userId, code, language = "cpp" } = req.body

  try {
    const problem = await problemSchema
      .findById(problemId)
      .populate("testcases")
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
    try {
      for (const testCase of problem.testcases) {
        const filePath = await generateFile(language, code)
        let runResult
        if (language == "cpp") {
          runResult = await executeCpp(filePath, testCase.inputData)
        } else if (language == "py") {
          runResult = await executePy(filePath, testCase.inputData)
        } else if (language == "java") {
          runResult = await executeJava(filePath, testCase.inputData)
        }

        console.log(runResult)

        if (runResult.trim() != testCase.expectedOutput.trim()) {
          console.log("hello")
          allPassed = false
          submission.status = "Completed"
          submission.verdict = "Wrong Answer"
          submission.result = `Test case failed: ${testCase.inputData} -> Expected: ${testCase.expectedOutput}, Got: ${runResult.output}`
          break
        }

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
      //   submission.runtime = totalTime
      //   submission.memoryUsed = totalMemory
    }

    await submission.save()

    // Cleanup compiled files
    // fs.unlinkSync(compileResult.compiledCodePath)

    return res.status(201).json({
      success: true,
      and: submission,
      message: "Submission successful",
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      and: submission,
      message: "Can not submit currently",
    })
  }
}
