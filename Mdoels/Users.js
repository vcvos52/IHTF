const database = requiore('../database');

class Users {
  static async getUser(username) {

  }

  static async userExists(kerberos) {
    const sql = `select * from users where username =${kerberos}`
    const response = await database.query(sql);
    if (response[0]!==undefined) {
      return true;
    }
    return false;
  }
}
