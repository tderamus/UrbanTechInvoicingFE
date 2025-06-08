const axios = require('axios');

describe('API Connection Test', () => {
    const apiUrl = 'http://localhost:7145/customers'; // Replace with your actual API endpoint

    test('should connect to the C# backend and pull data', async () => {
        const response = await axios.get(apiUrl);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        // Add more expectations based on the expected data structure
    });
});
