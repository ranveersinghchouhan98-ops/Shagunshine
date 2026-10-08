const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const stagingFullstack = path.join(rootDir, 'deploy_fullstack_temp');
const stagingStatic = path.join(rootDir, 'deploy_static_temp');
const fullstackZip = path.join(rootDir, 'shagun-shine-godaddy-fullstack.zip');
const staticZip = path.join(rootDir, 'shagun-shine-godaddy-static-public_html.zip');

console.log('=== Step 1: Building Fresh Production Client ===');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

console.log('\n=== Step 2: Packaging Clean Fullstack Deployment for GoDaddy ===');

// Clean previous staging and zips
[stagingFullstack, stagingStatic].forEach(dir => {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
});
[fullstackZip, staticZip].forEach(zipFile => {
  if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
});

fs.mkdirSync(stagingFullstack, { recursive: true });
fs.mkdirSync(stagingStatic, { recursive: true });

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

// 1. Root files for fullstack (STRICTLY NO .env)
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
    fs.copyFileSync(srcPath, path.join(stagingFullstack, f));
  }
}

// 2. Copy server folder (exclude .env, tests, scripts)
console.log('Copying server folder (sanitized)...');
const serverIgnore = ['.env', '.env.production', '.env.local', 'scripts', 'tests'];
copyRecursive(path.join(rootDir, 'server'), path.join(stagingFullstack, 'server'), serverIgnore);

// 3. Copy client folder (with package.json, package-lock.json, src, and pre-built dist)
console.log('Copying client folder (with dependencies & pre-built dist)...');
const clientIgnore = ['node_modules', '.env', '.env.local', '.git'];
copyRecursive(path.join(rootDir, 'client'), path.join(stagingFullstack, 'client'), clientIgnore);

// 4. Also copy dist into root of staging as fallback
copyRecursive(path.join(rootDir, 'client', 'dist'), path.join(stagingFullstack, 'dist'));

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
assertNoEnvFiles(stagingFullstack);

console.log('Compressing shagun-shine-godaddy-fullstack.zip using tar.exe...');
const fullstackItems = fs.readdirSync(stagingFullstack);
execSync(`tar.exe -a -cf "${fullstackZip}" -C "${stagingFullstack}" ${fullstackItems.join(' ')}`, { stdio: 'inherit' });
fs.rmSync(stagingFullstack, { recursive: true, force: true });

console.log('\n=== Step 3: Packaging Static Storefront for GoDaddy public_html ===');
copyRecursive(path.join(rootDir, 'client', 'dist'), stagingStatic);
if (fs.existsSync(path.join(rootDir, 'client', 'public', '.htaccess'))) {
  fs.copyFileSync(path.join(rootDir, 'client', 'public', '.htaccess'), path.join(stagingStatic, '.htaccess'));
}

const staticItems = fs.readdirSync(stagingStatic);
execSync(`tar.exe -a -cf "${staticZip}" -C "${stagingStatic}" ${staticItems.join(' ')}`, { stdio: 'inherit' });
fs.rmSync(stagingStatic, { recursive: true, force: true });

const fullstackStats = fs.statSync(fullstackZip);
const staticStats = fs.statSync(staticZip);

console.log('\n======================================================');
console.log('🎉 ALL PACKAGES SUCCESSFULLY CREATED!');
console.log(`1. Full-Stack Archive: ${fullstackZip} (${(fullstackStats.size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`2. Static public_html: ${staticZip} (${(staticStats.size / (1024 * 1024)).toFixed(2)} MB)`);
console.log('======================================================\n');
