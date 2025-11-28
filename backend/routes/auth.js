const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername, getUserByEmail } = require('../models/user');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  if (await getUserByUsername(username) || await getUserByEmail(email)) {
    return res.status(400).json({ error: 'Usuario o email ya registrado' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await createUser(username, email, hashedPassword);
  return res.status(201).json({ id: userId, username, email });
});

// Login
router.post('/login', async (req, res) => {
  // Aceptar tanto { identifier, password } como { username, password } o { email, password }
  const { identifier, username, email, password } = req.body;
  const loginField = identifier || username || email;
  if (!loginField || !password) {
    return res.status(400).json({ error: 'Identificador y contraseña son obligatorios' });
  }
  let user = await getUserByUsername(loginField);
  if (!user) {
    user = await getUserByEmail(loginField);
  }
  if (!user || !(await bcrypt.compare(password, user.contraseña))) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const token = jwt.sign({ id: user.id, username: user.usuario }, SECRET, { expiresIn: '1h' });
  return res.json({ token });
});

module.exports = router;
