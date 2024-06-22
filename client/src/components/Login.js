import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import "./Login.css"

// const backend_url = "http://13.202.53.250:8000/"
const backend_url = "http://localhost:8080/"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${backend_url}api/login`, {
        email,
        password,
      })

      Cookies.set("token", response.data.token, { expires: 1 })

      navigate("/allProblems")
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed")
      console.error("Login failed:", error.message)
    }
  }

  return (
    <div className="background">
      <div className="login-container">
        <h2>Welcome</h2>
        <img src="fevicon.png" alt="Logo" />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="signup-button">
          <br></br>
          Don't have an account?{" "}
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
