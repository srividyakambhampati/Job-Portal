/**
 * Shortcut to run the backend server from the root directory.
 * This allows "node server" to work from the project root.
 */
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ .env file loaded from backend folder');
} else {
    console.warn('⚠️ No .env file found in backend folder');
}

// Ensure MONGO_URI is set or provided a default for the child process
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal';

require('./backend/server.js');
