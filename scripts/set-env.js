const fs = require('fs');
const path = require('path');

// Read the environment template file
const envTemplate = path.join(__dirname, '../src/environments/environment.prod.ts');
const envContent = fs.readFileSync(envTemplate, 'utf8');

// Replace the placeholder with the environment variable
const githubToken = process.env.GITHUB_TOKEN || '';
const updatedContent = envContent.replace(
  '__GITHUB_TOKEN_PLACEHOLDER__',
  githubToken
);

// Write the updated content back
fs.writeFileSync(envTemplate, updatedContent);

console.log('Environment variables set successfully');
console.log('GITHUB_TOKEN length:', githubToken.length);