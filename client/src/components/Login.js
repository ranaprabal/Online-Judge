// src/components/Login.js
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie" // Add this import for managing cookies
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      })
      console.log(response.data) // Handle response data as needed

      // Set the token in the cookies
      Cookies.set("token", response.data.token, { expires: 1 }) // 1 day

      navigate("/allProblems") // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message)
    }
  }

  return (
    <div className="login-container">
      <h2>This is Login Page</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <div className="signup-button">
        <br></br>
        New User?{" "}
        <Link to="/signup">
          <button>Signup</button>
        </Link>
      </div>
    </div>
  )
}

export default Login
