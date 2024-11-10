const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '.next');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  const envVars = [
    'NEXT_PUBLIC_BASE',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_TIME_GAP',
    'NEXT_PUBLIC_STAG_SERVER'
  ];

  envVars.forEach(varName => {
    const placeholder = `__${varName.toUpperCase()}__`;
    const value = process.env[varName] || '';
    newContent = newContent.replace(new RegExp(placeholder, 'g'), value);
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.html'))) {
      replaceInFile(filePath);
    }
  });
}

walkDir(nextDir);
console.log('Environment variables injected successfully.');
