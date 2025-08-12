const fs = require('fs');
const os = require('os');
const path = require('path');

const configPath = path.join(os.homedir(), '.gh-user-manager-config.json');

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    return { profiles: {}, current: null };
  }
  const raw = fs.readFileSync(configPath);
  return JSON.parse(raw);
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = {
  loadConfig,
  saveConfig,
  configPath
};
