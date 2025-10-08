const fs = require('fs');
const os = require('os');
const path = require('path');

const configPath = path.join(os.homedir(), '.gh-user-manager-config.json');

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    return { profiles: {}, current: null };
  }

  const raw = fs.readFileSync(configPath);
  const config = JSON.parse(raw);

  let modified = false;

  // ✅ Auto-add platform = 'github' for backward compatibility
  for (const name in config.profiles) {
    if (!config.profiles[name].platform) {
      config.profiles[name].platform = 'github';
      modified = true;
    }
  }

  // ✅ Optional: Persist patched config to disk
  if (modified) {
    saveConfig(config);
  }

  return config;
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function addPreCommitHook() {
  const hookPath = path.resolve('.git', 'hooks', 'pre-commit');

  const hookContent = `#!/bin/sh
# gh-user-manager pre-commit hook
gh-user-manager run-precommit-check
HOOK_EXIT=$?

if [ $HOOK_EXIT -ne 0 ]; then
  echo "❌ Commit aborted by gh-user-manager."
  exit 1
fi
`;

  try {
    fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
    console.log('✅ Pre-commit hook installed successfully.');
  } catch (err) {
    console.error('❌ Failed to install pre-commit hook:', err.message);
  }
}

module.exports = {
  loadConfig,
  saveConfig,
  addPreCommitHook,
  configPath
};
