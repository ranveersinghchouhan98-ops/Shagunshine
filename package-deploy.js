const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const stagingDir = path.join(rootDir, 'deploy_fullstack_temp');
const fullstackZip = path.join(rootDir, 'shagun-shine-godaddy-fullstack.zip');

console.log('--- Packaging Clean Fullstack Deployment for GoDaddy ---');

// Clean previous staging and zip
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
if (fs.existsSync(fullstackZip)) {
  fs.unlinkSync(fullstackZip);
}

fs.mkdirSync(stagingDir, { recursive: true });

function copyRecursive(src, dest, ignoreList = []) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      if (ignoreList.includes(item)) continue;
      copyRecursive(path.join(src, item), path.join(dest, item), ignoreList);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Files to copy from root (STRICTLY NO .env OR .env.production)
const rootFiles = [
  'app.js',
  'server.js',
  'package.json',
  'package-lock.json',
  '.htaccess',
  '.env.example',
  'GODADDY_DEPLOYMENT_GUIDE.md',
  'CLIENT_HANDOVER.md'
];

for (const f of rootFiles) {
  const srcPath = path.join(rootDir, f);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(stagingDir, f));
  }
}

// 2. Copy server folder (exclude .env, tests, scripts)
console.log('Copying server folder (sanitized)...');
const serverIgnore = ['.env', '.env.production', '.env.local', 'scripts', 'tests'];
copyRecursive(path.join(rootDir, 'server'), path.join(stagingDir, 'server'), serverIgnore);

// 3. Copy client folder (including package.json, src, and pre-built dist, ignoring node_modules and env)
console.log('Copying client folder (with package.json, src, and pre-built dist)...');
const clientIgnore = ['node_modules', '.env', '.env.local', '.git'];
copyRecursive(path.join(rootDir, 'client'), path.join(stagingDir, 'client'), clientIgnore);

// 4. Also copy dist into root of staging as fallback
copyRecursive(path.join(rootDir, 'client', 'dist'), path.join(stagingDir, 'dist'));

// 5. Verification Sweep: Assert NO .env files exist in staging
function assertNoEnvFiles(dir) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      assertNoEnvFiles(fullPath);
    } else {
      if (item.startsWith('.env') && item !== '.env.example') {
        console.warn(`[Security Alert] Found and removed unexpected env file: ${fullPath}`);
        fs.unlinkSync(fullPath);
      }
    }
  }
}
assertNoEnvFiles(stagingDir);

console.log('Compressing into shagun-shine-godaddy-fullstack.zip using tar.exe...');
const items = fs.readdirSync(stagingDir);
execSync(`tar.exe -a -cf "${fullstackZip}" -C "${stagingDir}" ${items.join(' ')}`, { stdio: 'inherit' });

// Cleanup staging
fs.rmSync(stagingDir, { recursive: true, force: true });

const stats = fs.statSync(fullstackZip);
console.log(`\nSUCCESS! Created: shagun-shine-godaddy-fullstack.zip (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
