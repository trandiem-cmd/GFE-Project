const express = require('express');
const { query } = require('../helpers/db.js');
const { auth } = require("../helpers/auth.js");
const jobRouter = express.Router();
jobRouter.post("/post",auth,async(req,res) => {
    try{
        const client_id = req.user.id;
        const sql = "insert into jobposts (client_id, service_type, service_title, service_description, service_schedule, service_frequency, service_location, service_pay_rate) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *"
        const result = await query(sql,[client_id, req.body.service_type, req.body.service_title, req.body.service_description, req.body.service_schedule, req.body.service_frequency, req.body.service_location,req.body.service_pay_rate])
        res.status(200).json(result.rows[0]) 
    } catch (error) {
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})
jobRouter.get("/dashboard",auth,async(req,res)=>{
    try{
        const client_id = req.user.id;
        const sql = "SELECT service_type, service_title, service_description, service_schedule, service_frequency, service_location, service_pay_rate FROM jobposts WHERE client_id = $1"
        const result = await query(sql,[client_id])
        res.status(200).json(result.rows) 
    } catch (error) {
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})
module.exports = {jobRouter};