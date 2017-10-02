const { promisify } = require('util');
const { exec, spawn } = require('child_process');
const ncp = require('ncp');

const copyAsync = promisify(ncp);
const execAsync = promisify(exec);
const spawnAsync = promisify(spawn);

async function runDeploy(options, cwd) {
  const { env } = options;

  const appJson = process.cwd() + '/app.json';
  const fileToCopy = `./config/exp-${env}.json`;

  await copyAsync(fileToCopy, appJson);
  const cmdExpPublish = spawn('exp', ['publish']);

  cmdExpPublish.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  cmdExpPublish.stdout.on('error', function(data) {
    console.log(data.toString());
  });

  cmdExpPublish.stderr.on('data', function(data) {
    console.log(data.toString());
  });

  cmdExpPublish.on('exit', function(code) {
    console.log(code.toString());
  });
}

module.exports = runDeploy;
