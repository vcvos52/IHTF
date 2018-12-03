const database = require('../database');

const Users = require('./Users');

class Requests {
  static async addRequest(type, kerberos, locations, date, intervals) {
    // TODO: check if there is outstanding request by same user at same time
    const userId = await Users.getId(kerberos);
    const insert = `insert into request (user_id, type) values (${userId}, '${type}');`;
    const response = await database.query(insert);
    const sqlGetRequestID = `select id from request where user_id=${userId} and type='${type}';`;
    const s = await database.query(sqlGetRequestID);
    const requestID = s[s.length - 1].id;
    intervals.forEach(async function (interval) {
      const startTime = date + " " + interval[0] + ":00";
      const endTime = date + " " + interval[1] + ":00";
      const insertInterval = `insert into \`interval\` (\`request_id\`, \`start_time\`, \`end_time\`) VALUES (${requestID}, '${startTime}', '${endTime}');`;
      await database.query(insertInterval);
    });
    locations.forEach(async function (location) {
      const diningHallId = await Requests.getDiningId(location);
      const insertLocation = `insert into \`location\`(\`request_id\`, \`dining_hall_id\`) VALUES (${requestID}, ${diningHallId});`;
      await database.query(insertLocation);
    });
    return await Requests.match(requestID);
  }

  static async requestExists(kerberos, type) {
    const id = await Users.getId(kerberos);
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

    // set of intervals and locations for request to be matched
    const intervalsReq = await database.query(`select * from \`interval\` where \`request_id\`=${requestId};`);
    const locationsReq = await database.query(`select * from \`location\` where \`request_id\`=${requestId};`);

    // all intervals in the request table (could also filter on not the same type)
    const allIntervals = await database.query(`select * from \`interval\` where \`request_id\` <> ${requestId};`);


    let chosenDate = "";
    let chosenLocationId = -1;
    const narrowedRequests = [];
    const requestIdMemo = [];
    const intervalReqIdMemo = [];

    // first go through all intervals of the request and see if any other interval matches
    outermost:
    for (var intervalReq in intervalsReq) {
      for (var interval in allIntervals) {
        const reqStartTime = new Date(intervalReq.start_time);
        const reqEndTime = new Date(intervalReq.end_time);
        const intervalStartTime = new Date(interval.start_time);
        const intervalEndTime = new Date(interval.end_time);

        // get request_id of current interval that is not of the request to be matched
        const intervalReqId = interval.request_id;

        // get type of request for this interval that is not of the request to be matched
        const sqlType = `select * from \`request\` where \`id\`=${intervalReqId} and \`type\` != '${type}';`;
        const responseType = await database.query(sqlType);
        const sqlLocationsFromSelected = `select * from \`location\` where \`request_id\`=${intervalReqId};`;
        const locationsFromSelected = await database.query(sqlLocationsFromSelected);
        if (reqStartTime <= intervalEndTime && reqStartTime >= intervalStartTime && responseType != undefined && responseType.length > 0 && (!requestIdMemo.includes(requestId) || !intervalReqIdMemo.includes(intervalReqId))) {
          locationsReq.forEach(async function (locationReq) {
            locationsFromSelected.forEach(async function (locationSelect) {
              if (locationReq.dining_hall_id == locationSelect.dining_hall_id) {
                chosenDate = intervalReq.start_time;
                chosenLocationId = locationReq.dining_hall_id;
                if (type == 'host') {
                  const mealSql = `insert into \`meal\` (\`time\`, \`host_id\`, \`guest_id\`, \`dining_hall_id\`) values ('${chosenDate}', ${user}, ${responseType[0].user_id}, ${chosenLocationId});`;
                  await database.query(mealSql);

                  // clear requests
                  clearRequests(requestId, currentIntervalId);
                  break outermost;
                }
                else {
                  const mealSql = `insert into \`meal\` (\`time\`, \`host_id\`, \`guest_id\`, \`dining_hall_id\`) values ('${chosenDate}', ${responseType[0].user_id}, ${user}, ${chosenLocationId});`;
                  await database.query(mealSql);

                  // clear requests
                  clearRequests(requestId, currentIntervalId);
                  break outermost;
                }
              }
            }
          }
        }
        else if (reqEndTime <= intervalEndTime && reqEndTime >= intervalStartTime && responseType != undefined && responseType.length > 0 && (!requestIdMemo.includes(requestId) || !intervalReqIdMemo.includes(intervalReqId))) {
          locationsReq.forEach(async function (locationReq) {
            locationsFromSelected.forEach(async function (locationSelect) {
              if (locationReq.dining_hall_id == locationSelect.dining_hall_id) {
                chosenDate = intervalReq.end_time;
                chosenLocationId = locationReq.dining_hall_id;
                if (type == 'host') {
                  const mealSql = `insert into \`meal\` (\`time\`, \`host_id\`, \`guest_id\`, \`dining_hall_id\`) values ('${chosenDate}', ${user}, ${responseType[0].user_id}, ${chosenLocationId});`;
                  await database.query(mealSql);

                  // clear requests
                  clearRequests(requestId, currentIntervalId);

                  break outermost;
                }
                else {
                  const mealSql = `insert into \`meal\` (\`time\`, \`host_id\`, \`guest_id\`, \`dining_hall_id\`) values ('${chosenDate}', ${responseType[0].user_id}, ${user}, ${chosenLocationId});`;
                  await database.query(mealSql);

                  // clear requests
                  clearRequests(requestId, currentIntervalId);
                  break outermost;
                }
              }
            }
          }
        }
        else {
          // no overlap for interval
        }
      }
    }
    return false;
  }

  static async clearRequests(requestId, currentIntervalId) {
    await database.query(`delete * from request where id=${requestId};`);
    await database.query(`delete * from request where id=${currentIntervalId};`);
    await database.query(`delete * from interval where request_id=${requestId};`);
    await database.query(`delete * from interval where request_id=${currentIntervalId};`);
    await database.query(`delete * from location where request_id=${requestId};`);
    await database.query(`delete * from location where request_id=${currentIntervalId};`);
  }
}

module.exports = Requests;
