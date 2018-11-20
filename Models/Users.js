const database = require('../database');

class Users {
 /**
  * checks whether kerberos 'kerberos' exists in user table
  * @param  {string}  kerberos kerberos string to check
  * @return {boolean} true if kerberos exists in user table, false if not
  */
  static async userExists(kerberos) {
    const sql = `select * from user where kerberos =${kerberos}`
    const response = await database.query(sql);
    if (response[0]!==undefined) {
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
    const sql = `select * from user where kerberos =${kerberos}`
    const response = await database.query(sql);
    if (response[0]!==undefined) {
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
    if (response[0]!==undefined) {
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
    const id = getId(kerberos);
    if (id) {
      const sql = `select * from meal where host_id=${id} or guest_id=${id}`
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
