let session = require("express-session");

const express = require('express');

const router = express.Router();

const axios = require('axios');

const Users = require('../Models/Users.js')


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
    let kerberos = req.params.user;
    // if the kerberos does not exist, return that
    if (!(await Users.userExists(kerberos))){
        res.status(403).json("This is not a valid user.").end();
        return;
    }
    req.session.name = kerberos;
    res.status(201).json(kerberos).end();

});

/**
 * Find Matches
 * Finds all current matches for a given user
 * @name GET/api/users/matches
 * @param {String} - users name
 * @returns {List<Matches>} List of matches for a specific user
 * @throws {404} - No matches found
 * @throws {403} - user is not logged in
*/
router.get('/matches/:user', async (req, res) => {
    let kerberos = req.params.user;
    // if the kerberos does not exist, return that
    if (!(await Users.userExists(kerberos))){
        res.status(403).json("This is not a valid user.").end();
        return;
    }
    let matches = await Users.getMatches(kerberos);
    if (!(matches)){
        res.status(404).json("This user is not matched.").end();
        return;
    }
    if (req.session.name !== kerberos){
        res.status(403).json("You do not have permission to edit this freet.").end();
        return;
    }
    let matchData = await shapeDate(matches, req);
    console.log(matchData);
    res.status(201).json(matchData).end();

});


/**
 * Takes in the data, and reformats it to be more readable in the view
 * @param matches {List<JSON>} - [{id{Integer}: , time{datetime}: , host_id{Integer}: , guest_id{Integer}: , dining_hall_id{Integer}: }, ...]
 * @returns {List<JSON>} - [{role{String}: , otherPerson{String}: , time{Integer}: , dining_hall_id{datetime}: }, ...]
 */
async function shapeDate(matches, req){
    let data = []
    for (let i = 0; i < matches.length; i++){
        let row = matches[i];
        let newRow = {};
        // need to make sure the column names are correct
        if (row["guest_id"] === await Users.getId(req.session.name)){
            newRow["role"] = "guest";
            newRow["otherPersonName"] = await Users.getKerberos(row["host_id"]);
        } else if (row["host_id"] === await Users.getId(req.session.name)){
            newRow["role"] = "host";
            newRow["otherPerson"] = await Users.getKerberos(row["guest_id"]);
        }
        newRow["time"] = row["time"];
        newRow["dining_hall_id"] = row["dining_hall_id"];
        data.push(newRow);
    }
    return data;
}


module.exports = router;