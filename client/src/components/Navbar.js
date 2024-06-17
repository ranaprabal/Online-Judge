import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode" // Ensure correct import
import axios from "axios"
import "./Navbar.css"

const Navbar = () => {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchUserName = async (email) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/getUserName",
          { email }
        )
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
        setUserId(decodedToken.id)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [])

  const handleSignOut = () => {
    Cookies.remove("token")
    setUserName("")
    window.location.reload()
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="logo2.png" alt="Logo" />
        </Link>
      </div>
      <div className="navbar-right">
        {userName ? (
          <div className="navbar-user">
            <span onClick={toggleDropdown} className="navbar-user-icon">
              <img src="icons8-user-52.png" alt="User" className="user-icon" />
            </span>
            {dropdownOpen && (
              <div className="navbar-dropdown">
                <Link to={`/profile/${userId}`}>{userName}</Link>
                <Link to="/allProblems">All Problems</Link>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-user">
            <span onClick={toggleDropdown} className="navbar-user-icon">
              <img src="icons8-user-52.png" alt="User" />
            </span>
            {dropdownOpen && (
              <div className="navbar-dropdown">
                <Link to="/login">Login</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
