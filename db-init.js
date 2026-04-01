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

    // Drop existing tables to start fresh
    await connection.query(`
      DROP TABLE IF EXISTS documents;
      DROP TABLE IF EXISTS honors;
      DROP TABLE IF EXISTS courses;
      DROP TABLE IF EXISTS english_scores;
      DROP TABLE IF EXISTS work_experience;
      DROP TABLE IF EXISTS academic_records;
      DROP TABLE IF EXISTS students;
    `);

    const sql = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf8');
    await connection.query(sql);
    await connection.end();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

module.exports = initializeDatabase;