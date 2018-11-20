
let session = require("express-session");

const express = require('express');

const router = express.Router();

const axios = require('axios');


/**
 * Authenticate
 * Create a user account and then log into it, or log into existing account
 * @name POST/api/users/:user
 * @param user {String} - the user name
 * @returns {Users} a Users object representing the new user
 * @throws {401} - if user is already logged into an account
 * @throws {403} - if the username is from MIT
*/
router.post('/:user', async (req, res) => {
    let user = req.param.user;

});

/**
 * Find Matches
 * Finds all current matches for a given user
 * @name GET/api/users/matches
 * @param {String} - users name
 * @returns {List<Matches>} List of matches for a specific user
 * @throws {404} - No matches found
*/
router.get('/matches/:user', async (req, res) => {
    let user = req.param.user;

});


module.exports = router;