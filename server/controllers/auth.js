const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const userSchema = require("../Models2/userSchema")
require("dotenv").config()

//signup route handler

exports.signup = async (req, res) => {
  try {
    //get data
    const { fName, lName, email, password, accountType } = req.body

    //check if any entry is blank
    if (!(fName && lName && email && password && accountType)) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      })
    }

    //validating the email
    //will do later

    //check if user already registered
    const registeredUser = await userSchema.findOne({ email })

    if (registeredUser) {
      return res.status(400).json({
        success: false,
        message: `user with email: ${email} already exist`,
      })
    }

    //secure password or hash the password
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 10)
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      })
    }

    const verificationToken = crypto.randomBytes(16).toString("hex")

    //create user in DB
    const user = await userSchema.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      accountType,
      verificationToken,
    })

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Account Verification",
      text: `Please verify your account by clicking the link: \nhttp://${req.headers.host}/api/verify-email?token=${verificationToken}`,
    }
    console.log("mail sent")

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err)
        return res
          .status(500)
          .json({ message: "Technical issue! Please try again later." })
      }
      return res.status(200).json({
        success: true,
        message:
          "User created successfully. A verification email has been sent to " +
          user.email +
          ".",
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "user creation failed, please try again later",
    })
  }
}

exports.login = async (req, res) => {
  try {
    //get data
    const { email, password } = req.body

    //check if all fields are filled
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      })
    }

    //check if user is registered or not
    let registeredUser = await userSchema.findOne({ email })

    if (!registeredUser) {
      return res.status(401).json({
        success: false,
        message: `No user exist with email: ${email}`,
      })
    }

    if (!registeredUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email to log in",
      })
    }

    const payload = {
      email: registeredUser.email,
      id: registeredUser._id,
      accountType: registeredUser.accountType,
    }

    //verify password & generate JWT
    if (await bcrypt.compare(password, registeredUser.password)) {
      //password matched
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      })

      // adding token to the userAccount
      registeredUser = registeredUser.toObject()
      registeredUser.token = token
      registeredUser.password = undefined

      const options = {
        expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      //   storing it in cookies
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        registeredUser,
        message: "user Logged in successfully",
      })
      // console.log("cookie set:", res.getHeaders()["set-cookie"])
    } else {
      //password is not matched
      return res
        .status(403)
        .json({ success: false, message: "password is not correct" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "user login failed, please try again later",
    })
  }
}

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query
    console.log(token)

    const user = await userSchema.findOne({ verificationToken: token })

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Your account has been successfully verified",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Email verification failed, please try again later",
    })
  }
}
