const problemSchema = require("../Models2/problemSchema")

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

    const problem = await problemSchema.create({
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
    })

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

// Update a problem
exports.updateProblem = async (req, res) => {
  try {
    const problemId = req.params["id"]

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
      testcases,
    } = req.body

    console.log(title)

    const updatedProblem = await problemSchema.findById(problemId)

    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      })
    }

    updatedProblem.title = title || updatedProblem.title
    updatedProblem.img = img || updatedProblem.img
    updatedProblem.description = description || updatedProblem.description
    updatedProblem.inputFormat = inputFormat || updatedProblem.inputFormat
    updatedProblem.outputFormat = outputFormat || updatedProblem.outputFormat
    updatedProblem.constraints = constraints || updatedProblem.constraints
    updatedProblem.examples = examples || updatedProblem.examples
    updatedProblem.tags = tags || updatedProblem.tags
    updatedProblem.testcases = testcases || updatedProblem.testcases
    updatedProblem.difficulty = difficulty || updatedProblem.difficulty

    updatedProblem.save()

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: updatedProblem,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Problem update failed, please try again later",
    })
  }
}
