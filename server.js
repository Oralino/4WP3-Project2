const express = require('express');
const cors = require('cors');
const initDB = require('./database.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows your React Native app to make requests to API
app.use(express.json()); // Allows the server to parse JSON data sent in requests

let db;

// Initialize the database before starting the server
initDB().then(database => {
    db = database;
    
    // Start listening for requests only after the database is connected
    app.listen(PORT, () => {
        console.log(`Match Tracker API is running on http://localhost:${PORT}`);
    });
});

// GET /api - Retrieve all matches
app.get('/api', async (req, res) => {
    try {
        const matches = await db.all('SELECT * FROM matches ORDER BY id DESC');
        res.json(matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ error: "Failed to retrieve matches" });
    }
});