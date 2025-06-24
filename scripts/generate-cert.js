import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create certs directory if it doesn't exist
const certsDir = path.join(__dirname, '../certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Path to mkcert executable
const mkcertPath = path.join(__dirname, '..', 'mkcert.exe');

try {
  // Check if mkcert exists
  if (!fs.existsSync(mkcertPath)) {
    throw new Error('mkcert.exe not found. Please download it from https://github.com/FiloSottile/mkcert/releases and place it in the project root directory.');
  }

  // Install local CA
  console.log('Installing local CA...');
  execSync(`"${mkcertPath}" -install`, { stdio: 'inherit' });

  // Generate certificates for localhost
  console.log('Generating certificates for localhost...');
  execSync(`"${mkcertPath}" -key-file certs/private-key.pem -cert-file certs/certificate.pem localhost 127.0.0.1`, { stdio: 'inherit' });

  console.log('Certificates generated successfully!');
  console.log('Files saved in:', certsDir);
} catch (error) {
  console.error('Error generating certificates:', error);
  process.exit(1);
} 