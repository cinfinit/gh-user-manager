const { loadConfig, saveConfig } = require('./config');
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { loadPlatforms, getCredentialString } = require('./platformManager');

function addProfile(options) {
  const { name, email, username, token, auth, platform = 'github' } = options;
  const config = loadConfig();
  const platforms = loadPlatforms();

  if (config.profiles[name]) {
    console.log(`❌ Profile "${name}" already exists.`);
    return;
  }

  const platformConfig = platforms[platform];
  if (!platformConfig) {
    console.log(`❌ Unknown platform "${platform}". Please add it using 'add-platform'.`);
    return;
  }

  config.profiles[name] = {
    name,
    email,
    username,
    auth,
    token: token || null,
    platform
  };

  saveConfig(config);
  console.log(`✅ Profile "${name}" added for ${platform}.`);
}

function switchProfile(name) {
  const config = loadConfig();
  const profile = config.profiles[name];

  if (!profile) {
    console.log(`❌ Profile "${name}" not found.`);
    return;
  }

  const platforms = loadPlatforms();
  const platform = platforms[profile.platform];

  if (!platform) {
    console.log(`❌ Unknown platform "${profile.platform}".`);
    return;
  }

  const domain = platform.domain;

  if (process.platform === 'darwin') {
    try {
      while (true) {
        execSync(`security delete-internet-password -s ${domain}`, { stdio: 'ignore' });
      }
    } catch (e) {
      // done
    }
    console.log('🧹 Cleaned saved credentials (macOS).');
  }

  execSync(`git config --global user.name "${profile.username}"`);
  execSync(`git config --global user.email "${profile.email}"`);
  execSync(`git config --global credential.helper ""`);
  execSync(`git config --global credential.helper store`);

  if (profile.auth === 'https' && profile.token) {
    const cred = getCredentialString(platform, profile.username, profile.token);
    fs.writeFileSync(path.join(os.homedir(), '.git-credentials'), cred);
  }

  config.current = name;
  saveConfig(config);

  console.log(`✅ Switched to "${name}" (${profile.platform})`);
}

function listProfiles() {
  const config = loadConfig();
  const { profiles, current } = config;

  if (!Object.keys(profiles).length) {
    console.log('No profiles saved.');
    return;
  }

  console.log('Saved profiles:');
  Object.entries(profiles).forEach(([key, profile]) => {
    const active = key === current ? ' (current)' : '';
    console.log(`- ${key} (${profile.email}) [${profile.platform}]${active}`);
  });
}

function deleteProfile(name) {
  const config = loadConfig();

  if (!config.profiles[name]) {
    console.log(`❌ Profile "${name}" not found.`);
    return;
  }

  delete config.profiles[name];
  if (config.current === name) {
    config.current = null;
  }

  saveConfig(config);
  console.log(`🗑️ Deleted profile "${name}"`);
}

function updateProfile(name, options) {
  const config = loadConfig();
  const profile = config.profiles[name];

  if (!profile) {
    console.log(`❌ Profile "${name}" not found.`);
    return;
  }

  const updated = { ...profile, ...options };

  config.profiles[name] = updated;
  saveConfig(config);

  console.log(`✅ Profile "${name}" updated.`);
}


module.exports = {
  addProfile,
  switchProfile,
  listProfiles,
  deleteProfile,
  updateProfile
};
