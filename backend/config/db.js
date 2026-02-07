const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'HiveMind',
  password: 'Andrea00.p',
  port: 5432,
});

const initializeDB = () => {
  pool.connect((err) => {
    if (err) {
      console.error('Connection error', err.stack);
    } else {
      console.log('Connected to the database');
    }
  });
};

module.exports = { pool, initializeDB };