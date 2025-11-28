const db = require('../db');

const createUser = async (username, email, hashedPassword) => {
  const [result] = await db.query(
    'INSERT INTO login (usuario, email, contraseña) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return result.insertId;
};

const getUserByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM login WHERE usuario = ?', [username]);
  return rows[0];
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM login WHERE email = ?', [email]);
  return rows[0];
};

module.exports = { createUser, getUserByUsername, getUserByEmail };
