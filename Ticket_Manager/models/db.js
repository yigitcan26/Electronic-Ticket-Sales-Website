const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'db',
  waitForConnections: true, 
  connectionLimit: 10,
  queueLimit: 0
});

// Get connection
const connection = pool.promise();

// Check connection
connection.execute('SELECT 1 + 1 as result')
  .then(([rows, fields]) => {
    console.log('Successfully connected to the database.');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

module.exports = connection;
