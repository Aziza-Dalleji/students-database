const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      multipleStatements: true
    });

    const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    await connection.query(sql);
    await connection.end();
    
    console.log('Database initialized successfully');
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('Tables already exist, skipping initialization');
    } else {
      console.error('Database initialization error:', error);
    }
  }
}

module.exports = initializeDatabase;