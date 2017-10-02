const { promisify } = require('util');
const exec = require('child_process').exec;
const ncp = require('ncp');
const copyAsync = promisify(ncp);
const execAsync = promisify(exec)

async function runDeploy (options, cwd) {
  const { env } = options

  const appJson = process.cwd() + '/app.json';
  const fileToCopy = `./config/exp-${env}.json`;

  await copyAsync(fileToCopy, appJson)
  const {err, stdout, stderr} = await exec('exp publish')
  console.log('err', err)
  console.log('stdout', stdout)
  console.log('stderr', stderr)
}

module.exports = runDeploy
