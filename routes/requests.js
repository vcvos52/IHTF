
// let session = require("express-session");

const express = require('express');

const router = express.Router();

const axios = require('axios');

const Requests = require('../Models/Requests.js');

/**
 * Donate
 * Creates a donate request for a user
 * @name POST/api/requests/donate
 * @param {String} - user name
 * @returns {Request} - the request created
*/
router.post('/donate', async (req, res) => {
    let kerberos = req.session.name;
    let diningHalls = req.body.diningHalls;
    let intervals = req.body.hours;
    let date = req.body.date;
    await Requests.addRequest("host", kerberos, diningHalls, date, intervals);
    res.status(201).json("Donation request added. Check Upcoming Meals to see if you were matched").end();

});


/**
 * Receive
 * Creates a receive request for a user
 * @name POST/api/requests/receive
 * @param {String} - user name
 * @returns {Request} - the request created
*/
router.post('/receive', async (req, res) => {
    console.log("PROCESSING REQUEST");
    console.log("body", req.body);
    let kerberos = req.session.name;
    let diningHalls = req.body.diningHalls;
    let intervals = req.body.hours;
    let date = req.body.date;
    await Requests.addRequest("guest", kerberos, diningHalls, date, intervals);
    res.status(201).json({success: "Reception request added"}).end();
});


module.exports = router;
