// src/App.js
import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ProblemsTable from "./components/ProblemsTable"
import CreateProblem from "./components/CreateProblem"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <h2>Welcome to CodeJury</h2>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/allProblems" element={<ProblemsTable />} />
          <Route path="/create-problem" element={<CreateProblem />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
