const os = require('os');
const path = require('path');

const POSTGRESQL_CONFIG = Object.freeze({
  client: 'postgres',
  connection: {
    host: '127.0.0.1',
    database: 'objection_utils_test',
    user: 'postgres',
    password: 'pass'
  },
  pool: {
    min: 0,
    max: 10
  }
});

const SQLITE_CONFIG = Object.freeze({
  client: 'sqlite3',
  connection: {
    filename: path.join(os.tmpdir(), 'objection_utils_test.db')
  },
  useNullAsDefault: true
});

module.exports = {
  POSTGRESQL_CONFIG,
  SQLITE_CONFIG
};
