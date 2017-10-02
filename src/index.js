#!/usr/bin/env node

'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');
const subarg = require('subarg');
const sudoBlock = require('sudo-block');
const logSymbols = require('log-symbols');

const options = {
  flags: {
    environment: {
      type: 'string',
      alias: 'env',
      default: 'development'
    }
  },
  input: [
    'config',
    'releases',
    'rollback'
  ]
};

const cli = meow(
  `
	Usage
      $ exp-deploy <input>

	Options
      --env, -r environment

	Examples
      $ exp-deploy config
      $ exp-deploy releases
      $ exp-deploy rollback --env production v1.2.4
`,
  options
);

function init(args, options) {
  if (args.length === 0) {
    cli.showHelp(1);
  }

  console.log('args', args)
  console.log('options', options)

  const nonGroupedArgs = args.filter(x => !x._);
}

sudoBlock();
updateNotifier({ pkg: cli.pkg }).notify();

init(subarg(cli.input, options)._, cli.flags);
