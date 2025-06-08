module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/app/**/*.test.js'],
  globals: {
    API_URL: process.env.API_URL || 'http://localhost:7145/customers', // Default API URL for tests
  },
};
