const userSchema = require("../Models2/userSchema")
require("dotenv").config()

exports.getUserName = async (req, res) => {
  try {
    //get data
    const { email } = req.body

    //check if user is registered or not
    let registeredUser = await userSchema.findOne({ email })

    if (!registeredUser) {
      return res.status(401).json({
        success: false,
        message: `No user exist with email: ${email}`,
      })
    }

    const userName = registeredUser.fName + " " + registeredUser.lName

    res.status(200).json({
      success: true,
      userName: userName,
      message: "User name found",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "user with email not found, please try again later",
    })
  }
}

exports.getUserDetailsWithId = async (req, res) => {
  try {
    //get data
    const { id } = req.params

    //check if user is registered or not
    let registeredUser = await userSchema.findById(id)

    if (!registeredUser) {
      return res.status(401).json({
        success: false,
        message: `No user exist with id: ${id}`,
      })
    }

    res.status(200).json({
      success: true,
      data: registeredUser,
      message: "User found",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "user with id not found, please try again later",
    })
  }
}

exports.updateDetails = async (req, res) => {
  try {
    //get data
    const { id } = req.params

    const {
      fName,
      lName,
      email,
      DOB,
      about,
      organisation,
      phoneNumber,
      country,
      image,
    } = req.body

    const user = await userSchema.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user details
    user.fName = fName || user.fName
    user.lName = lName || user.lName
    user.email = email || user.email
    user.DOB = DOB || user.DOB
    user.about = about || user.about
    user.organisation = organisation || user.organisation
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.country = country || user.country
    user.image = image || user.image

    await user.save()

    res.status(200).json({
      success: true,
      data: user,
      message: "User deatils updated successfully",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "user with id not found, please try again later",
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find({ isVerified: true })
    res.status(200).json(users)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message })
  }
}
