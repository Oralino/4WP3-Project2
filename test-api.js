// Test Script to test API endpoints
async function runTests() {
    console.log("Starting API Tests...\n");

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

        // Test the GET Route (Read all matches)
        console.log("\nTesting GET /api (Fetching all matches)...");
        const getResponse = await fetch('http://localhost:3000/api');
        
        const getResult = await getResponse.json();
        console.log("   Current Database Records:");
        console.log(getResult);

        console.log("\nAll tests completed successfully!");

    } catch (error) {
        console.error("Test failed. Make sure your server is running!", error.message);
    }
}

runTests();