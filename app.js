// create the express server here
require("dotenv").config();
const express = require("express");
const server = express();

const client = require("./db/client");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

server.use(cors());
server.use(morgan("dev"));
server.use(bodyParser.json());

const apiRouter = require("./api");
server.use("/api", apiRouter);

server.get("/", async (req, res, next) => {
  res.send("Welcome to Fitness Trac.kr");
});

// NOTE: Kill other processes using port 300 first.
//             Necessary for tests to work, because each test runs a different instance of the app.
// source: https://stackoverflow.com/a/20643568
// const { execSync } = require("child_process");
// const stdout = execSync("npx kill-port 3000");
// console.log("stdout: ", stdout);

const { PORT = 3000 } = process.env;
server.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
  client.connect();
});

module.exports = server;
