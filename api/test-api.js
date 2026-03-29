// Test Script to test all 6 API endpoints with multiple records
async function runTests() {
    console.log("Starting Full 6-Route API Tests with Multiple Records...\n");

    // Helper function to fetch and print the current database contents
    async function printDatabaseState(stepName) {
        const response = await fetch('http://localhost:3000/api');
        const data = await response.json();
        console.log(`\n--- Database State After ${stepName} ---`);
        console.log(data);
        console.log("----------------------------------------\n");
        return data; // Return data incase I need it later for more testing
    }

    // Array of 3 dummy matches to inject
    const dummyMatches = [
        { game_title: "Valorant", character_played: "Omen", kills: 18, kda_ratio: 2.5 },
        { game_title: "League of Legends", character_played: "Ahri", kills: 12, kda_ratio: 4.0 },
        { game_title: "Overwatch", character_played: "Tracer", kills: 22, kda_ratio: 3.1 }
    ];

    // Array to store the database-generated IDs
    const insertedIds = [];

    try {
        // Test the POST Route (Create 3 matches)
        console.log("Testing POST /api (Adding 3 matches)...");
        for (const match of dummyMatches) {
            const postResponse = await fetch('http://localhost:3000/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(match)
            });
            const postResult = await postResponse.json();
            insertedIds.push(postResult.id);
        }
        
        console.log(`   Result: Successfully inserted 3 matches with IDs: ${insertedIds.join(', ')}`);
        
        // Print database after Create
        await printDatabaseState("POST (Create 3 Matches)");

        // We will perform our single-item tests on the FIRST match we inserted
        const targetId = insertedIds[0];

        // Test the GET /api/:id Route (Fetch single match)
        console.log(`Testing GET /api/${targetId} (Fetching single match)...`);
        const getSingleResponse = await fetch(`http://localhost:3000/api/${targetId}`);
        const getSingleResult = await getSingleResponse.json();
        console.log("   Result:", getSingleResult);

        // Test the PUT Route (Update the single match)
        console.log(`\nTesting PUT /api/${targetId} (Updating the first match)...`);
        const updatedMatch = {
            game_title: "Valorant",
            character_played: "Omen",
            kills: 30, // Updated value
            kda_ratio: 5.5 // Updated value
        };
        const putResponse = await fetch(`http://localhost:3000/api/${targetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMatch)
        });
        const putResult = await putResponse.json();
        console.log("   Result:", putResult);

        // Print database after Update
        await printDatabaseState("PUT (Update First Match)");

        // Test the DELETE Route (Remove the single match)
        console.log(`Testing DELETE /api/${targetId} (Removing the first match)...`);
        const deleteResponse = await fetch(`http://localhost:3000/api/${targetId}`, {
            method: 'DELETE'
        });
        const deleteResult = await deleteResponse.json();
        console.log("   Result:", deleteResult);

        // Print database after Delete Single (There should be 2 matches left)
        await printDatabaseState("DELETE Single (Remove First Match)");

        // Test the DELETE /api Route (Clear ALL remaining matches)
        console.log("Testing DELETE /api (Clearing the remaining database records)...");
        const deleteAllResponse = await fetch('http://localhost:3000/api', {
            method: 'DELETE'
        });
        const deleteAllResult = await deleteAllResponse.json();
        console.log("   Result:", deleteAllResult);

        // Print database after Delete All
        const finalData = await printDatabaseState("DELETE All (Clear Database)");

        // Final Verification
        if (finalData.length === 0) {
            console.log("   Verification: Database is completely empty. 'Clear All' was successful.");
        } else {
            console.log("   Verification Failed: Database is not empty.");
        }

        console.log("\nAll tests completed successfully!");

    } catch (error) {
        console.error("Test failed. Make sure your server is running!", error.message);
    }
}

runTests();