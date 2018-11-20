
let session = require("express-session");

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
    await Requests.addRequest("host", kerberos, diningHalls, intervals, date);

});


/**
 * Receive
 * Creates a receive request for a user
 * @name POST/api/requests/receive
 * @param {String} - user name
 * @returns {Request} - the request created
*/
router.post('/receive', async (req, res) => {
    let user = req.param.user;

});


module.exports = router;