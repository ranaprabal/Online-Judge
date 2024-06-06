import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("User") // Default to 'User'
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null) // Clear any previous errors
    console.log("Form data:", { fName, lName, email, password, accountType })

    try {
      const response = await axios.post("/api/signup", {
        fName,
        lName,
        email,
        password,
        accountType,
      })
      console.log("Response data:", response.data) // Check the response data
      navigate("/login") // Redirect after successful signup
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message)
      setError(err.response?.data || "An error occurred during signup.")
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Account Type:</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Problem Setter">Problem Setter</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">Signup</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  )
}

export default Signup
