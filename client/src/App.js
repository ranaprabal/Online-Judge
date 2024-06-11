import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  useLocation,
  Link,
} from "react-router-dom"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ProblemsTable from "./components/ProblemsTable"
import CreateProblem from "./components/CreateProblem"
import Problem from "./components/Problem"
import Navbar from "./components/Navbar"
import SubmissionsTable from "./components/SubmissionTable"
import UserProfile from "./components/UserProfile"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <ConditionalMainHeading />
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/allProblems" element={<ProblemsTable />} />
          <Route path="/create-problem" element={<CreateProblem />} />
          <Route path="/problem/:id" element={<ProblemWrapper />} />
          <Route
            path="/getProblemSubmissions/:problemId"
            element={<SubmissionsTable />}
          />
          <Route path="/profile/:userId" element={<UserWrapper />} />
        </Routes>
      </div>
    </Router>
  )
}

const ConditionalNavbar = () => {
  const location = useLocation()
  return location.pathname !== "/" ? <Navbar /> : null
}

const ConditionalMainHeading = () => {
  const location = useLocation()
  return location.pathname !== "/" ? (
    <h1 className="main-heading">Welcome to CodeJury</h1>
  ) : null
}

const Home = () => (
  <div className="home-page">
    <div className="welcome-container">
      <h1>Welcome to CodeJury</h1>
      <p>
        CodeJury is an online judge system designed to help programmers test
        their coding skills. Solve problems, submit solutions, and improve your
        coding abilities with our extensive problem set.
      </p>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/signup">
        <button>Signup</button>
      </Link>
    </div>
  </div>
)

const ProblemWrapper = () => {
  const { id } = useParams()
  return <Problem problemId={id} />
}

const UserWrapper = () => {
  const { id } = useParams()
  return <UserProfile userId={id} />
}

export default App
