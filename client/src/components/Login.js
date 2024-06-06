// src/components/Login.js
import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
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
    </div>
  )
}

export default Login
