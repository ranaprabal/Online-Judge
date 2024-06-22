import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import "./CreateProblem.css"

const backend_url = "https://backend.codejury.org/"

const EditProblem = () => {
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [img, setImg] = useState("")
  const [description, setDescription] = useState("")
  const [userId, setUserId] = useState(null)
  const [inputFormat, setInputFormat] = useState("")
  const [outputFormat, setOutputFormat] = useState("")
  const [constraints, setConstraints] = useState("")
  const [examples, setExamples] = useState([{ input: "", output: "" }])
  const [difficulty, setDifficulty] = useState("Easy")
  const [tags, setTags] = useState([])
  const [testcases, setTestcases] = useState([{ input: "", output: "" }])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      const decodedToken = jwtDecode(token)
      setUserId(decodedToken.id)
    }

    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${backend_url}api/problem/${id}`)
        const problem = response.data.problem
        setTitle(problem.title || "")
        setImg(problem.img || "")
        setDescription(problem.description || "")
        setInputFormat(problem.inputFormat || "")
        setOutputFormat(problem.outputFormat || "")
        setConstraints(problem.constraints || "")
        setExamples(
          problem.examples.length > 0
            ? problem.examples
            : [{ input: "", output: "" }]
        )
        setDifficulty(problem.difficulty || "Easy")
        setTags(problem.tags.length > 0 ? problem.tags : [])
        setTestcases(
          problem.testcases.length > 0
            ? problem.testcases
            : [{ input: "", output: "" }]
        )
      } catch (err) {
        console.error("Failed to fetch problem:", err)
        setError("Failed to fetch problem")
      }
    }

    fetchProblem()
  }, [id])

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...examples]
    updatedExamples[index][field] = value
    setExamples(updatedExamples)
  }

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testcases]
    updatedTestCases[index][field] = value
    setTestcases(updatedTestCases)
  }

  const addExample = () => setExamples([...examples, { input: "", output: "" }])
  const addTestCase = () =>
    setTestcases([...testcases, { input: "", output: "" }])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      console.log(`Submitting update to: ${backend_url}api/updateProblem/${id}`)
      const response = await axios.put(
        `${backend_url}api/updateProblem/${id}`,
        {
          title,
          img,
          description,
          inputFormat,
          outputFormat,
          constraints,
          examples,
          difficulty,
          tags,
          testcases,
        }
      )
      console.log(response.data)
      navigate("/allProblems")
    } catch (err) {
      console.log(err)
      console.error("Problem update failed:", err.response?.data || err.message)
      setError(
        JSON.stringify(
          err.response?.data || "An error occurred during problem update."
        )
      )
    }
  }

  return (
    <div className="background">
      <div className="create-problem-container">
        <Link to="/">
          <img src="fevicon.png" alt="Logo" />
        </Link>
        <h2>Edit Problem</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="Image URL (if any)"
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          <div>
            <textarea
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
              placeholder="Input Format"
              required
            />
          </div>
          <div>
            <textarea
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              placeholder="Output Format"
              required
            />
          </div>
          <div>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="Constraints"
              required
            />
          </div>
          <div>
            <label>Examples Testcases</label>
            {examples.map((example, index) => (
              <div key={index} className="example-case">
                <input
                  type="text"
                  placeholder="Example Input"
                  value={example.input}
                  onChange={(e) =>
                    handleExampleChange(index, "input", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Example Output"
                  value={example.output}
                  onChange={(e) =>
                    handleExampleChange(index, "output", e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addExample}>
              Add Example
            </button>
          </div>
          <div>
            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={tags.join(", ")}
              placeholder="Tags"
              onChange={(e) =>
                setTags(e.target.value.split(",").map((tag) => tag.trim()))
              }
            />
          </div>
          <div>
            <label>Testcases</label>
            {testcases.map((testcase, index) => (
              <div key={index} className="test-case">
                <input
                  type="text"
                  placeholder="Test Case Input"
                  value={testcase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Test Case Output"
                  value={testcase.output}
                  onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addTestCase}>
              Add Test Case
            </button>
          </div>
          <button type="submit" onClick={handleSubmit}>
            Update Problem
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default EditProblem
