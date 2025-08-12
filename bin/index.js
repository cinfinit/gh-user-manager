#!/usr/bin/env node

const { program } = require('commander');
const { addProfile, switchProfile, listProfiles, deleteProfile } = require('../lib/profile');

// Define CLI commands
program
  .name('gh-user-manager')
  .description('Switch/add/delete GitHub users on your system')
  .version('0.1.0');

program
  .command('add')
  .description('Add a new GitHub user profile')
  .requiredOption('--name <name>', 'Profile name')
  .requiredOption('--email <email>', 'Git email')
  .requiredOption('--username <username>', 'GitHub username')
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

program.parse();
