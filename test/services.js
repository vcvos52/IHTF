const request = require('supertest-session');

const app = require('../app');

const requestApp = request(app);

/**
 * @param {String} user
 */
async function signin(user) {
  return requestApp
    .post(`/api/users/${user}`);
}

/**
 * @param {String} user
 */
async function getMatches(user) {
    return requestApp
      .get(`/api/users/matches/`);
  }

/**
 * @param {String} user
 */
async function makeRequests(data) {
    console.log("in make request", data);
    return requestApp
      .post('/api/requests/receive/', data);
}

  /**
 * @param {String} user
 */
async function makeDonation(data) {
    return requestApp
      .post(`/api/requests/donate/`, data);
  }

module.exports = {
  signin,
  getMatches,
  makeRequests,
  makeDonation
};
