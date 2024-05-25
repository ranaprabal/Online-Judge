const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

const outputPath = path.join(__dirname, "outputs")

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true })
}

const executeCpp = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0]
  const outPath = path.join(outputPath, `${jobId}.out`)

  // const command = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ${jobId}.out`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr })
        stderr && reject(stderr)
        resolve(stdout)
        if (!(error || stderr)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file: ${filePath}`, err)
          })
          fs.unlink(outPath, (err) => {
            if (err) console.error(`Error deleting file: ${outPath}`, err)
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

module.exports = { executeCpp }
