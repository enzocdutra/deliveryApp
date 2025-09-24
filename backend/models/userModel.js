import pool from "../config/db.js";

export const createUser = async ({ username, password }) => {
  const result = await pool.query(
    "INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING id, username",
    [username, password]
  );
  return result.rows[0]; // Retorna { id, username }
};

export const getUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE username = $1", [username]);
  return result.rows[0]; // Retorna o usuário ou undefined
};