import React, { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import dayjs from "dayjs"
import "./LockOut1vs1.css"

const backend_url = "http://localhost:8080/"

const Competition = () => {
  const { id } = useParams()
  const [competition, setCompetition] = useState(null)
  const intervalRef = useRef(null)
  const [isCompetitionOver, setIsCompetitionOver] = useState(false)
  const [winner, setWinner] = useState("")

  const fetchCompetition = async () => {
    try {
      const response = await axios.get(`${backend_url}api/competitions/${id}`)
      console.log("Fetched competition data:", response.data.data)
      setCompetition(response.data.data)
    } catch (error) {
      console.error("Error fetching competition data:", error)
    }
  }

  const updateCompetition = async () => {
    try {
      const response = await axios.get(
        `${backend_url}api/competition/check-solutions/${id}`
      )
      console.log("Fetched updated problems:", response.data.data)
      const updatedProblems = response.data.data
      setCompetition((prevCompetition) => {
        const updatedCompetition = { ...prevCompetition }
        updatedProblems.forEach((problem) => {
          const matchingProblem = updatedCompetition.problems.find(
            (p) => p.problem_id._id === problem.problemTitle
          )
          if (matchingProblem) {
            matchingProblem.solver_id =
              problem.solvedBy === "no" ? null : problem.solvedBy
          }
        })
        return updatedCompetition
      })
    } catch (error) {
      console.error("Error updating competition data:", error)
    }
  }

  const checkCompetitionEnd = () => {
    if (!competition) return

    const allProblemsSolved = competition.problems.every(
      (problem) => problem.solver_id
    )
    const endTimeReached = dayjs().isAfter(dayjs(competition.endTime))

    if (allProblemsSolved || endTimeReached) {
      setIsCompetitionOver(true)
      clearInterval(intervalRef.current)

      const user1Score = competition.problems.reduce((total, problem) => {
        return problem.solver_id === competition.user1._id
          ? total + problem.points
          : total
      }, 0)
      const user2Score = competition.problems.reduce((total, problem) => {
        return problem.solver_id === competition.user2._id
          ? total + problem.points
          : total
      }, 0)

      if (user1Score > user2Score) {
        setWinner(`${competition.user1.fName} ${competition.user1.lName}`)
      } else if (user2Score > user1Score) {
        setWinner(`${competition.user2.fName} ${competition.user2.lName}`)
      } else {
        setWinner("Draw")
      }
    }
  }

  useEffect(() => {
    fetchCompetition()
  }, [id])

  useEffect(() => {
    if (competition) {
      intervalRef.current = setInterval(() => {
        updateCompetition()
        checkCompetitionEnd()
      }, 6000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [competition, id])

  if (!competition) return <div>Loading...</div>

  const { user1, user2, problems } = competition

  let user1Score = 0
  let user2Score = 0

  problems.forEach((problem) => {
    if (problem.solver_id) {
      if (problem.solver_id === user1._id) {
        user1Score += problem.points
      } else if (problem.solver_id === user2._id) {
        user2Score += problem.points
      }
    }
  })

  return (
    <div className="competition-container">
      <h1 className="competition-title">LockOut Competition</h1>
      <div className="competition-details">
        <div className="user-box">
          <div className="user-name">{`${user1.fName} ${user1.lName}`}</div>
          <div className="user-score">Score: {user1Score}</div>
        </div>
        <div className="vs-box">V/S</div>
        <div className="user-box">
          <div className="user-name">{`${user2.fName} ${user2.lName}`}</div>
          <div className="user-score">Score: {user2Score}</div>
        </div>
      </div>
      {isCompetitionOver && (
        <div className="competition-over">
          <h2>Competition Over</h2>
          <h3 className="winner">Winner: {winner}</h3>
        </div>
      )}
      <table className="competition-table">
        <thead>
          <tr>
            <th>Problem Title</th>
            <th>Score</th>
            <th>Solved By</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.problem_id._id}>
              <td className={problem.solver_id ? "solved" : ""}>
                <Link to={`/problem/${problem.problem_id._id}`}>
                  {problem.problem_id.title}
                </Link>
              </td>
              <td>{problem.points}</td>
              <td>
                {problem.solver_id
                  ? problem.solver_id === user1._id
                    ? `${user1.fName} ${user1.lName}`
                    : `${user2.fName} ${user2.lName}`
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Competition
