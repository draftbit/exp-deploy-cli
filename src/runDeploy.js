const { copy } = require('fs-extra');
const { pour } = require('std-pour');
const chalk = require('chalk');
const log = console.log;

async function copyConfigToAppJsonAsync(cwd, env) {
  log('cwd', cwd);
  const appJson = cwd + '/app.json';
  const fileToCopy = `./config/exp-${env}.json`;

  try {
    await copy(fileToCopy, appJson);
  } catch (err) {
    log('Copy Error: err');
    throw new Error(
      `app.json and/or config don't exist. Are you sure you're in the right directory? Did you run [exp-deploy config] first?`
    );
  }
  return 0;
}

async function gitResetAppJsonAsync() {
  const code = await pour('git', ['checkout', 'app.json']);
  if (code !== 0) {
    throw new Error(`app.json doesn't seem to be within git. Maybe add it?`);
  }

  return 0;
}

async function runExpPublishAsync() {
  const code = await pour('exp', ['publish']);
  if (code !== 0) {
    throw new Error(
      `Something went wrong running [exp publish]. Take a look above!`
    );
  }

  return 0;
}

async function runDeploy(options, cwd) {
  const { env } = options;
  let code = 0;
  try {
    code = await copyConfigToAppJsonAsync(cwd, env);
    log('Copied app.json. Starting exp process:');
    log('--------------------------------------');
    code = await runExpPublishAsync();
    code = await gitResetAppJsonAsync();
  } catch (err) {
    log('--------------------------------------');
    log(err.message);
    process.exitCode = 1;
    return;
  }

  log('--------------------------------------');
  log('All done!');

  process.exitCode = 0;
  return;
}

module.exports = runDeploy;
