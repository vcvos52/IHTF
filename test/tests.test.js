const {
    signin,
    getMatches,
    makeRequests,
    makeDonation
} = require("./services");

const {
    randomUser,
} = require('./utils');

const database = require('../database.js');

const axios = require('axios');


describe('Test /users', () => {

    // beforeEach(async() => {
    //     await database.clearTables();
    // });

    // afterEach(async() => {
    //     await database.clearTables();
    // });


    // test('GET get matches for a user', async () => {
    //     let user = "Daniel";
    //     await signin(user);
    //     let matches = await getMatches(user);
    //     expect(JSON.parse(matches.text)).toEqual([{"role":"host","otherPerson":"Alice","time":"0000-00-00 00:00:00","diningHall":"House"}]);
    // });

    test('POST receive request', async () => {
        let kerberos = "Alice"
        let halls = ["House"];
        let date = "2018-11-20";
        let intervals = [("17:00", "18:00"), ("19:00", "20:00")];
        // const data = { diningHall: halls, date: date, hours: intervals };
        const data = { username: "husayn" };
        console.log("data", data);
        await signin(kerberos);
        let req = await makeRequests(data);
    });

    // test('POST donate request', async () => {
    //     let kerberos = "Daniel";
    //     let halls = ["House"];
    //     let date = "2018-11-20";
    //     let intervals = [["16:00", "17:00"], ["15:00", "16:00"]]
    //     let data = {diningHall: halls, date: date, hours:intervals}

    //     await signin(kerberos);

    //     let req = await makeDonation(data);
    //     console.log(req);

    // });

  });
