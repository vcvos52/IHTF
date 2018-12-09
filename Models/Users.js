const database = require('../database');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ihtfoodmit@gmail.com",
    pass: 'fixsoftware'
  }
})

class Users {
  /**
   * Adds user to database user
   * @param {string} kerberos 
   * @return {boolean} true if action completed successfully, false otherwise
   */
  static async addUser(kerberos) {
    const sql = `insert into user (kerberos) VALUES ("${kerberos}")`
    const response = await database.query(sql);
    if (response !== undefined) {
      return true;
    }
    return false;
  }
  /**
   * checks whether kerberos 'kerberos' exists in user table
   * @param  {string}  kerberos kerberos string to check
   * @return {boolean} true if kerberos exists in user table, false if not
   */
  static async userExists(kerberos) {
    // const sql = `select * from user where kerberos='${kerberos}';`;
    const response = await database.query('select * from user where kerberos=?;', [kerberos]);
    if (response[0] !== undefined) {
      return true;
    }
    return false;
  }

  /**
   * gets id of kerberos in user table
   * @param  {string} kerberos kerberos string to query for
   * @return {int} value of id or false if kerberos does not exist in user table
   */
  static async getId(kerberos) {
    // const sql = `select * from user where kerberos='${kerberos}';`;
    const response = await database.query('select * from user where kerberos=?;', [kerberos]);
    if (response[0] !== undefined) {
      return response[0].id;
    }
    return false;
  }

  /**
   * get kerberos of id in user table
   * @param  {int}  id id to query for in user table
   * @return {string} kerberos that is mapped to from id in user table or false if id does not exist
   */
  static async getKerberos(id) {
    const sql = `select * from user where id=${id}`
    const response = await database.query(sql);
    if (response[0] !== undefined) {
      return response[0].kerberos;
    }
    return false;
  }

  /**
   * returns all meal matches with host_id or guest_id foreign keys with kerberos 'kerberos'
   * @param  {string}  kerberos string to query for in meal table
   * @return {object}  entries of matches or false if kerberos does not exist in user table or no matches for kerberos
   */
  static async getMatches(kerberos) {
    const id = await Users.getId(kerberos);
    if (id) {
      const sql = `select * from meal where host_id=${id} or guest_id=${id} and time >= '${new Date().toISOString().slice(0, 19).replace('T', ' ')}';`
      const response = await database.query(sql);
      if (response[0] !== undefined) {
        return response;
      }
      else {
        return false;
      }
    }
    return false;
  }

  /**
   * returns all requests made by kerberos 'kerberos'
   * @param {string} kerberos string to query for
   * @return {object} entries of requests or false if kerberos does not exist or no requests
   * where request contains request id, start time, end time, and dining hall id
   */
  static async getRequests(kerberos) {
    const id = await Users.getId(kerberos);
    if (id) {
      const sql = `SELECT i.request_id, i.start_time, i.end_time, location.dining_hall_id 
        FROM \`interval\` as i INNER JOIN location on i.request_id = location.request_id 
        WHERE i.request_id in (SELECT id FROM request WHERE user_id = ${id}) ORDER BY i.request_id`
      const response = await database.query(sql);
      if (response[0]) {
        return response;
      }
    }
    return false;
  }

  /**
   * returns 1 if request is host request, 2 if it's guest request, false if id does not exist
   * @param {int} id - request id
   * @return 1 or 2, false
   */
  static async getRequestType(id) {
    const sql = `SELECT type FROM request WHERE id = ${id}`
    const response = await database.query(sql);
    if (response[0] !== undefined) {
      if (response[0].type == 'host') {
        return 1
      } else if (response[0].type == 'guest') {
        return 2
      }
    }
  }

  /**
   * Sends notification for match to users who have been matched
   * @param {int} firstUserId 
   * @param {int} secondUserId
   * @param {string} date
   * @param {int} diningHallId
   * @return true if email is successful, false otherwise
   */
  static async sendNotificationForMatch(firstUserId, secondUserId, date, diningHallId) {
    // extracting needed data
    let hostResponse = await database.query(`select kerberos from user where id = ${firstUserId}`)
    let hostKerberos = hostResponse[0].kerberos
    let guestResponse = await database.query(`select kerberos from user where id = ${secondUserId}`)
    let guestKerberos = guestResponse[0].kerberos
    let diningHallResponse = await database.query(`select name from dining_hall where id = ${diningHallId}`)
    let chosenDiningHall = diningHallResponse[0].name
    let subjectText = "IHTF: You have been matched!"
    let emailText = "<p>Hey " + hostKerberos + ", <br> <br> You have been matched to dine with " + guestKerberos + " on " +
      date + " in " + chosenDiningHall + ". <br> Enjoy! <br> <br> I Have This Food Team</p>";
    // preparing the email
    let fullData = {
      from: "ihtfoodmit@gmail.com",
      to: hostKerberos + "@mit.edu",
      subject: subjectText,
      html: emailText
    }
    // sending the email
    transporter.sendMail(fullData, function (error, response) {
      if (error) {
        console.log(JSON.stringify(error))
        return false;
      } else {
        return true;
      };
    })
  }

  /**
   * Sends notification for cancelation of a meal
   * @param {int} id - meal id
   * @return {boolean} - true if successful, false otherwise
   */
  static async sendNotificationForCancelation(id) {
    // extracting needed data
    let response = await database.query(`select host_id, guest_id, time from meal where id = ${id}`);
    let hostId = response[0].host_id;
    let hostResponse = await database.query(`select kerberos from user where id = ${hostId}`);
    let hostKerberos = hostResponse[0].kerberos

    let guestId = response[0].guest_id;
    let guestResponse = await database.query(`select kerberos from user where id = ${guestId}`);
    let guestKerberos = guestResponse[0].kerberos

    let kerberoses = [hostKerberos, guestKerberos];
    for (let i = 0; i < kerberoses.length; i++) {
      // preparing the email
      let fullData = {
        from: "ihtfoodmit@gmail.com",
        to: kerberoses[i] + "@mit.edu",
        subject: "IHTF: Meal Cancelation",
        html: "Dear " + kerberoses[i] + ", <br> <br>Unfortunately your meal scheduled on " + response[0].time.toString() +
          " has been canceled. <br> Feel free to add another request in order to be matched again! <br> <br>" +
          "I Have This Food Team"
      }
      // sending the email
      await transporter.sendMail(fullData, async function (error, response) {
        if (error) {
          console.log(JSON.stringify(error))
          return false;
        } else {
          return true;
        };
      })
    }
  }
}

module.exports = Users;
