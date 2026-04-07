const express = require('express');
const userRouter = express.Router();
const { query } = require('../helpers/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { auth } = require("../helpers/auth.js");

// LOGIN
userRouter.post('/login', async (req, res) => {
  try {
    const sql = "select * from users where email=$1 and role=$2"
    const result = await query(sql, [req.body.email, req.body.role])
    if (result.rowCount === 1) {
      bcrypt.compare(req.body.password, result.rows[0].password, (err, bcrypt_res) => {
        if (!err) {
          if (bcrypt_res === true) {
            const user = result.rows[0];
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY)
            res.status(200).json({
              id: user.id,
              email: user.email,
              role: user.role,
              token: token,
              has_profile: user.has_profile
            })
          } else {
            res.status(401).json({ error: 'Invalid login' })
          }
        } else {
          res.status(500).json({ error: err })
        }
      })
    } else {
      res.status(401).json({ error: 'Invalid login' })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
});

// REGISTER
userRouter.post("/register", async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (!err) {
      try {
        const sql = "insert into users (email, password, role, has_profile) values ($1,$2,$3,false) returning *"
        const result = await query(sql, [req.body.email, hash, req.body.role])
        res.status(200).json({ id: result.rows[0].id })
      } catch (error) {
        res.status(500).json({ error: error })
      }
    } else {
      res.status(500).json({ error: err })
    }
  })
});

// UPDATE PROFILE
userRouter.put("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = "update users set has_profile = true, fullname=$1, contact_email=$2, contact_phone=$3, location=$4, services=$5, about_you=$6, experience=$7, hourly_rate=$8, about_experience=$9, skills=$10 where id=$11 returning *"
    const result = await query(sql, [req.body.fullname, req.body.contact_email, req.body.contact_phone, req.body.location, req.body.services, req.body.about_you, req.body.experience, req.body.hourly_rate, req.body.about_experience, req.body.skills, userId])
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error })
  }
});

module.exports = { userRouter };