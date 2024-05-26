//Constructs file paths for storing and accessing code files in a platform-independent manner
const path = require("path")

//for file related stuff like writing,storing and removing files
const fs = require("fs")

//for generating unique ids for naming files
const { v4: uuid } = require("uuid")

const dirCodes = path.join(__dirname, "codes")

// if codes directory does not exist
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true })
}

const generateFile = async (format, code) => {
  //generate unique id for the file name
  // const jobId = uuid()
  const jobId = "Main"

  //generate unique file name
  const fileName = `${jobId}.${format}`

  // generate file path
  const filePath = await path.join(dirCodes, fileName)

  //write the code into the file
  await fs.writeFileSync(filePath, code)

  return filePath
}

module.exports = { generateFile }
