// src/components/ProblemsTable.js
import React, { useEffect, useState } from "react"
import axios from "axios"
import "./ProblemsTable.css"

const ProblemsTable = () => {
  const [problems, setProblems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/allProblems"
        )
        setProblems(response.data)
      } catch (err) {
        console.error("Failed to fetch problems:", err)
        setError("Failed to fetch problems")
      }
    }
    fetchProblems()
  }, [])

  return (
    <div className="problems-container">
      <h2>Problems List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="problems-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id}>
              <td>{problem.title}</td>
              <td>{problem.difficulty}</td>
              <td>{problem.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProblemsTable
