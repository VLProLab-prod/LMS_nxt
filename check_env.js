const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log("Checking Environment...");
console.log("Current Directory:", process.cwd());
console.log("DATABASE_URL defined:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL starts with:", process.env.DATABASE_URL.substring(0, 10) + "...");
} else {
    console.log("DATABASE_URL is missing!");
}
