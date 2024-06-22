const competitionSchema = require("../Models2/competitionSchema")
const submissionSchema = require("../Models2/submissionSchema")

// Create a competition
const createCompetition = async (req, res) => {
  const { user1, user2, problems, startTime, endTime } = req.body

  try {
    const competition = new competitionSchema({
      user1,
      user2,
      problems,
      startTime,
      endTime,
      status: "pending",
    })

    await competition.save()
    return res.status(201).json({
      success: true,
      data: competition,
      message: "Competition saved successfully",
    })
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Competition creation failed",
      success: false,
    })
  }
}

// Get all competitions
const getCompetitions = async (req, res) => {
  try {
    const competitions = await competitionSchema
      .find()
      .populate("user1 user2 problems.problem_id")
    res.status(200).json({
      success: true,
      message: "all competitions fetched successfully",
      data: competitions,
    })
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Failed to retrieve competitions",
      success: false,
    })
  }
}

// Get a specific competition by ID
const getCompetitionById = async (req, res) => {
  const { id } = req.params

  // console.log(id)

  try {
    const competition = await competitionSchema
      .findById(id)
      .populate("user1 user2 problems.problem_id")
    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition with given id is not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: competition,
    })
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      message: "Failed to retrieve competition",
      success: false,
    })
  }
}

// Route to check solutions for a competition
const checkSubmission = async (req, res) => {
  const { id } = req.params

  try {
    const competition = await competitionSchema
      .findById(id)
      .populate("user1", "fName lName")
      .populate("user2", "fName lName")
      .populate("problems.problem_id", "title")
      .exec()

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" })
    }
    // console.log(competition.problems)
    // console.log(typeof competition)

    const { startTime, endTime, user1, user2, problems } = competition

    // console.log(startTime, endTime, user1, user2)

    const results = await Promise.all(
      problems.map(async (problem) => {
        const submissions = await submissionSchema
          .find({
            problemId: problem.problem_id._id,
            submittedAt: { $gte: startTime, $lte: endTime },
            verdict: "Accepted",
            userId: { $in: [user1._id, user2._id] },
          })
          .sort("submittedAt")
          .exec()

        // console.log(submissions)
        // console.log(problem.problem_id._id)

        let solver = "no"
        if (submissions.length > 0) {
          const earliestSubmission = submissions[0]
          // console.log("this is problem ids")
          // console.log(earliestSubmission)
          solver = earliestSubmission.userId.equals(user1._id)
            ? `${user1._id}`
            : `${user2._id}`
          // console.log(solver)
        }
        // console.log({
        //   problemId: problem.problem_id._id,
        //   solvedBy: solver,
        // })

        return {
          problemTitle: problem.problem_id._id,
          solvedBy: solver,
        }
      })
    )

    // console.log("done")
    // console.log(results)

    return res.status(200).json({
      data: results,
      message: "fetched successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error checking solutions:", error)
    return res.status(500).json({
      error: "Internal server error",
      message: "fetching failed",
      success: false,
    })
  }
}

module.exports = {
  createCompetition,
  getCompetitions,
  getCompetitionById,
  checkSubmission,
}
