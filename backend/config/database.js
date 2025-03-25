const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define database path
const dbPath = path.join(__dirname, '../database/tourism.db');

// Create and connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

module.exports = db;
