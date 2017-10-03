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
      $ exp-deploy --env production
      $ exp-deploy --env staging
      $ exp-deploy config
      $ exp-deploy sync
`,
  options
);

function init(args, options) {
  if (args.length === 0 && !options.env) {
    cli.showHelp(1);
  }

  if (args.length === 0 && options.env) {
    return runDeploy(options, cwd);
  }

  const cmd = args[0]

  if (cmd === 'config') return runConfig(options, cwd);
  if (cmd === 'sync') return runSync(options, cwd);
}

sudoBlock();
updateNotifier({ pkg: cli.pkg }).notify();

init(subarg(cli.input, options)._, cli.flags);
