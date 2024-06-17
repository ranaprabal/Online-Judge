import React, { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "./signup.css"

const Signup = () => {
  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("User")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    console.log("Form data:", { fName, lName, email, password, accountType })

    try {
      const response = await axios.post("/api/signup", {
        fName,
        lName,
        email,
        password,
        accountType,
      })
      console.log("Response data:", response.data)
      navigate("/login")
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message)
      setError(err.response?.data || "An error occurred during signup.")
    }
  }

  return (
    <div className="background">
      <div className="signup-container">
        <h2>Signup</h2>
        <img src="fevicon.png" alt="Logo" />
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              placeholder="First Name"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
              placeholder="Last Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <div className="password-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>
          <div>
            <label>Account Type</label>
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
        <div className="login-button">
          <br></br>
          Already registered?{" "}
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
