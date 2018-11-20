const database = require('../database');

const Users = require('./Users');

class Requests {
  static async addRequest(type, kerberos, locations, date, intervals) {
    // TODO: check if there is outstanding request by same user at same time
    const user_id = Users.getId(kerberos);
    const insert = `insert into request (user_id, type) values (${user_id}, '${type}');`;
    const response = await database.query(insert);
    const sqlGetRequestID = `select id from request where user_id=${user_id} and type='${type}';`;
    const request_id = sqlGetRequestId[0].id;
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
    const requestQuery = `select * from request where id=${requestId};`;
    const response = await database.query(requestQuery);
    const user = response[0].user_id;
    const type = response[0].type;
    const intervalsReq = `select * from interval where request_id=${requestId};`;
    const locationsReq = `select * from location where request_id=${requestId};`;

    const allIntervals = `select * from interval where not(request_id=${requestId});`;

    const matchFound = true;
    let chosenDate = "";
    const narrowedRequests = [];
    intervalsReq.forEach(async function(intervalReq) {
      intervalAlls.forEach(async function(interval) {
        const reqStartTime = new Date(intervalReq.start_time);
        const reqEndTime = new Date(intervalReq.end_time);
        const intervalStartTime = new Date(interval.start_time);
        const intervalEndTime = new Date(interval.end_time);
        const intervalReqId = interval.request_id;
        const sqlType = `select * from request where request_id=${intervalReqId} and not(type=${type});`;
        const responseType = await database.query(sqlType);
        if (reqStartTime <= intervalEndTime && reqStartTime >= intervalStartTime && responseType!=undefined) {
          chosenDate = reqStartTime;
          narrowedRequests.push(interval.request_id);
        }
        else if (reqEndTime <= intervalEndTime && reqEndTime >= intervalStartTime && responseType!=undefined) {
          chosenDate = reqEndTime;
          narrowedRequests.push(interval.request_id);
        }
        else {
          // no overlap for interval
        }
      });
    });

    locationsReq.forEach(async function(location) {
      narrowedRequests.forEach(async function(narrowedRequest) {
        const sqlLocationsNarrowed = `select * from location where request_id=${narrowedRequest};`;
        sqlLocationsNarrowed.forEach(async function(locationForNarrowed) {

        });
      });
    });

  }
}
