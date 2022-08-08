// //Starter code
// // create the express server here
// require("dotenv").config();
// const express = require("express");
// const server = express();

// const client = require("./db/client");

// const bodyParser = require("body-parser");
// const morgan = require("morgan");
// const cors = require("cors");

// server.use(cors());
// server.use(morgan("dev"));
// server.use(bodyParser.json());

// const apiRouter = require("./api");
// server.use("/api", apiRouter);

// server.get("/", async (req, res, next) => {
//   res.send("Welcome to Fitness Trac.kr");
// });

// // NOTE: Kill other processes using port 300 first.
// //             Necessary for tests to work, because each test runs a different instance of the app.
// // source: https://stackoverflow.com/a/20643568
// // const { execSync } = require("child_process");
// // const stdout = execSync("npx kill-port 3000");
// // console.log("stdout: ", stdout);

// const { PORT = 3010 } = process.env;
// server.listen(PORT, () => {
//   console.log(`listening at http://localhost:${PORT}`);
//   client.connect();
// });

// module.exports = server;

require("dotenv").config();
const express = require("express");
const app = express();

// Setup your Middleware and API Router here

const morgan = require("morgan");
app.use(morgan("dev"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const apiRouter = require("./api");
app.use("/api", apiRouter);

apiRouter.use("/unknown", (req, res) => {
  res.status(404).send({ message: "Page not found." });
});

apiRouter.use(function (error, req, res) {
  res.status(error.status || 403).send({
    error: error.message,
    message: error.message,
    name: error.name,
  });
});

module.exports = app;
