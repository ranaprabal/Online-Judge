import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import "./Navbar.css"
import AppLogo from "../images/logo2.png"
import UserLogo from "../images/icons8-user-52.png"

const backend_url = "https://backend.codejury.org/"

const Navbar = () => {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [problemsDropdownOpen, setProblemsDropdownOpen] = useState(false)
  const [competitionsDropdownOpen, setCompetitionsDropdownOpen] =
    useState(false)

  useEffect(() => {
    const fetchUserName = async (email) => {
      try {
        const response = await axios.post(`${backend_url}api/getUserName`, {
          email,
        })
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
        setUserRole(decodedToken.accountType) // Set user role from the token
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

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  const toggleProblemsDropdown = () => {
    setProblemsDropdownOpen(!problemsDropdownOpen)
  }

  const toggleCompetitionsDropdown = () => {
    setCompetitionsDropdownOpen(!competitionsDropdownOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/allProblems">
          <img src={AppLogo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <div className="navbar-item">
          <span onClick={toggleProblemsDropdown} className="navbar-link">
            Problems
          </span>
          {problemsDropdownOpen && (
            <div className="navbar-dropdown">
              {userRole === "Admin" && (
                <Link to="/edit-problems">Edit Problems</Link>
              )}
              {(userRole === "Admin" || userRole === "Problem Setter") && (
                <Link to="/create-problem">Create Problem</Link>
              )}
              <Link to="/allProblems">All Problems</Link>
            </div>
          )}
        </div>
        <div className="navbar-item">
          <span onClick={toggleCompetitionsDropdown} className="navbar-link">
            Competitions
          </span>
          {competitionsDropdownOpen && (
            <div className="navbar-dropdown">
              {userRole === "Admin" && (
                <Link to="/create-competitions">Create Competition</Link>
              )}
              <Link to="/allCompetitions">All Competitions</Link>
            </div>
          )}
        </div>
      </div>
      <div className="navbar-right">
        {userName ? (
          <div className="navbar-user">
            <span onClick={toggleUserDropdown} className="navbar-user-icon">
              <img src={UserLogo} alt="User" className="user-icon" />
            </span>
            {userDropdownOpen && (
              <div className="navbar-dropdown">
                <Link to={`/profile/${userId}`}>{userName}</Link>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-user">
            <span onClick={toggleUserDropdown} className="navbar-user-icon">
              <img src={UserLogo} alt="User" />
            </span>
            {userDropdownOpen && (
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
