import React, { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { Link, useNavigate } from "react-router-dom"
import "./ProblemsTable.css"

const ProblemsTable = () => {
  const [problems, setProblems] = useState([])
  const [error, setError] = useState(null)
  const [userRole, setUserRole] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(
          "http://13.233.90.59:8000/api/allProblems"
        )
        setProblems(response.data)
      } catch (err) {
        console.error("Failed to fetch problems:", err)
        setError("Failed to fetch problems")
      }
    }
    fetchProblems()

    const token = Cookies.get("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUserRole(decodedToken.accountType)
    }
  }, [])

  const handleCreateProblem = () => {
    navigate("/create-problem")
  }

  return (
    <div className="problems-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userRole === "Problem Setter" && (
        <button onClick={handleCreateProblem} className="create-problem-button">
          Create Problem
        </button>
      )}
      <h2>Problems List</h2>
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
              <td>
                <Link to={`/problem/${problem._id}`}>{problem.title}</Link>
              </td>
              <td className={problem.difficulty.toLowerCase()}>
                {problem.difficulty}
              </td>
              <td>{problem.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProblemsTable
