const request = require('supertest-session');

const app = require('../app');

const requestApp = request(app);

/**
 * @param {String} user
 */
async function signin(user) {
  return requestApp
    .post(`/api/users/${user}`)
}

/**
 * @param {String} user
 */
async function getMatches(user) {
    return requestApp
      .get(`/api/users/matches/${user}`)
  }

module.exports = {
  signin,
  getMatches
};
