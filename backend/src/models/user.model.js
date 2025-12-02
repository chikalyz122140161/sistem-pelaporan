import pool from "../config/db.js";

export const createUser = async (name, email, password_hash, role = "USER") => {
  const query = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role
  `;
  const result = await pool.query(query, [name, email, password_hash, role]);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};
