const client = require("./client");

const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  //Query method
  // Creating the user variable, and assigning it the results of the insert
  const {
    rows: [user],
  } = await client.query(
    `
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING *;
      `,
    [username, hashedPassword]
  );

  delete user.password;
  // });
  return user;
}

const getUser = async ({ username, password }) => {
  const user = await getUserByUsername(username);
  if (!user) {
    return;
  }
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    delete user.password;
    return user;
  }
};

const getUserById = async (id) => {
  const {
    rows: [user],
  } = await client.query(
    `
            SELECT * FROM users
            WHERE id = $1;
        `,
    [id]
  );

  delete user.password;
  return user;
};

const getUserByUsername = async (username) => {
  const {
    rows: [user],
  } = await client.query(
    `
            SELECT * FROM users
            WHERE username = $1;
        `,
    [username]
  );

  return user;
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
