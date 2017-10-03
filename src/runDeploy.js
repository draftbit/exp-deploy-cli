const { promisify } = require('util');
const { exec, spawn } = require('child_process');
const ncp = require('ncp');
const spawnAsync = require('@expo/spawn-async')

const copyAsync = promisify(ncp);
const execAsync = promisify(exec);

async function runDeploy(options, cwd) {
  const { env } = options;

  const appJson = process.cwd() + '/app.json';
  const fileToCopy = `./config/exp-${env}.json`;

  await copyAsync(fileToCopy, appJson);
  let expResponse = await spawnAsync('exp', ['publish']);
  console.log('expResponse', expResponse)
}

module.exports = runDeploy;
