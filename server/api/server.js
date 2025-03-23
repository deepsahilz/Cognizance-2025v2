const app = require("./app");
const connectDB = require("../config/database");
const serverless = require("serverless-http");

// Connect to the database
connectDB();

// Export the app for Vercel as a serverless function
module.exports = serverless(app);
