const { promisify } = require('util');
const { exec, spawn } = require('child_process');
const ncp = require('ncp');

const copyAsync = promisify(ncp);
const execAsync = promisify(exec);
const spawnAsync = promisify(spawn);

async function runDeploy (options, cwd) {
  const { env } = options

  const appJson = process.cwd() + '/app.json';
  const fileToCopy = `./config/exp-${env}.json`;

  await copyAsync(fileToCopy, appJson)
  const runExpPublish = spawn('exp publish')

  runExpPublish.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  runExpPublish.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  runExpPublish.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });
}

module.exports = runDeploy
