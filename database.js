const mysql = require('mysql');

const config = {
  host: 'sql.mit.edu',
  user: 'capolino',
  password: 'fixsoftware',
  database: 'capolino+ihtf'
};

class Database {
  constructor(dbConfig) {
    this.connection = mysql.createPool(dbConfig);
  }

  query(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err, rows) => {
        if (err) { return reject(err); }
        resolve(rows);
      });
    });
  }

  // This is a helper function to close a connection to the database.
  // The connection also closes when the program stops running.
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) { return reject( err ); }
        resolve();
      });
    });
  }
}

const database = new Database(config);

module.exports = database;
