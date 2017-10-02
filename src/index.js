#!/usr/bin/env node

'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');
const subarg = require('subarg');
const sudoBlock = require('sudo-block');
const logSymbols = require('log-symbols');

const runConfig = require('./runConfig');
const runSync = require('./runSync');
const runDeploy = require('./runDeploy')

const cwd = process.cwd();

const options = {
  flags: {
    environment: {
      type: 'string',
      alias: 'env',
      default: 'development'
    },
    directory: {
      type: 'string',
      alias: 'dir',
      default: './config'
    }
  },
  input: ['config', 'releases', 'rollback', 'sync']
};

const cli = meow(
  `
	Usage
      $ exp-deploy <input>

	Options
      --env, --environment
      --dir, --directory
      --v, --version

	Examples
      $ exp-deploy --production
      $ exp-deploy config
      $ exp-deploy releases
      $ exp-deploy rollback --env production v1.2.4
      $ exp-deploy sync
`,
  options
);

function init(args, options) {
  if (args.length === 0 && !options.production && !options.development) {
    cli.showHelp(1);
  }

  if (args.length === 0) {
    return runDeploy(options, cwd);
  }

  if (args[0] === 'config') return runConfig(options, cwd);
  if (args[0] === 'sync') return runSync(options, cwd);
}

sudoBlock();
updateNotifier({ pkg: cli.pkg }).notify();

init(subarg(cli.input, options)._, cli.flags);
