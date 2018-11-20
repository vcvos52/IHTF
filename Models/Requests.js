const database = require('../database');

const Users = require('../Users');

class Requests {


  static async addRequest(type, kerberos, locations, intervals) {
    const id = Users.getId(kerberos);
    if (requestExists(kerberos, type)) {
      // outstanding request of same type already exists
      return false;
    }
    // request does not exist already
    else {
      const insert = `insert into request (user_id, type) values (${id}, ${type});`;
      const response = await database.query(insert);
      const request_id = response[0].id;
      intervals.forEach(function(interval) {
        const startTime = interval[0];
        const endTime = interval[1];
        const insertInterval = `insert into interval (request_id, start_time, end_time) values (${request_id}, ${startTime}, ${endTime});`;
        await database.query(insertInterval);
      });
      locations.forEach(function(location) {
        const location_id = getLocationId(location);
        const insertLocation = `insert into location (request_id, dining_hall_id), values (${request_id}, ${location_id});`;
        await database.query(insertLocation);
      });
    }
  }

  static async requestExists(kerberos, type) {
    const id = Users.getId(kerberos);
    if (id) {
      const sql = `select * from request where user_id=${id} and type=${type};`;
      const response = await database.query(sql);
      if (response) {
        return true;
      }
      return false;
    }
    return false;
  }

  static async getLocationId(location) {
    const sql = `select * from dining_hall where name='${location}';`;
    const response = await database.query(sql);
    return response[0].id;
  }

  static async match(requestId) {

  }
}

module.exports = Requests;