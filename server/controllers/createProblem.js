const problemSchema = require("../Models/problemSchema")
const testcaseSchema = require("../Models/testcaseSchema")

exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      img,
      description,
      inputFormat,
      outputFormat,
      constraints,
      examples,
      difficulty,
      tags,
      setterId,
      testcases,
    } = req.body

    const problem = new problemSchema({
      title,
      img,
      description,
      inputFormat,
      outputFormat,
      constraints,
      examples,
      difficulty,
      tags,
      setterId,
    })

    await problem.save()

    const createdTestCases = await testcaseSchema.insertMany(
      testcases.map((tc) => ({
        ...tc,
        problem: problem._id,
      }))
    )

    problem.testcases = createdTestCases.map((tc) => tc._id)
    await problem.save()

    return res.status(201).json({
      success: true,
      message: "Problem saved successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Problem creation failed, please try again later",
    })
  }
}
