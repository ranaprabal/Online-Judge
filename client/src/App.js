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
import ProblemsTableWithEdit from "./components/ProblemTableWithEdit"
import CreateCompetitions from "./components/CreateCompetitions"
import EditProblem from "./components/EditProblem"
import CompetitionsTable from "./components/Competitions"
import Competition from "./components/LockOut1vs1"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/allProblems" element={<ProblemsTable />} />
          <Route path="/create-problem" element={<CreateProblem />} />
          <Route path="/problem/:id" element={<ProblemWrapper />} />
          <Route path="/edit-problem/:id" element={<EditProblem />} />
          <Route path="/competition/:id" element={<Competition />} />
          <Route path="/create-competitions" element={<CreateCompetitions />} />
          <Route
            path="/getProblemSubmissions/:problemId"
            element={<SubmissionsTable />}
          />
          <Route path="/profile/:userId" element={<UserWrapper />} />
          <Route path="/edit-problems" element={<ProblemsTableWithEdit />} />
          <Route path="/allCompetitions" element={<CompetitionsTable />} />
        </Routes>
      </div>
    </Router>
  )
}

const ConditionalNavbar = () => {
  const location = useLocation()
  const showNavbar =
    location.pathname === "/allProblems" ||
    location.pathname.startsWith("/problem") ||
    location.pathname.startsWith("/getProblemSubmissions") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/allCompetitions") ||
    location.pathname.startsWith("/edit-problems") ||
    location.pathname.startsWith("/competition")

  return showNavbar ? <Navbar /> : null
}

const Home = () => (
  <div className="home-page">
    <div className="welcome-container">
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
