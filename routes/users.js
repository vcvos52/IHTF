const express = require('express');
const router = express.Router();

const Users = require('../Models/Users.js')
const Requests = require('../Models/Requests')

/**
 * Checks if user has logged in via OpenId connect by checking the session
 * If the user has, it then checks if the user exists in the db and, if not,
 * it creates an entry for the user
 * @name GET/api/users/session
 * @throws {403} - if user has not logged in yet
 */
router.get('/session', async (req, res) => {
    if (req.session.name === undefined) {
        res.status(403).json("User not logged in yet").end()
    } else {
        if (!(await Users.userExists(req.session.name))) {
            response = await Users.addUser(req.session.name);
            if (!response) {
                res.status(500).json("Error in adding kerberos to db").end()
            }
        }
        res.status(200).json("Used logged in correctly").end()
    }
})

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
    if (!(await Users.userExists(kerberos))) {
        res.status(403).json("This is not a valid user.").end();
        return;
    }
    req.session.name = kerberos;
    res.status(201).json(kerberos).end();
});

/**
 * Logout
 * Log out of a session
 * @name POST/api/users/logout
 * @param user {String} - the user name
 * @throws {401} - if user is already logged into an account
 * @throws {403} - if the username is from MIT
*/
router.put('/logout', async (req, res) => {
    req.session.name = null;
    res.status(201).json("You logged out. Congrats.").end();
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
router.get('/matches', async (req, res) => {
    let kerberos = req.session.name;
    // if the kerberos does not exist, return that
    if (!(await Users.userExists(kerberos))) {
        res.status(403).json("This is not a valid user.").end();
        return;
    }
    let matches = await Users.getMatches(kerberos);
    if (!(matches)) {
        res.status(404).json("This user is not matched.").end();
        return;
    }
    if (req.session.name !== kerberos) {
        res.status(403).json("You do not have permission.").end();
        return;
    }
    let matchData = await shapeDateForMatch(matches, req);
    res.status(201).json(matchData).end();
});

/**
 * Finds pending Requests for a given user
 * @name GET/api/users/requests
 * @param {String} - users name
 * @returns {List<Requests>} List of requests for a specific user
 * @throws {404} - No requests found
 * @throws {403} - user is not logged in
 */
router.get('/requests', async (req, res) => {
    let kerberos = req.session.name;
    // if the kerberos does not exist, return that
    if (!(await Users.userExists(kerberos))) {
        res.status(403).json("This is not a valid user.").end();
        return;
    }
    let requests = await Users.getRequests(kerberos);
    if (!(requests)) {
        res.status(404).json("This user does not have any requests").end();
        return;
    }
    if (req.session.name !== kerberos) {
        res.status(403).json("You do not have permission.").end();
        return;
    }
    let requestsData = await shapeDataForRequest(requests, req);
    res.status(201).json(requestsData).end();
})


/**
 * Takes in the data for a match, and reformats it to be more readable in the view
 * @param matches {List<JSON>} - [{id{Integer}: , time{datetime}: , host_id{Integer}: , guest_id{Integer}: , dining_hall_id{Integer}: }, ...]
 * @returns {List<JSON>} - [{role{String}: , otherPerson{String}: , diningHall{String}: , time{datetime}: }, ...]
 */
async function shapeDateForMatch(matches, req) {
    let data = [];
    for (let i = 0; i < matches.length; i++) {
        let row = matches[i];
        let newRow = {};
        // need to make sure the column names are correct
        if (row.guest_id === await Users.getId(req.session.name)) {
            newRow.role = "guest";
            newRow.otherPerson = await Users.getKerberos(row.host_id);
        } else if (row.host_id === await Users.getId(req.session.name)) {
            newRow.role = "host";
            newRow.otherPerson = await Users.getKerberos(row.guest_id);
        }

        newRow.day = row.time.toDateString();
        newRow.time = row.time.toLocaleTimeString();
        newRow.diningHall = await Requests.getDiningName(row.dining_hall_id);
        newRow.id = parseInt(row.id);
        data.push(newRow);
    }
    return data;
}

/**
 * Takes in the data for a match, and reformats it to be more readable in the view
 * @param matches {List<JSON>} - [{id{Integer}: , start_time{datetime}: , end_time{datetime}: , dining_hall_id{Integer}: }, ...]
 * @returns {object} - {id{Integer}: {day{string}:, intervals{list<interval>}: , diningHalls{List<dining_hall_id>}: }, ...]
 */
async function shapeDataForRequest(requests) {
    let data = {}
    let diningHalls = { 1: "Baker", 2: "Maseeh", 3: "Mccormick", 4: "Next", 5: "Simmons" }
    for (let i = 0; i < requests.length; i++) {
        let row = requests[i]
        let requestId = row.request_id
        // getting type of request
        let requestType = await Users.getRequestType(requestId)
        // initiating row if not already initialized in data
        if (!(requestId in data)) {
            data[requestId] = {}
            data[requestId].id = parseInt(requestId);
            data[requestId].intervals = []
            data[requestId].diningHalls = []
            data[requestId].day = row.start_time.substring(0, 11)
            if (requestType == 1) {
                data[requestId].type = 'host'
            } else {
                data[requestId].type = 'guest'
            }
        }
        // filling data
        let interval = row.start_time.substring(11) + "-" + row.end_time.substring(11)
        if (!(data[requestId].intervals.includes(interval))) {
            data[requestId].intervals.push(interval)
        }
        let diningHall = diningHalls[row.dining_hall_id]
        if (!(data[requestId].diningHalls.includes(diningHall))) {
            data[requestId].diningHalls.push(diningHall)
        }
    }
    return data;
}

module.exports = router;