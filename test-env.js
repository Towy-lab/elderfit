import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== ENVIRONMENT VARIABLE DEBUG ===');
console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);

// Try to load .env file
const dotenvPath = path.resolve(__dirname, '.env');
console.log('Looking for .env at:', dotenvPath);

import fs from 'fs';
console.log('.env file exists:', fs.existsSync(dotenvPath));

if (fs.existsSync(dotenvPath)) {
  console.log('.env file content:');
  const content = fs.readFileSync(dotenvPath, 'utf8');
  console.log(content);
}

// Load dotenv
const result = dotenv.config({ path: dotenvPath });
console.log('dotenv result:', result.error ? 'ERROR: ' + result.error : 'Success');

// Check environment variables
console.log('\n=== ENVIRONMENT VARIABLES ===');
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0);
console.log('STRIPE_SECRET_KEY first 20 chars:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...' : 'undefined');
console.log('STRIPE_SECRET_KEY last 10 chars:', process.env.STRIPE_SECRET_KEY ? '...' + process.env.STRIPE_SECRET_KEY.substring(process.env.STRIPE_SECRET_KEY.length - 10) : 'undefined');

console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET); 