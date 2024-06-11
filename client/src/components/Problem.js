import React, { useState, useEffect } from "react"
import axios from "axios"
import "./Problem.css"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

const Problem = ({ problemId }) => {
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("cpp")
  const [output, setOutput] = useState("")
  const [verdict, setVerdict] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [userId, setUserId] = useState("")
  const [testCaseResults, setTestCaseResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/problem/${problemId}`
        )
        console.log(response.data.problem)

        setProblem(response.data.problem)
      } catch (error) {
        setError("Failed to fetch problem details.")
      } finally {
        setLoading(false)
      }
    }

    fetchProblemDetails()

    // Retrieve user ID from the token
    const token = Cookies.get("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUserId(decodedToken.id)
    }
  }, [problemId])

  const handleClick = () => {
    navigate(`/getProblemSubmissions/${problemId}`)
  }

  const handleRun = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/runCode", {
        code,
        language,
        input: inputValue,
      })

      const outputData = response.data.output
      if (typeof outputData === "object") {
        setOutput(JSON.stringify(outputData, null, 2)) // Convert the object to a string for display
      } else {
        setOutput(outputData)
      }

      setVerdict("Run Successful")
    } catch (error) {
      const errorResponse = error.response?.data
      const errorMessage = errorResponse?.error || "Error in code execution"
      const stderrMessage = errorResponse?.stderr || ""

      console.log(errorMessage)
      console.log("end")
      console.log(stderrMessage)

      let multilineString = stderrMessage.toString()

      // Split the multiline string into an array of lines
      const lines = multilineString.split("\n")

      // Define the regular expression to match the error message
      const regex = /error:\s+(.*)/i

      let errorLineMessage = "" // Initialize the string to accumulate error messages

      // Iterate through the lines and accumulate the error messages in the new string
      lines.forEach((line) => {
        const match = line.match(regex)
        if (match) {
          errorLineMessage += "error: " + match[1] + "\n" // Add the captured error message to the new string
        }
      })

      setOutput(`Stderr: \n${errorLineMessage}`)
      setVerdict("code has some error")
    }
  }

  const handleSubmit = async () => {
    try {
      console.log("this is userId: ")
      console.log(userId)
      const response = await axios.post("http://localhost:8000/api/submit", {
        problemId,
        userId,
        code,
        language,
        input: inputValue,
      })

      const { result, verdict, passedTestcase } = response.data.data
      setOutput(result)
      setVerdict(verdict)

      const testCaseStatuses = problem.testcases.map((testCase, index) => {
        let status
        if (index + 1 < passedTestcase) {
          status = "passed"
        } else if (index + 1 === passedTestcase) {
          status = "failed"
        } else {
          status = "not tested"
        }
        return {
          index: index + 1,
          status,
        }
      })
      setTestCaseResults(testCaseStatuses)
    } catch (error) {
      console.log(error)
      setOutput(error.response?.data?.error || "Error in submission")
      setVerdict("Submission Failed")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="problem-container">
      <div className="problem-details">
        <h2>{problem.title}</h2>
        <button className="my-submissions-btn" onClick={handleClick}>
          My Submissions
        </button>
        <p>
          <strong>Description:</strong> {problem.description}
        </p>
        {problem.image && <img src={problem.image} alt="Problem visual" />}
        <p>
          <strong>Input Format:</strong> {problem.inputFormat}
        </p>
        <p>
          <strong>Output Format:</strong> {problem.outputFormat}
        </p>
        <p>
          <strong>Constraints:</strong> {problem.constraints}
        </p>
        <div className="examples">
          <h3>Example Inputs and Outputs</h3>
          {problem.examples && problem.examples.length > 0 ? (
            problem.examples.map((example, index) => (
              <div key={index}>
                <p>
                  <strong>Input {index + 1}:</strong> {example.input}
                </p>
                <p>
                  <strong>Output {index + 1}:</strong> {example.output}
                </p>
              </div>
            ))
          ) : (
            <p>No example inputs/outputs provided.</p>
          )}
        </div>
        <p>
          <strong>Difficulty:</strong> {problem.difficulty}
        </p>
        <p>
          <strong>Tags:</strong>{" "}
          {problem.tags?.join(", ") || "No tags available"}
        </p>
      </div>
      <div className="code-submission">
        <div className="language-select">
          <label>
            <pre>Language: </pre>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="cpp">C++</option>
              <option value="py">Python</option>
              <option value="java">Java</option>
            </select>
          </label>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write Your Code Here......."
          rows={20}
          cols={50}
        ></textarea>
        <div>
          <label>
            Input:
            <textarea
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={4}
              cols={50}
              placeholder="Your Inputs Here....."
            />
          </label>
        </div>
        <div className="run-submit-buttons">
          <button onClick={handleRun}>Run</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className="output">
          <h3>Output:</h3>
          <pre>{output}</pre>
          <h3>Verdict:</h3>
          <pre>{verdict}</pre>
        </div>
        <div className="test-case-results">
          <h3>Test Case Results:</h3>
          {testCaseResults.map((testCase) => (
            <p
              key={testCase.index}
              style={{
                color:
                  testCase.status === "passed"
                    ? "green"
                    : testCase.status === "failed"
                    ? "red"
                    : "black",
              }}
            >
              Test Case {testCase.index}:{" "}
              {testCase.status === "passed"
                ? "Passed"
                : testCase.status === "failed"
                ? "Failed"
                : "Not Tested"}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Problem