const fs = require('fs');
const path = require('path');

// Read the environment template file
const envTemplate = path.join(__dirname, '../src/environments/environment.prod.ts');
const envContent = fs.readFileSync(envTemplate, 'utf8');

// Replace the placeholders with the environment variables
const githubToken = process.env.GITHUB_TOKEN || '';
const deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';

let updatedContent = envContent
  .replace('__GITHUB_TOKEN_PLACEHOLDER__', githubToken)
  .replace('__DEEPSEEK_API_KEY_PLACEHOLDER__', deepseekApiKey);

// Write the updated content back
fs.writeFileSync(envTemplate, updatedContent);

console.log('Environment variables set successfully');
console.log('GITHUB_TOKEN length:', githubToken.length);
console.log('DEEPSEEK_API_KEY length:', deepseekApiKey.length);