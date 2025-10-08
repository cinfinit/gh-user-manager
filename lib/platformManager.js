const fs = require('fs');
const os = require('os');
const path = require('path');

const platformsPath = path.join(os.homedir(), '.gh-user-manager-platforms.json');

const defaultPlatforms = {
  github: {
    domain: 'github.com',
    authFormat: 'https://{username}:{token}@{domain}'
  },
  gitlab: {
    domain: 'gitlab.com',
    authFormat: 'https://{username}:{token}@{domain}'
  },
  bitbucket: {
    domain: 'bitbucket.org',
    authFormat: 'https://{username}:{token}@{domain}'
  }
};

function loadPlatforms() {
  if (!fs.existsSync(platformsPath)) {
    const defaults = { ...defaultPlatforms };
    savePlatforms(defaults); // 💾 force write
    return defaults;
  }

  try {
    const raw = fs.readFileSync(platformsPath);
    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to read platforms config:', err.message);
    return { ...defaultPlatforms };
  }
}

function savePlatforms(data) {
  try {
    fs.writeFileSync(platformsPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Failed to save platforms config:', err.message);
  }
}

function listPlatforms() {
    const platforms = loadPlatforms();
    const keys = Object.keys(platforms);
  
    if (!keys.length) {
      console.log('No platforms registered.');
      return;
    }
  
    console.log('Registered platforms:\n');
    keys.forEach((key) => {
      const { domain, authFormat } = platforms[key];
      console.log(`🔹 ${key}`);
      console.log(`   Domain      : ${domain}`);
      console.log(`   Auth Format : ${authFormat}\n`);
    });
  }

function addPlatform({ name, domain, authFormat }) {
  const platforms = loadPlatforms();

  if (platforms[name]) {
    console.log(`❌ Platform "${name}" already exists.`);
    return;
  }

  const defaultFormat = 'https://{username}:{token}@{domain}';

  platforms[name] = {
    domain,
    authFormat: authFormat || defaultFormat
  };

  savePlatforms(platforms);
  console.log(`✅ Platform "${name}" added with domain "${domain}".`);

  if (!authFormat) {
    console.log(`ℹ️  Using default auth format: "${defaultFormat}"`);
  }
}

function deletePlatform({ name }) {
    const platforms = loadPlatforms();
  
    if (!platforms[name]) {
      console.log(`❌ Platform "${name}" not found.`);
      return;
    }
  
    delete platforms[name];
    savePlatforms(platforms);
    console.log(`🗑️ Deleted platform "${name}".`);
}

function updatePlatform({ name, domain, authFormat }) {
    const platforms = loadPlatforms();
  
    if (!platforms[name]) {
      console.log(`❌ Platform "${name}" not found.`);
      return;
    }
  
    if (domain) platforms[name].domain = domain;
    if (authFormat) platforms[name].authFormat = authFormat;
  
    savePlatforms(platforms);
    console.log(`✅ Updated platform "${name}".`);
  }
  
function resetPlatforms() {
    if (fs.existsSync(platformsPath)) {
      const backupPath = platformsPath + '.bak';
      fs.copyFileSync(platformsPath, backupPath);
      console.log(`📦 Backup created at: ${backupPath}`);
    }
  
    const defaultCopy = { ...defaultPlatforms };
    savePlatforms(defaultCopy);
    console.log('🔄 Platforms reset to defaults (GitHub, GitLab, Bitbucket).');
}

function restorePlatforms() {
    const backupPath = platformsPath + '.bak';
  
    if (!fs.existsSync(backupPath)) {
      console.log('❌ No backup file found to restore from.');
      return;
    }
  
    try {
      fs.copyFileSync(backupPath, platformsPath);
      console.log(`✅ Platforms restored from backup.`);
    } catch (err) {
      console.error('❌ Failed to restore platforms:', err.message);
    }
}
  
function getCredentialString(platform, username, token) {
  if (!platform.authFormat) {
    platform.authFormat = 'https://{username}:{token}@{domain}';
  }

  return platform.authFormat
    .replace('{username}', username)
    .replace('{token}', token)
    .replace('{domain}', platform.domain);
}

module.exports = {
  listPlatforms,
  loadPlatforms,
  savePlatforms,
  addPlatform,
  deletePlatform,
  updatePlatform,
  resetPlatforms,
  restorePlatforms,
  getCredentialString
};
