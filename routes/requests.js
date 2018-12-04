
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
 * Delete a request
 * Deletes a request previously made by a user
 * @name DELETE/api/request/deleteRequest
 * @param {int} request id
 */
router.delete('/deleteRequest/:id', async (req, res) => {
    let response = await Requests.deleteRequest(req.params.id);
    if (response) {
        res.status(201).json("Request successfully deleted").end();
    } else {
        res.status(404).json("There was no request with this id").end();
    }
})

/**
 * Delete a request
 * Deletes a request previously made by a user
 * @name DELETE/api/request/deleteRequest
 * @param {int} request id
 */
router.delete('/deleteMeal/:id', async (req, res) => {
    let response = await Requests.deleteMeal(req.params.id);
    if (response) {
        res.status(201).json("Meal successfully deleted").end();
    } else {
        res.status(404).json("There was no request with this id").end();
    }
})

module.exports = router;
