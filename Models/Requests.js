const database = require('../database');

const Users = require('./Users');

class Requests {
  static async addRequest(type, kerberos, locations, date, intervals) {
    // TODO: check if there is outstanding request by same user at same time
    const userId = await Users.getId(kerberos);
    const insert = `insert into request (user_id, type) values (${userId}, '${type}');`;
    const response = await database.query(insert);
    const sqlGetRequestID = `select id from request where user_id=${userId} and type='${type}';`;
    const requestId = sqlGetRequestId[0].id;
    intervals.forEach(async function(interval) {
      const startTime = date+interval[0]+":00";
      const endTime = date+interval[1]+":00";
      const insertInterval = `insert into interval (request_id, start_time, end_time) values (${requestId}, ${startTime}, ${endTime});`;
      await database.query(insertInterval);
    });
    locations.forEach(async function(location) {
      const diningHallId = getDiningId(location);
      const insertLocation = `insert into location (request_id, dining_hall_id), values (${requestId}, ${diningHallId});`;
      await database.query(insertLocation);
    });
    return match(requestId);
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

    let chosenDate = "";
    let chosenLocationId = -1;
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
        const sqlLocationsFromSelected = `select * from location where request_id=${intervalReqId};`;
        const locationsFromSelected = await database.query(sqlLocationsFromSelected);
        if (reqStartTime <= intervalEndTime && reqStartTime >= intervalStartTime && responseType!=undefined) {
          chosenDate = reqStartTime;
          locationsReq.forEach(async function(locationReq) {
            locationsFromSelected.forEach(async function(locationSelect) {
              if (locationReq.dining_hall_id == locationSelect.dining_hall_id) {
                chosenLocationId = locationReq.dining_hall_id;
              }
            })
          })
        }
        else if (reqEndTime <= intervalEndTime && reqEndTime >= intervalStartTime && responseType!=undefined) {
          chosenDate = reqEndTime;
          locationsReq.forEach(async function(locationReq) {
            locationsFromSelected.forEach(async function(locationSelect) {
              if (locationReq.dining_hall_id == locationSelect.dining_hall_id) {
                chosenLocationId = locationReq.dining_hall_id;
              }
            })
          })
        }
        else {
          // no overlap for interval
        }
      });
    });

    if (chosenLocationId!=-1) {
      let hostId = -1;
      let guestId = -1;
      if (type=='host') {
        hostId = requestId;
        guestId = intervalReqId;
      }
      else {
        hostId = intervalReqId;
        guestId = requestId;
      }
      const mealSql = `insert into meal (time, host_id, guest_id, dining_hall_id) values(${chosenDate}, ${hostId}, ${guestId}, ${chosenLocationId});`;
      await database.query(mealSql);
      return true;
    }
    else {
      return false;
    }
  }
}
