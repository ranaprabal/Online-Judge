// src/components/CreateProblem.js
import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./CreateProblem.css" // Ensure to create this file for styling

const CreateProblem = () => {
  const [title, setTitle] = useState("")
  const [img, setImg] = useState("")
  const [description, setDescription] = useState("")
  const [inputFormat, setInputFormat] = useState("")
  const [outputFormat, setOutputFormat] = useState("")
  const [constraints, setConstraints] = useState("")
  const [examples, setExamples] = useState([{ input: "", output: "" }])
  const [difficulty, setDifficulty] = useState("Easy")
  const [tags, setTags] = useState([])
  const [testcases, setTestcases] = useState([{ input: "", output: "" }])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
    setError(null) // Clear previous errors
    try {
      const response = await axios.post("http://localhost:8000/api/create", {
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
        setterId: "664db1db3f6f87488666c6af", // Replace extracted token
      })
      console.log(response)
      navigate("/allProblems")
    } catch (err) {
      console.error(
        "Problem creation failed:"
        // err.response?.data || err.message
      )
      setError(
        console.log("An error occurred during problem creation.")
        // err.response?.data || "An error occurred during problem creation."
      )
    }
  }

  return (
    <div>
      <h2>Create Problem</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Input Format:</label>
          <textarea
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Output Format:</label>
          <textarea
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Constraints:</label>
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Examples:</label>
          {examples.map((example, index) => (
            <div key={index}>
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
          <label>Difficulty:</label>
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
          <label>Tags:</label>
          <input
            type="text"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((tag) => tag.trim()))
            }
          />
        </div>
        <div>
          <label>Test Cases:</label>
          {testcases.map((testcase, index) => (
            <div key={index}>
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
        <button type="submit">Create Problem</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  )
}

export default CreateProblem
