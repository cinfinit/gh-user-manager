#!/usr/bin/env node

const { program } = require('commander');
const { addProfile, switchProfile, listProfiles, deleteProfile , updateProfile } = require('../lib/profile');
const { addPreCommitHook } = require('../lib/config');
const { addPlatform, deletePlatform, updatePlatform , listPlatforms, resetPlatforms, restorePlatforms } = require('../lib/platformManager');
// Define CLI commands
program
  .name('gh-user-manager')
  .description('Switch/add/delete GitHub users on your system')
  .version('0.2.0');


program
  .command('init')
  .description('Add a pre-commit hook to show current GitHub user and confirm commit')
  .action(addPreCommitHook);

program
  .command('run-precommit-check')
  .description('Run pre-commit identity check (used by Git hook)')
  .action(async () => {
    const runCheck = require('../lib/preCommitCheck');
    await runCheck();
  });

program
  .command('add')
  .description('Add a new GitHub user profile')
  .requiredOption('--name <name>', 'Profile name')
  .requiredOption('--email <email>', 'Git email')
  .requiredOption('--username <username>', 'GitHub username')
  .option('--platform <platform>', 'Platform (github, gitlab, bitbucket)', 'github')
  .option('--auth <auth>', 'Auth method (https or ssh)', 'https')
  .option('--token <token>', 'Personal Access Token (if using https)')
  .action(addProfile);

program
  .command('switch')
  .description('Switch to a GitHub user profile')
  .argument('<name>', 'Profile name')
  .action(switchProfile);

program
  .command('list')
  .description('List all saved profiles')
  .action(listProfiles);

program
  .command('delete')
  .description('Delete a GitHub user profile')
  .argument('<name>', 'Profile name')
  .action(deleteProfile);


program
  .command('update-profile')
  .description('Update an existing user profile')
  .argument('<name>', 'Profile name')
  .option('--email <email>', 'New Git email')
  .option('--username <username>', 'New Git username')
  .option('--platform <platform>', 'New platform')
  .option('--auth <auth>', 'Auth method (https or ssh)')
  .option('--token <token>', 'New personal access token')
  .action((name, options) => updateProfile(name, options));


program
  .command('add-platform')
  .description('Register a new Git hosting platform')
  .requiredOption('--name <name>', 'Platform name (e.g., gitea)')
  .requiredOption('--domain <domain>', 'Git domain (e.g., gitea.company.com)')
  .option('--auth-format <format>', 'Credential format (default: https://{username}:{token}@{domain})')
  .action(addPlatform);

program
  .command('delete-platform')
  .description('Delete a registered platform')
  .requiredOption('--name <name>', 'Platform name')
  .action(deletePlatform);

program
  .command('update-platform')
  .description('Update domain or auth format of a platform')
  .requiredOption('--name <name>', 'Platform name')
  .option('--domain <domain>', 'New domain')
  .option('--auth-format <format>', 'New auth format')
  .action(updatePlatform);

program
  .command('list-platforms')
  .description('List all registered Git platforms')
  .action(listPlatforms);

program
  .command('reset-platforms')
  .description('Reset platform list to default (GitHub, GitLab, Bitbucket)')
  .action(resetPlatforms);

program
  .command('restore-platforms')
  .description('Restore platforms list from last backup')
  .action(restorePlatforms);

program.parse();
