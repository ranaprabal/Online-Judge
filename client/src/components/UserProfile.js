import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import "./UserProfile.css"

const backend_url = "https://backend.codejury.org/"

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    DOB: "",
    about: "",
    organisation: "",
    phoneNumber: "",
    country: "",
  })

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      fetchUserProfile(decodedToken.id)
    }
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`${backend_url}api/getUser/${userId}`)
      const userData = response.data.data
      setUser(userData)
      setFormData({
        fName: userData.fName || "",
        lName: userData.lName || "",
        email: userData.email || "",
        DOB: userData.DOB ? userData.DOB.split("T")[0] : "",
        about: userData.about || "",
        organisation: userData.organisation || "",
        phoneNumber: userData.phoneNumber || "",
        country: userData.country || "",
      })
    } catch (error) {
      console.error("Failed to fetch user profile", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = Cookies.get("token")
      if (token) {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.id
        await axios.put(`${backend_url}api/updateDetails/${userId}`, formData)
        fetchUserProfile(decodedToken.id)
        setEditMode(false)
      }
    } catch (error) {
      console.error("Failed to update profile", error)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="user-profile">
      <div className="profile-info">
        <img src={user.image} alt="Profile" />
        {!editMode ? (
          <div>
            <h1>
              {user.fName} {user.lName}
            </h1>
            <p>Email: {user.email}</p>
            <p>
              Date of Birth:{" "}
              {user.DOB ? new Date(user.DOB).toLocaleDateString() : ""}
            </p>
            <p>About: {user.about}</p>
            <p>Organisation: {user.organisation}</p>
            <p>Phone Number: {user.phoneNumber}</p>
            <p>Country: {user.country}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              First Name:
              <input
                type="text"
                name="fName"
                value={formData.fName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lName"
                value={formData.lName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleInputChange}
              />
            </label>
            <label>
              About:
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
              ></textarea>
            </label>
            <label>
              Organisation:
              <input
                type="text"
                name="organisation"
                value={formData.organisation}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default UserProfile
