# CodeJury: An Online Judge

CodeJury is a comprehensive platform built using the MERN stack (MongoDB, Express.js, React, Node.js) designed to evaluate and judge code submissions from users. It allows users to submit their solutions to various programming problems, which are then automatically tested against predefined test cases. The system provides instant feedback on the correctness and efficiency of the submitted code, supporting a dynamic and competitive programming environment.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Purpose](#purpose)
- [Features](#features)
- [Architecture](#architecture)
- [Usage](#usage)
- [License](#license)

## Technologies Used

#### Frontend: React, Axios, jwt-Decode,
<p>
<img src="https://www.patterns.dev/img/reactjs/react-logo@3x.svg" height="150" />
<img src="https://files.raycast.com/ae0ycnzbe4rs6h1vf7cfdcvt6zea" height="150" />
</p>

#### Backend: Node.js, Express, Mongoose

<p>
<img src="https://miro.medium.com/v2/resize:fit:1400/1*23BkSGzcN3cBxvTuf0zFfg.png" height="150"/>
<img src="https://miro.medium.com/v2/resize:fit:1400/1*rL8Buu7o6jnG-TYV1WubeQ.png" height="150"/>
</p>

#### Containerization && Database: Docker, MongoDB
<p>
<img src="https://bunnyacademy.b-cdn.net/what-is-docker.png" height="150" display="span"/>
<img src="https://miro.medium.com/v2/resize:fit:1400/0*rHiBrlitOsO_Dx1b.jpg" height="150" display="span"/>
</p>

#### Authentication && Verification-Mailer: JWT (JSON Web Token), NodeMailer
<p>
<img src="https://miro.medium.com/v2/resize:fit:800/0*WddOBoMIYbSPNGSD.png" height="150"/>
<img src="https://repository-images.githubusercontent.com/1272424/d1995000-0ab7-11ea-8ed3-04a082c36b0d" height="150"/>
</p>

#### Deployment: Docker, AWS EC2, ECR ,Vercel
<p>
<img src="https://yt3.googleusercontent.com/HRJKaJg70sqBrCNh7Tf2RSjXTb_5hCUn7Hht7mxUJMg77EWkihh55JklD-KhwAMhwY31ox5O=s900-c-k-c0x00ffffff-no-rj" height="150"  />
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnwKWbAmgEz-7DSGmt1kYkpSiOTEkdHJez7w&s" height="150"  />
</p>

## Installation

### CodeJury-Repo without Worker Server

#### Clone the repo:

```bash
git clone https://github.com/ranaprabal/Online-Judge.git
```

#### Install dependencies for Backend:

```bash
cd Online-Judge/server
npm i
```

#### Install dependencies for Frontend:

```bash
cd Online-Judge/client
npm i
```

## Environment Variables

### Create a .env file in the root of each server(backend) and add the following variables:

#### Backend

```javascript
DATABASE_URL = your_DB_URL
PORT = your_PORT
JWT_SECRET = your_JWT_SECRET
WORKER_SERVER_URL = your_WORKER_SERVER_URL //for remote execution
EMAIL = your_EMAIL_ADDRESS_FOR_Sending_MAIL
EMAIL_PASSWORD = your_EMAIL_APP_PASSWORD
CLIENT_URL = your_CLIENT_URL //to allow CORS
```

## Running the Project

#### Backend

##### Start the backend server:

```bash
cd Online-Judge/server
npm run dev
```

##### Start the frontend client:

```bash
cd Online-Judge/client
npm start
```

## Purpose

The primary purpose of the Online Judge System is to offer a seamless and efficient way for programmers to practice coding, improve their problem-solving skills, and prepare for competitive programming contests or technical interviews. It serves as an educational tool for both novice and experienced developers, providing a wide range of problems to solve, from basic to advanced levels.

## Features

- **JWT User Authentication**: Secure authentication using <bold>JSON Web Tokens</bold>. Users can register with an email ID, verify their account via a verification email sent using <bold>Nodemailer</bold>, and then log in to start using the platform.
- **User Roles**: Three-tier user system:
  - **Users**: Can solve programming problems and participate in competitions.
  - **Problem Setters**: Can create new problems.
  - **Admins**: Can create one vs. one competitions, edit problems, and manage users.
- **Instant Feedback**: Users can solve programming problems and receive instant verdicts on their submissions, helping them understand mistakes and improve their solutions quickly.
- **Automated Testing**: Submissions are automatically tested against a comprehensive set of test cases, ensuring the correctness and robustness of the solutions.
- **Sandboxing for Security**: User-submitted codes are executed in a sandboxed environment on a remote machine to ensure the security of the Online Judge System. The code is compiled only once and then executed over all test cases to minimize latency.
- **Diverse Problem Set**: The platform offers a rich collection of problems across various domains and difficulty levels, catering to different skill sets and learning objectives.
- **Competitive Programming Preparation**: It serves as an excellent preparation tool for competitive programming contests, allowing users to simulate contest environments and hone their skills.
- **One vs. One Competitions**: Users can compete against each other in real-time coding battles. Admins can create these competitions, and users can participate to test their skills in a competitive environment.

## One vs. One Competitions

The Online Judge System includes an exciting feature for one-on-one competitions, adding a competitive edge to coding practice. Admins can create these competitions, defining the problem set and rules. Users can then participate in these head-to-head battles to test their coding skills against other programmers in real-time.

- **Admin-Managed Competitions**: Admins can create competitions, choose problems, and assign scores to each problem.
- **Real-Time Coding Battles**: Users compete against each other by solving the same set of problems within a specified time limit.
- **Scoring Rules**: Once a problem is solved by one user, the other user can no longer score points for that problem. Only the first person to solve the problem gets the points assigned to it.
- **Real Time Scoring**: One vs One Competitions feature real time scoring in the competition, allowing user to keep track of their score.
- **Outcome Display**:At the end of the competition, the results are displayed on the competition page, showing the winner or if it’s a draw based on the user score.

By leveraging the Online Judge System and its one-on-one competition feature, users can systematically improve their coding abilities, benchmark their skills against a global community, and stay motivated through continuous learning and challenge.

## Architecture

<img src="https://github.com/ranaprabal/assets/blob/main/architecture.png" height="450" />

## Usage

### 1. User Registration and Login: Users can register and log in to the platform.

<p>
  
<img src="https://github.com/ranaprabal/assets/blob/main/home.png"  width="450"/>

<img src="https://github.com/ranaprabal/assets/blob/main/signup.png"  width="450"/>
</p>

### 2. Problems Related Pages: Problem Setters can create problems.
<p>
  
<img src="https://github.com/ranaprabal/assets/blob/main/allproblems.png"  width="450"/>

<img src="https://github.com/ranaprabal/assets/blob/main/createProblem.png"  width="450"/>
</p>

### 3. Code Submission: Users can submit their code for problems, which will be compiled and executed.
<p>
  
<img src="https://github.com/ranaprabal/assets/blob/main/problempage.png"  width="450"/>

<img src="https://github.com/ranaprabal/assets/blob/main/verdict.png"  width="450"/>
</p>

### 4. One vs One Competitions:.
<p>
  
<img src="https://github.com/ranaprabal/assets/blob/main/allcompetitions.png"  width="450"/>

<img src="https://github.com/ranaprabal/assets/blob/main/competitionPage.png"  width="450"/>
</p>

## LICENSE

This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.
