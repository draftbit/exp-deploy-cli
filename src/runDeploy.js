const { promisify } = require('util');
const { exec, spawn } = require('child_process');
const ncp = require('ncp');
const spawnAsync = require('@expo/spawn-async')
const Ora = require('ora');

const copyAsync = promisify(ncp);
const execAsync = promisify(exec);

const spinner = new Ora({
  text: 'Deploying...',
  spinner: 'pong'
});

async function runDeploy(options, cwd) {
  spinner.start()
  const { env } = options;

  spinner.text = `Copying files over for ${env}`
  const appJson = cwd + '/app.json'
  const fileToCopy = `./config/exp-${env}.json`;
  await copyAsync(fileToCopy, appJson);

  spinner.text = 'Running exp publish'
  let expResponse = await spawnAsync('exp', ['publish']);

  spinner.text = `Resetting app.json`
  let gitResponse = await spawnAsync('git', ['checkout', 'app.json'])
  spinner.succeed();
}

module.exports = runDeploy;
