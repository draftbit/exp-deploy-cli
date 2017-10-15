#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const subarg = require('subarg');
const sudoBlock = require('sudo-block');
const logSymbols = require('log-symbols');
const chalk = require('chalk');

const runConfig = require('./runConfig');
const runSync = require('./runSync');
const runDeploy = require('./runDeploy')

const cwd = process.cwd();
let log = console.log;

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
  input: ['config']
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
      $ exp-deploy config
      $ exp-deploy --env production
      $ exp-deploy --env staging
`,
  options
);

function showEnvError () {
  log(chalk.blue('======================================================'))
  log('Oops! Do you mind passing in staging or production?')
  log(`If you'd like to extend this, feel free to open a PR:`)
  log('https://github.com/Preposterous/exp-deploy-cli')
  log(chalk.blue('======================================================'))
}

function init(args, options) {
  if (args.length === 0 && !options.env) {
    cli.showHelp(1);
  }

  if (args.length === 0 && options.env) {
    if (options.env !== 'staging' && options.env !== 'production') {
      showEnvError()
      process.exitCode = 1
      return
    }

    return runDeploy(options, cwd);
  }

  const cmd = args[0];

  if (cmd === 'config') return runConfig(options, cwd);
}

sudoBlock();
updateNotifier({ pkg: cli.pkg }).notify();

init(subarg(cli.input, options)._, cli.flags);
