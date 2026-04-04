const express = require('express');
const userRouter = express.Router();
const { query } = require('../helpers/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER - creates a new user in the database
userRouter.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // hash the password before saving (never save plain passwords!)
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role]
    );
    res.json({ message: 'User registered', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN - checks email/password and returns a token + user info
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];


    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // create a JWT token with user id and role inside
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    // send back token + user info so frontend can save it
    res.json({ 
      token,
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = { userRouter };