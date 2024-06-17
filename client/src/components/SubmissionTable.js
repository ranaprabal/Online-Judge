import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import "./SubmissionTable.css"

const SubmissionsTable = () => {
  const [problem, setProblem] = useState(null)
  const { problemId } = useParams()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState("")

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(
          `http://13.233.90.59:8000/api/problem/${problemId}`
        )
        console.log(response.data.problem.title)

        setProblem(response.data.problem.title)
      } catch (error) {
        setError("Failed to fetch problem details.")
      } finally {
        setLoading(false)
      }
    }

    fetchProblemDetails()

    const token = Cookies.get("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUserId(decodedToken.id)
    }
  }, [problemId])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          "http://13.233.90.59:8000/api/showProblemSubmissions",
          { params: { userId, problemId } }
        )
        setSubmissions(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("this is error")
        console.log(error)
        setError("Failed to fetch submissions.")
        setLoading(false)
      }
    }

    if (userId) {
      fetchSubmissions()
    }
  }, [userId, problemId])

  const openPopup = (code) => {
    setModalContent(code)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalContent("")
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="submissions-container">
      <h2>Submissions for {problem}</h2>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Problem Name</th>
            <th>Verdict</th>
            <th>Language</th>
            <th>Submitted At</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr
              key={index}
              className={
                submission.verdict === "Accepted"
                  ? "accepted-row"
                  : "rejected-row"
              }
            >
              <td>{index + 1}</td>
              <td>{problem}</td>
              <td>{submission.verdict}</td>
              <td>{submission.language}</td>
              <td>{submission.submittedAt}</td>
              <td>
                <button onClick={() => openPopup(submission.code)}>
                  View Code
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-show">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>
              &times;
            </span>
            <pre>{modalContent}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubmissionsTable
