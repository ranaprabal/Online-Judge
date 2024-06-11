// src/components/Navbar.js
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode" // Ensure correct import
import axios from "axios"
import "./Navbar.css"

const Navbar = () => {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const fetchUserName = async (email) => {
      try {
        console.log(email)
        const response = await axios.post(
          "http://localhost:8000/api/getUserName",
          {
            email,
          }
        )
        console.log(response)
        console.log(response.data)
        console.log(response.userName)
        if (response.data.success) {
          setUserName(response.data.userName)
        } else {
          console.error("Failed to fetch username:", response.data.message)
        }
      } catch (error) {
        console.error("Error fetching username:", error)
      }
    }

    const token = Cookies.get("token")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        fetchUserName(decodedToken.email)
        // Retrieve user ID from the token
        setUserId(decodedToken.id)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  const handleSignOut = () => {
    Cookies.remove("token")
    setUserName("") // Clear the username in state
    window.location.reload() // Refresh the page or redirect to login
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/allProblems">All Problems</Link>
        </li>
        <li>
          <Link to={`/profile/${userId}`}>My Profile</Link>
        </li>
        <li className="navbar-right">
          {userName ? (
            <>
              <span>{userName}</span>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
