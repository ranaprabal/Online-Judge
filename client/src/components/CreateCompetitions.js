import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import "./CreateCompetition.css"
import Fevicon from "../images/fevicon.png"

const backend_url = "http://localhost:8080/"

const CreateCompetition = () => {
  const [user1, setUser1] = useState("")
  const [user2, setUser2] = useState("")
  const [users, setUsers] = useState([])
  const [problems, setProblems] = useState([{ problem_id: "", points: "" }])
  const [allProblems, setAllProblems] = useState([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUser1(decodedToken.id)
    }

    // Fetch all users
    axios
      .get(`${backend_url}api/getAllUser`)
      .then((response) => {
        console.log("Response data:", response.data)
        setUsers(response.data)
      })
      .catch((err) => console.error("Error fetching users:", err))

    // Fetch all problems
    axios
      .get(`${backend_url}api/allProblems`)
      .then((response) => setAllProblems(response.data))
      .catch((err) => console.error("Error fetching problems:", err))
  }, [])

  const handleProblemChange = (index, field, value) => {
    const updatedProblems = [...problems]
    updatedProblems[index][field] = value
    setProblems(updatedProblems)
  }

  const addProblem = () =>
    setProblems([...problems, { problem_id: "", points: "" }])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null) // Clear previous errors
    try {
      const response = await axios.post(
        `${backend_url}api/createCompetitions`,
        {
          user1,
          user2,
          problems,
          startTime,
          endTime,
          status: "pending",
        }
      )
      console.log(response)
      navigate("/allCompetitions")
    } catch (err) {
      console.error(
        "Competition creation failed:",
        err.response?.data || err.message
      )
      setError(
        err.response?.data || "An error occurred during competition creation."
      )
    }
  }

  return (
    <div className="background">
      <div className="create-competition-container">
        <Link to="/allProblems">
          <img src={Fevicon} alt="Logo" />
        </Link>
        <h2>Create Competition</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>User 1</label>
            <select
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              required
            >
              <option value="" disabled>
                Select User 1
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fName} {user.lName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>User 2</label>
            <select
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              required
            >
              <option value="" disabled>
                Select User 2
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fName} {user.lName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Problems</label>
            {problems.map((problem, index) => (
              <div key={index} className="problem-item">
                <select
                  value={problem.problem_id}
                  onChange={(e) =>
                    handleProblemChange(index, "problem_id", e.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select Problem
                  </option>
                  {allProblems.map((prob) => (
                    <option key={prob._id} value={prob._id}>
                      {prob.title}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Points"
                  value={problem.points}
                  onChange={(e) =>
                    handleProblemChange(index, "points", e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addProblem}>
              Add Problem
            </button>
          </div>
          <div>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Start Time"
              required
            />
          </div>
          <div>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="End Time"
              required
            />
          </div>
          <button type="submit">Create Competition</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default CreateCompetition
