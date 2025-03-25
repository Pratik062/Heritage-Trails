const db = require('../config/database');

// Create users table if it doesn't exist
const createUserTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            full_name TEXT NULL,
            profile_picture TEXT NULL,
            date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(query);
};

// Insert user with only required fields (others remain NULL)
const createUser = (username, email, password, role = 'user') => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
        db.run(query, [username, email, password, role], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

// Update user profile later
const updateUserProfile = (user_id, full_name, profile_picture) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET full_name = ?, profile_picture = ? WHERE user_id = ?`,
            [full_name, profile_picture, user_id],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: 'Profile updated successfully' });
                }
            }
        );
    });
};

// Export functions
module.exports = { createUserTable, createUser, updateUserProfile };
