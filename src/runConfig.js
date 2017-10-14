'use strict'

const chalk = require('chalk');
const exec = require('child_process').exec;
const { promisify } = require('util');
const fs = require('fs');
const jsonFile = require('jsonfile');
const mkdirp = require('mkdirp');
const ncp = require('ncp');
const Table = require('cli-table');

const table = new Table({
    head: ['Env', 'Filename', 'Version', 'Name', 'Slug'],
});

const copyAsync = promisify(ncp);
const log = console.log;

const CONFIG_FIELDS = ['name', 'privacy', 'slug', 'scheme', 'version'];

function parseAppJson() {
  const file = jsonFile.readFileSync('app.json');

  if (!file) {
    log(chalk.red(`[exp-deploy config] Error: app.json doesn't exist`))
    process.exitCode = 1
    return
  }

  const { expo } = file;
  copyAppJsonToConfig(file);
}

async function copyAppJsonToConfig(file) {
  const appJson = process.cwd() + '/app.json';
  const expDev = './config/exp-development.json';
  const expProd = './config/exp-production.json';

  table.push(
    ['Production', './config/exp-production.json', file.expo.version, file.expo.name, file.expo.slug]
  )

  try {
    const appJsonDev = Object.assign({}, file)

    appJsonDev.expo.name = file.expo.name + '-staging'
    appJsonDev.expo.slug = file.expo.slug + '-staging'

    table.push(
      ['Development', './config/exp-development.json', appJsonDev.expo.version, appJsonDev.expo.name, appJsonDev.expo.slug],
    );

    console.log(table.toString());

    fs.writeFileSync(
      './config/exp-development.json',
      JSON.stringify(appJsonDev, null, 2),
      'utf-8'
    );

    await copyAsync(appJson, expProd);
    log(chalk.green('[exp-deploy config]: All done! Check your config folder'))
    process.exit(0)
  } catch (err) {
    log(chalk.red('Copying files failed: ', err))
    process.exitCode = 1
    return
  }
}

function runConfig(options, cwd) {
  if (fs.existsSync(cwd + '/config')) {
    log(chalk.green('[exp-deploy config]: config folder exists'))
  } else {
    log(chalk.green(`[exp-deploy config]: creating config folder`))
    mkdirp('./config');
  }

  parseAppJson();
}

module.exports = runConfig;
