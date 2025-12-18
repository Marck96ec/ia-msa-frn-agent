const { writeFileSync } = require('fs');
const { resolve } = require('path');

const targetPath = resolve(__dirname, '../src/environments/environment.prod.ts');
const apiUrl = process.env.NG_APP_API_URL;

if (!apiUrl) {
  console.log('[set-env] NG_APP_API_URL not set, keeping existing environment.prod.ts');
  process.exit(0);
}

const fileContent = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

writeFileSync(targetPath, fileContent);
console.log(`[set-env] Updated environment.prod.ts with apiUrl="${apiUrl}"`);
