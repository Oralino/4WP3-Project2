const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

// Initialize and connect to the database
async function initDB() {
    try {
        const db = await sqlite.open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        console.log("Connected to the SQLite database.");

        // Creates the matches table if it doesn't already exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS matches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                game_title TEXT NOT NULL,
                character_played TEXT NOT NULL,
                kills INTEGER NOT NULL,
                kda_ratio REAL NOT NULL
            )
        `);

        console.log("Matches table is ready.");
        return db;

    } catch (error) {
        console.error("Could not connect to database", error);
    }
}

// Export the function so our main server file can use it later
module.exports = initDB;