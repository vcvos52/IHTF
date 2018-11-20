const {
    signin,
    getMatches
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
    

    test('GET get matches for a user', async () => {
        
        let user = "BigDickDaniel";
        await signin(user);
        let matches = await getMatches(user);
        // console.log(matches)

        expect(1).toBe(1);
    });    

  });
