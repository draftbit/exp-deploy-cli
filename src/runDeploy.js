const exec = require('child_process').exec;

function runDeploy (options) {
  console.log('deploying', options.production ? 'production' : 'development')
  exec('exp')
  console.log('done')
}

module.exports = runDeploy
