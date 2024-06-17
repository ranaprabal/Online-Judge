const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

const compileCpp = (filePath) => {
  // create a output folder
  const outputPath = path.join(__dirname, "outputs")

  // check if output folder exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // take the uuid name
  const jobId = path.basename(filePath).split(".")[0]

  //create output path
  const outPath = path.join(outputPath, `${jobId}.out`)

  // console.log(input)

  // const command = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`
  //return promise based on the output
  return new Promise((resolve, reject) => {
    exec(`g++ ${filePath} -o ${outPath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr })
      stderr && reject(stderr)
      resolve(stdout)
    })
  })
}

const compilePy = (filePath, input) => {
  //return promise based on the output
  return new Promise((resolve, reject) => {
    exec(
      input ? `echo ${input} | python3 ${filePath}` : `python3 ${filePath}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr })
        stderr && reject(stderr)
        resolve(stdout)

        fs.unlink(filePath, (err) => {
          if (err) console.error(`Error deleting file: ${filePath}`, err)
        })
      }
    )
  })
}

const compileJava = (filePath, input) => {
  // create a output folder
  const outputPath = path.join(__dirname, "outputs")

  // check if output folder exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // take the uuid name
  const jobId = path.basename(filePath).split(".")[0]

  //create output path
  const outPath = path.join(outputPath, jobId)
  const deletingPath = outPath + ".class"

  //return promise based on the output
  return new Promise((resolve, reject) => {
    exec(
      input
        ? `javac ${filePath} -d ${outputPath} && echo ${input} | java -cp ${outputPath} ${jobId}`
        : `javac ${filePath} -d ${outputPath} && java -cp ${outputPath} ${jobId}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr })
        stderr && reject(stderr)
        resolve(stdout)
        if (!(error || stderr)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file: ${filePath}`, err)
          })
          fs.unlink(deletingPath, (err) => {
            if (err) console.error(`Error deleting file: ${deletingPath}`, err)
          })
        } else {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file: ${filePath}`, err)
          })
        }
      }
    )
  })
}

module.exports = { compileCpp, compilePy, compileJava }
