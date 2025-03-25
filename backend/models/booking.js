const db = require('../config/database');

// Create bookings table if it doesn't exist
const createBookingTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            destination_id INTEGER,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            number_of_people INTEGER DEFAULT 1,
            total_price REAL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE
        )
    `;
    db.run(query, (err) => {
        if (err) {
            console.error("❌ Error creating booking table:", err.message);
        } else {
            console.log("✅ booking table created (or already exists)");
        }
    });
};

createBookingTable();

// Create a new booking
const createBooking = (user_id, destination_id, start_date, end_date, number_of_people, total_price) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO bookings (user_id, destination_id, start_date, end_date, number_of_people, total_price, status) 
                       VALUES (?, ?, ?, ?, ?, ?, 'pending')`;
        db.run(query, [user_id, destination_id, start_date, end_date, number_of_people, total_price], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

// Get all bookings for a specific user
const getUserBookings = (user_id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM bookings WHERE user_id = ?`;
        db.all(query, [user_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Update a booking
const updateBooking = (booking_id, start_date, end_date, number_of_people, total_price) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE bookings 
                       SET start_date = ?, end_date = ?, number_of_people = ?, total_price = ?, status = 'pending' 
                       WHERE booking_id = ?`;
        db.run(query, [start_date, end_date, number_of_people, total_price, booking_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Booking updated successfully' });
            }
        });
    });
};

// Cancel (delete) a booking
const cancelBooking = (booking_id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM bookings WHERE booking_id = ?`;
        db.run(query, [booking_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Booking canceled successfully' });
            }
        });
    });
};

// Export functions
module.exports = { createBookingTable, createBooking, getUserBookings, updateBooking, cancelBooking };
