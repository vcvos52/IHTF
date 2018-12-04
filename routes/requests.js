
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
    let kerberos = req.session.name;
    let diningHalls = req.body.diningHalls;
    let intervals = req.body.hours;
    let date = req.body.date;
    await Requests.addRequest("guest", kerberos, diningHalls, date, intervals);
    res.status(201).json("Receive request added. Check Upcoming Meals to see if you were matched").end();
});



/**
 * Check if user is signed into an account
 * @name GET/api/users/isSignedIn
 * @returns {200} success message
 * @throws {401} - if user is not logged in
*/
router.get('/getAction', async (req, res) => {
    if (!req.session.action){
        res.status(400).json("No action chosen").end();
        return;
    }
    else if (req.session.action === 'donate'){
        res.status(200).json("donate").end();
    }
    else if (req.session.action === 'receive'){
        res.status(200).json("receive").end();
    }
});


/**
 * Check if user is signed into an account
 * @name GET/api/users/isSignedIn
 * @returns {200} success message
 * @throws {401} - if user is not logged in
*/
router.post('/setAction/:action', async (req, res) => {
    req.session.action = req.params.action;
    res.status(200).end();
});

module.exports = router;
