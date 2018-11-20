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
        let matches;
        let user = "BigDickDaniel";
        await signin(user);
        await getMatches(user).then(response => {
            matches = response.data;
        });
        expect(matches).toBe([{"role":"host","otherPerson":"DannysSugarBaby","time":"2018-11-19T05:00:00.000Z","dining_hall_id":1}]);
    });    

  });
