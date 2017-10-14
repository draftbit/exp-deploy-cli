'use strict'

const chalk = require('chalk');
const exec = require('child_process').exec;
const { promisify } = require('util');
const fs = require('fs');
const jsonFile = require('jsonfile');
const mkdirp = require('mkdirp');
const ncp = require('ncp');

const copyAsync = promisify(ncp);
const log = console.log;

const CONFIG_FIELDS = ['name', 'privacy', 'slug', 'scheme', 'version'];

function parseAppJson() {
  const file = jsonFile.readFileSync('app.json');
  const { expo } = file;

  log(chalk.blue(''))
  log('name:', chalk.yellow(expo.name));
  log('privacy:', chalk.yellow(expo.privacy));
  log('slug:', chalk.yellow(expo.slug));
  log('scheme:', chalk.yellow(expo.scheme));
  log('version:', chalk.yellow(expo.version));
  log(chalk.blue(''))

  copyAppJsonToConfig(file);
}

async function copyAppJsonToConfig() {
  log(chalk.blue('============================================='))
  log(chalk.green('[exp-deploy config]: Copying app.json into: '))
  log(chalk.blue('============================================='))
  log(chalk.blue(''))
  log(chalk.yellow('./config/exp-development.json'))
  log(chalk.yellow('./config/exp-production.json'))
  log(chalk.blue(''))

  const appJson = process.cwd() + '/app.json';
  const expDev = './config/exp-development.json';
  const expProd = './config/exp-production.json';

  try {
    await copyAsync(appJson, expDev);
    await copyAsync(appJson, expProd);
    log(chalk.green('All done! Check your config folder'))
    process.exit(0)
  } catch (err) {
    log(chalk.red('Copying files failed: ', err))
    process.exitCode = 1
    return
  }
}

function runConfig(options, cwd) {
  log(chalk.blue('============================================='))
  if (fs.existsSync(cwd + '/config')) {
    log(chalk.green('[exp-deploy config]: config folder exists'))
  } else {
    log(chalk.red(`[exp-deploy config]: creating config folder`))
    mkdirp('./config');
  }
  log(chalk.blue('============================================='))

  parseAppJson();
}

module.exports = runConfig;
