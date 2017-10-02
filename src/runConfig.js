const exec = require('child_process').exec;
const { promisify } = require('util');
const fs = require('fs');

const jsonFile = require('jsonfile');
const mkdirp = require('mkdirp');
const ncp = require('ncp');
const copyAsync = promisify(ncp);

const CONFIG_FIELDS = ['name', 'privacy', 'slug', 'scheme', 'version'];

function parseAppJson() {
  console.log('parsing app.json');
  const file = jsonFile.readFileSync('app.json');
  const { expo } = file;
  console.log('Current Values:');
  console.log('name', expo.name);
  console.log('privacy', expo.privacy);
  console.log('slug', expo.slug);
  console.log('scheme', expo.scheme);
  console.log('version', expo.version);
  console.log('-------------');

  copyAppJsonToConfig(file);
}

async function copyAppJsonToConfig() {
  console.log('copying over...');

  const appJson = process.cwd() + '/app.json';
  const expDev = './config/exp-development.json';
  const expProd = './config/exp-prroduction.json';

  try {
    await copyAsync(appJson, expDev);
    await copyAsync(appJson, expProd);
  } catch (err) {
    console.log('err copying files', err);
  }
}

function runConfig(options, cwd) {
  console.log('running config', options, cwd);
  if (fs.existsSync(cwd + '/config')) {
    console.log('config folder exists');
  } else {
    console.log('config folder doesnt exist, creating...');
    mkdirp('./config');
  }

  parseAppJson();
}

module.exports = runConfig;
