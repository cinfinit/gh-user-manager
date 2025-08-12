const { loadConfig, saveConfig } = require('./config');
const { execSync } = require('child_process');
const fs = require('fs');

function addProfile(options) {
  const { name, email, username, token, auth } = options;
  const config = loadConfig();

  if (config.profiles[name]) {
    console.log(`❌ Profile "${name}" already exists.`);
    return;
  }

  config.profiles[name] = {
    name,
    email,
    username,
    auth,
    token: token || null
  };

  saveConfig(config);
  console.log(`✅ Profile "${name}" added.`);
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
    console.log(`- ${key} (${profile.email})${active}`);
  });
}

function switchProfile(name) {
  const config = loadConfig();
  const profile = config.profiles[name];

  if (!profile) {
    console.log(`❌ Profile "${name}" not found.`);
    return;
  }
    // Remove Keychain-stored GitHub creds (macOS only)
    if (process.platform === 'darwin') {
        try {
          while (true) {
            execSync('security delete-internet-password -s github.com', { stdio: 'ignore' });
          }
        } catch (e) {
          // no more entries to delete
        }
        // console.log('🧹 Cleared all GitHub credentials ');
        console.log('🧹Cleaning done ');
      }

  // Set Git global config
//   execSync('git credential-osxkeychain erase', { stdio: 'ignore' });

  execSync(`git config --global user.name "${profile.username}"`);
  execSync(`git config --global user.email "${profile.email}"`);
  execSync(`git config --global credential.helper ""`);
  execSync(`git config --global credential.helper store`);

  if (profile.auth === 'https' && profile.token) {
    
    const cred = `https://${profile.username}:${profile.token}@github.com\n`;
    fs.writeFileSync(`${require('os').homedir()}/.git-credentials`, cred);
    execSync(`git config --global credential.helper store`);
  }

  config.current = name;
  saveConfig(config);
  console.log(`✅ Switched to "${name}"`);
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

  if (process.platform === 'darwin') {
    try {
      while (true) {
        execSync('security delete-internet-password -s github.com', { stdio: 'ignore' });
      }
    } catch (e) {
      // no more entries to delete
    }
 
    console.log('🧹Cleaning done ');
  }
  console.log(`🗑️ Deleted profile "${name}"`);
}

module.exports = {
  addProfile,
  switchProfile,
  listProfiles,
  deleteProfile
};
