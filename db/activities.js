/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions
const getAllActivities = async () => {
  try {
    const { rows } = await client.query(`
            SELECT * FROM activities;
        `);

    return rows;
  } catch (error) {
    throw error;
  }
};
const getActivityById = async (id) => {
  const {
    rows: [activity],
  } = await client.query(
    `
            SELECT * FROM activities
            WHERE id = $1;
        `,
    [id]
  );
  return activity;
};

async function getActivityByName(name) {
  const {
    rows: [activity],
  } = await client.query(
    `
            SELECT * FROM activities
            WHERE name = $1;
        `,
    [name]
  );

  return activity;
}

const createActivity = async ({ name, description }) => {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
            INSERT INTO activities (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `,
      [name, description]
    );

    return activity;
  } catch (error) {
    throw error;
  }
};

const updateActivity = async ({ id, ...fields }) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    UPDATE activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    return activity;
  } catch (error) {
    console.error(error);
  }
};

// don't try to update the id
// do update the name and description
// return the updated activity
module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  // attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
