// Test Script to test all API endpoints and show database state
async function runTests() {
    console.log("Starting Full CRUD API Tests...\n");

    // Helper function to fetch and print the current database contents
    async function printDatabaseState(stepName) {
        const response = await fetch('http://localhost:3000/api');
        const data = await response.json();
        console.log(`\n--- Database State After ${stepName} ---`);
        console.log(data);
        console.log("----------------------------------------\n");
        return data; // Return data incase I need it later for more testing
    }

    // Dummy data to inject into database
    const dummyMatch = {
        game_title: "Valorant",
        character_played: "Omen",
        kills: 18,
        kda_ratio: 2.5
    };

    try {
        // Test the POST Route (Create a match)
        console.log("Testing POST /api (Adding a match)...");
        const postResponse = await fetch('http://localhost:3000/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dummyMatch)
        });
        
        const postResult = await postResponse.json();
        console.log("   Result:", postResult);

        // Capture the generated ID for the next steps
        const matchId = postResult.id;
        if (!matchId) throw new Error("No ID returned from POST request.");

        // Print database after Create
        await printDatabaseState("POST (Create)");


        // Test the PUT Route (Update the match)
        console.log(`Testing PUT /api/${matchId} (Updating the match)...`);
        const updatedMatch = {
            game_title: "Valorant",
            character_played: "Omen",
            kills: 25, // Updated value
            kda_ratio: 3.2 // Updated value
        };
        const putResponse = await fetch(`http://localhost:3000/api/${matchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMatch)
        });
        const putResult = await putResponse.json();
        console.log("   Result:", putResult);

        // Print database after Update
        await printDatabaseState("PUT (Update)");


        // Test the DELETE Route (Remove the match)
        console.log(`Testing DELETE /api/${matchId} (Removing the match)...`);
        const deleteResponse = await fetch(`http://localhost:3000/api/${matchId}`, {
            method: 'DELETE'
        });
        const deleteResult = await deleteResponse.json();
        console.log("   Result:", deleteResult);

        // Print database after Delete
        const finalData = await printDatabaseState("DELETE (Remove)");


        // Final Verification
        const stillExists = finalData.find(m => m.id === matchId);
        if (!stillExists) {
            console.log(`   Verification: Match ${matchId} was successfully removed.`);
        } else {
            console.log(`   Verification Failed: Match ${matchId} is still in the database.`);
        }

        console.log("\nAll tests completed successfully!");

    } catch (error) {
        console.error("Test failed. Make sure your server is running!", error.message);
    }
}

runTests();