
let session = require("express-session");

const express = require('express');

const router = express.Router();

const axios = require('axios');

/**
 * Donate
 * Creates a donate request for a user
 * @name POST/api/requests/donate/:user
 * @param {String} - user name
 * @returns {Request} - the request created
*/
router.post('/donate/:user', async (req, res) => {
    let user = req.param.user;

});


/**
 * Receive
 * Creates a receive request for a user
 * @name POST/api/requests/receive/:user
 * @param {String} - user name
 * @returns {Request} - the request created
*/
router.post('/receive/:user', async (req, res) => {
    let user = req.param.user;

});


module.exports = router;