import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./CompetitionsTable.css"

const backend_url = "http://localhost:8080/"

const CompetitionsTable = () => {
  const [competitions, setCompetitions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.get(`${backend_url}api/competitions`)
        console.log(response.data.data)
        // Ensure response data is an array
        if (Array.isArray(response.data.data)) {
          setCompetitions(response.data.data)
        } else {
          setError("Invalid data format")
        }
      } catch (err) {
        console.error("Failed to fetch competitions:", err)
        setError("Failed to fetch competitions")
      }
    }
    fetchCompetitions()
  }, [])

  const currentTime = new Date()

  const upcomingCompetitions = competitions.filter(
    (competition) => new Date(competition.startTime) > currentTime
  )

  const runningCompetitions = competitions.filter(
    (competition) =>
      new Date(competition.startTime) <= currentTime &&
      new Date(competition.endTime) > currentTime
  )

  const pastCompetitions = competitions.filter(
    (competition) => new Date(competition.endTime) <= currentTime
  )

  const renderCompetitionsTable = (competitions, title, isLinkable) => (
    <div>
      <h2>{title}</h2>
      <table className="competitions-table">
        <thead>
          <tr>
            <th>User 1</th>
            <th>User 2</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Entry Point</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((competition) => (
            <tr key={competition._id}>
              <td>{competition.user1.fName + " " + competition.user1.lName}</td>
              <td>{competition.user2.fName + " " + competition.user2.lName}</td>
              <td className="date-time">
                {new Date(competition.startTime).toLocaleString()}
              </td>
              <td className="date-time">
                {new Date(competition.endTime).toLocaleString()}
              </td>
              <td>
                {isLinkable ? (
                  <Link to={`/competition/${competition._id}`}>Enter</Link>
                ) : (
                  <span>Not Started</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="competitions-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {renderCompetitionsTable(
        upcomingCompetitions,
        "Upcoming Competitions",
        false
      )}
      {renderCompetitionsTable(
        runningCompetitions,
        "Currently Running Competitions",
        true
      )}
      {renderCompetitionsTable(pastCompetitions, "Past Competitions", true)}
    </div>
  )
}

export default CompetitionsTable
