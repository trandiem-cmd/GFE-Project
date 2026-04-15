const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const { auth } = require("../helpers/auth");

// GET current logged-in user profile
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT fullname, contact_email, contact_phone, location, about_you FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullname,
      contact_email,
      contact_phone,
      location,
      about_you
    } = req.body;

    const result = await db.query(
      `UPDATE users
       SET fullname = $1,
           contact_email = $2,
           contact_phone = $3,
           location = $4,
           about_you = $5
       WHERE id = $6
       RETURNING fullname, contact_email, contact_phone, location, about_you`,
      [fullname, contact_email, contact_phone, location, about_you, userId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});
module.exports = router;