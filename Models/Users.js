const database = require('../database');

class Users {
  static async userExists(kerberos) {
    const sql = `select * from user where kerberos='${kerberos}'`
    const response = await database.query(sql);
    if (response[0]!==undefined) {
      return true;
    }
    return false;
  }

  static async getId(kerberos) {
    const sql = `select * from user where kerberos='${kerberos}'`
    const response = await database.query(sql);
    if (response[0]!==undefined) {
      return response[0].id;
    }
    return false;
  }

  static async getKerberos(id) {
    const sql = `select * from user where id='${id}'`
    const response = await database.query(sql);
    if (response[0]!==undefined) {
      return response[0].kerberos;
    }
    return false;
  }

  static async getMatches(kerberos) {
    const id = await Users.getId(kerberos);
    if (id) {
      const sql = `select * from meal where host_id='${id}' or guest_id='${id}'`
      const response = await database.query(sql);
      if (response[0]) {
        return response;
      }
      else {
        return false;
      }
    }
    return false;
  }
}

module.exports = Users;
