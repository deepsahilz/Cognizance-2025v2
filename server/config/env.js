const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/cognizance2025",

  // Authentication Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",

  // Ethereum Blockchain Configuration
  ETHEREUM_CONTRACT_ADDRESS: process.env.ETHEREUM_CONTRACT_ADDRESS,
  ETHEREUM_PROVIDER_URL: process.env.ETHEREUM_PROVIDER_URL,
  PLATFORM_WALLET_ADDRESS: process.env.PLATFORM_WALLET_ADDRESS,
  CHAIN_ID: process.env.CHAIN_ID || 84532,

  // AI Services Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  // AI Verification Configuration
  AI_VERIFICATION_ENABLED: process.env.AI_VERIFICATION_ENABLED || "true",

  // File Upload Configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || (10 * 1024 * 1024), // 10MB default
};