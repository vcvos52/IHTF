const database = require('../database');

const Users = require('./Users');

class Requests {
  static async addRequest(type, kerberos, locations, date, intervals) {
    // TODO: check if there is outstanding request by same user at same time
    const user_id = Users.getId(kerberos);
    const insert = `insert into request (user_id, type) values (${user_id}, '${type}');`;
    const response = await database.query(insert);
    const request_id = response[0].id;
    intervals.forEach(async function(interval) {
      const startTime = date+interval[0]+":00";
      const endTime = date+interval[1]+":00";
      const insertInterval = `insert into interval (request_id, start_time, end_time) values (${request_id}, ${startTime}, ${endTime});`;
      await database.query(insertInterval);
    });
    locations.forEach(async function(location) {
      const dining_hall_id = getDiningId(location);
      const insertLocation = `insert into location (request_id, dining_hall_id), values (${request_id}, ${dining_hall_id});`;
      await database.query(insertLocation);
    });
  }

  static async requestExists(kerberos, type) {
    const id = Users.getId(kerberos);
    if (id) {
      const sql = `select * from request where user_id=${id} and type='${type}';`;
      const response = await database.query(sql);
      if (response) {
        return true;
      }
      return false;
    }
    return false;
  }

  static async getDiningId(diningName) {
    const sql = `select * from dining_hall where name='${diningName}';`;
    const response = await database.query(sql);
    return response[0].id;
  }

  static async getDiningName(diningId) {
    const sql = `select * from dining_hall where id='${diningId}';`;
    const response = await database.query(sql);
    return response[0].name;
  }

  static async match(requestId) {
    const requstQuery = `select * from request where id=${requestId};`;
  }
}
