// auth, isUser, isProblemSetter && isAdmin
const jwt = require("jsonwebtoken")
const User = require("../Models2/userSchema") // Adjust the path to your User model

// Middleware to verify JWT token and extract user info
const auth = async (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies.token // Using cookie-parser to access cookies
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed: No token provided" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id) // Fetch user from database

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Invalid token" })
    }

    next() // Proceed to next middleware or route handler
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Authentication failed", error: err.message })
  }
}

// Middleware to check if the user is a regular user
const isUser = (req, res, next) => {
  if (req.user && req.user.role === "User") {
    return next()
  }
  return res.status(403).json({ message: "Access denied: Requires User role" })
}

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next()
  }
  return res.status(403).json({ message: "Access denied: Requires Admin role" })
}

// Middleware to check if the user is a problem setter
const isProblemSetter = (req, res, next) => {
  if (req.user && req.user.role === "Problem Setter") {
    return next()
  }
  return res
    .status(403)
    .json({ message: "Access denied: Requires Problem Setter role" })
}

module.exports = {
  auth,
  isUser,
  isAdmin,
  isProblemSetter,
}
