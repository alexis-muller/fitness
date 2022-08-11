const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const {
  getUserByUsername,
  createUser,
  getPublicRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utils");

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send({
      name: "MissingCredentialsError",
      message: "Please enter both username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.send({ user, token, message: "you're logged in!" });
    } else {
      return res.send({
        name: "IncorrectCredentialsError",
        message: "Username or Password incorrect",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const userObj = await getUserByUsername(username);

    if (userObj) {
      return res.send({
        name: "UserExistsError",
        error: "User already exists",
        message: `User ${username} is already taken.`,
      });
    } else if (password.length < 8) {
      return res.send({
        name: "PasswordLengthError",
        error: "Password too short",
        message: "Password Too Short!",
      });
    } else if (!username || !password) {
      next({
        name: "MissingCredentials",
        message: "You need a username and password to register",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });

      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET
      );
      return res.send({
        user,
        message: "thank you for signing up",
        token,
      });
    }
  } catch (error) {
    // next(error);
    console.error(error);
  }
});

// GET /api/users/me
router.get("/me", requireUser, async (req, res) => {
  try {
    return res.send(req.user);
  } catch (error) {
    console.error(error);
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res) => {
  const { username } = req.params;
  try {
    const routines = await getPublicRoutinesByUser({ username });
    return res.send(routines);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
