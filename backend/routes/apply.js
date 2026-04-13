// JOBSEEKER APPLY FOR JOBS
const express = require('express');
const { query } = require('../helpers/db.js');
const { auth } = require("../helpers/auth.js");
const multer = require('multer');
const applyRouter = express.Router();
const upload = multer({ dest: "uploads/" });

applyRouter.post("/apply",auth,upload.single("cv"),async(req,res) => {
    try{
        const { job_id, applyCoverLetter} = req.body;
        const jobseeker_id = req.user.id;
        const cvPath = req.file ? req.file.path : null;
        if (!job_id) {
            return res.status(400).json({ error: "job_id is required" });
        }
        const sql = "INSERT INTO applications (job_id, jobseeker_id, cover_letter, cv) VALUES ($1, $2, $3, $4) returning *"
        const result = await query(sql,[job_id, jobseeker_id, applyCoverLetter, cvPath])
        res.status(200).json(result.rows[0]) 
    } catch (error) {
        res.statusMessage = error
        res.status(500).json({error: error})
    }
});
// GET applications by user + filter status
applyRouter.get("/search", auth, async (req, res) => {
    try {
        const jobseeker_id = req.user.id;
        const { status } = req.query;

        let sql = `
            SELECT 
                a.id,
                a.status,
                a.cover_letter,
                a.cv,
                a.created_at,

                j.id as job_id,
                j.service_title,
                j.service_schedule,
                j.service_location,
                j.service_pay_rate,
                j.service_description

            FROM applications a
            JOIN jobposts j ON a.job_id = j.id
            WHERE a.jobseeker_id = $1
        `;

        const params = [jobseeker_id];

        // if filter status
        if (status && status !== "all") {
            sql += ` AND a.status = $2`;
            params.push(status);
        }

        sql += ` ORDER BY a.created_at DESC`;

        const result = await query(sql, params);

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = {applyRouter};