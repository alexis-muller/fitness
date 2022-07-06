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

// async function getActivitiesToRoutines(routines) {}

// select and return an array of all activities
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

// return the new activity
const updateActivity = async ({ id, name, description }) => {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
            UPDATE activities
            SET name =$1, description = $2
            WHERE id = $3
            RETURNING *;
        `,
      [name, description, id]
    );

    return activity;
  } catch (error) {
    throw error;
  }
};

// don't try to update the id
// do update the name and description
// return the updated activity
module.exports = {
  getAllActivities,
  getActivityById,
  // getActivityByName,
  // attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
