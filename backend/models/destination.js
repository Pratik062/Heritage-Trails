const db = require("../config/database");

const createDestinationTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS destinations (
            destination_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            location TEXT NOT NULL,
            image_url TEXT,
            average_rating REAL DEFAULT 0,
            price_range TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(query, (err) => {
        if (err) {
            console.error("❌ Error creating destinations table:", err.message);
        } else {
            console.log("✅ Destinations table created (or already exists)");
        }
    });
};

// Call this function to ensure table creation when this file runs
createDestinationTable();

const getAllDestinations = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM destinations", [], (err, rows) => {
            if (err) {
                console.error("❌ Error fetching destinations:", err.message);
                reject(err);
            } else {
                console.log("✅ Destinations fetched successfully");
                resolve(rows);
            }
        });
    });
};

const getDestinationById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM destinations WHERE destination_id = ?", [id], (err, row) => {
            if (err) {
                console.error(`❌ Error fetching destination with ID ${id}:`, err.message);
                reject(err);
            } else {
                console.log(`✅ Destination with ID ${id} fetched successfully`);
                resolve(row);
            }
        });
    });
};

const addDestination = (destination) => {
    return new Promise((resolve, reject) => {
        const { name, description, location, image_url, price_range } = destination;
        db.run(
            `INSERT INTO destinations (name, description, location, image_url, price_range) VALUES (?, ?, ?, ?, ?)`,
            [name, description, location, image_url, price_range],
            function (err) {
                if (err) {
                    console.error("❌ Error adding destination:", err.message);
                    reject(err);
                } else {
                    console.log("✅ Destination added successfully");
                    resolve({ id: this.lastID, message: "Destination added successfully" });
                }
            }
        );
    });
};

const updateDestination = (id, destination) => {
    return new Promise((resolve, reject) => {
        const { name, description, location, image_url, price_range } = destination;
        db.run(
            `UPDATE destinations SET name = ?, description = ?, location = ?, image_url = ?, price_range = ?, updated_at = CURRENT_TIMESTAMP WHERE destination_id = ?`,
            [name, description, location, image_url, price_range, id],
            function (err) {
                if (err) {
                    console.error(`❌ Error updating destination with ID ${id}:`, err.message);
                    reject(err);
                } else {
                    console.log(`✅ Destination with ID ${id} updated successfully`);
                    resolve({ message: "Destination updated successfully" });
                }
            }
        );
    });
};

const deleteDestination = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM destinations WHERE destination_id = ?", [id], function (err) {
            if (err) {
                console.error(`❌ Error deleting destination with ID ${id}:`, err.message);
                reject(err);
            } else {
                console.log(`✅ Destination with ID ${id} deleted successfully`);
                resolve({ message: "Destination deleted successfully" });
            }
        });
    });
};

// Export functions
module.exports = {
    createDestinationTable,
    getAllDestinations,
    getDestinationById,
    addDestination,
    updateDestination,
    deleteDestination
};
