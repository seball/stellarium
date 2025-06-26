export const environment = {
  production: false,
  githubToken: process.env['GITHUB_TOKEN'] || '', // Will use environment variable in production
};
