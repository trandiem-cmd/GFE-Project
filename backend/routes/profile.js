const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const { auth } = require("../helpers/auth");
const bcrypt = require("bcrypt");

// CHANGE PASSWORD
router.put("/change-password", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    // get user
    const result = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];

    // check current password
    const isMatch = await bcrypt.compare(current_password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong current password" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await db.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Password update failed" });
  }
});
// GET current logged-in user profile
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT fullname, contact_email, contact_phone, location FROM users WHERE id = $1",
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
      location
    } = req.body;

    const result = await db.query(
      `UPDATE users 
       SET fullname = $1,
           contact_email = $2,
           contact_phone = $3,
           location = $4,
       WHERE id = $5
       RETURNING fullname, contact_email, contact_phone, location`,
      [fullname, contact_email, contact_phone, location, userId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});
// DELETE user account
router.delete("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      "DELETE FROM users WHERE id = $1",
      [userId]
    );

    res.json({ message: "Account deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});
module.exports = router;