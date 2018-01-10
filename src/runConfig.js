'use strict'

const chalk = require('chalk')
const exec = require('child_process').exec
const { promisify } = require('util')
const fs = require('fs')
const jsonFile = require('jsonfile')
const mkdirp = require('mkdirp')
const ncp = require('ncp')
const Table = require('cli-table')

const table = new Table({
  head: ['Env', 'Filename', 'Version', 'Name', 'Slug']
})

const copyAsync = promisify(ncp)
const log = console.log

const CONFIG_FIELDS = ['name', 'privacy', 'slug', 'scheme', 'version']

const defaultEnvs = [
  {
    name: 'Production',
    append: ''
  },
  {
    name: 'Development',
    append: '-staging'
  }
]

function parseAppJson(env) {
  const file = jsonFile.readFileSync('app.json')

  if (!file) {
    log(chalk.red(`[exp-deploy config] Error: app.json doesn't exist`))
    process.exitCode = 1
    return
  }

  const { expo } = file
  let envs = defaultEnvs
  if (env) {
    envs = [
      {
        name: env,
        append: ''
      }
    ]
  }
  copyAppJsonToConfig(file, envs)
}

async function copyAppJsonToConfig(file, envs) {
  try {
    envs.map(env => {
      const appJson = Object.assign({}, file)

      appJson.expo.name = file.expo.name + env.append
      appJson.expo.slug = file.expo.slug + env.append

      const fileName = `./config/exp-${env.name.toLowerCase()}.json`

      table.push([
        env.name,
        fileName,
        appJson.expo.version,
        appJson.expo.name,
        appJson.expo.slug
      ])

      fs.writeFileSync(fileName, JSON.stringify(appJson, null, 2), 'utf-8')
    })

    console.log(table.toString())

    log(chalk.green('[exp-deploy config]: All done! Check your config folder'))
    process.exit(0)
  } catch (err) {
    log(chalk.red('Copying files failed: ', err))
    process.exitCode = 1
    return
  }
}

function runConfig(options, cwd) {
  const { env } = options

  if (fs.existsSync(cwd + '/config')) {
    log(chalk.green('[exp-deploy config]: config folder exists'))
  } else {
    log(chalk.green(`[exp-deploy config]: creating config folder`))
    mkdirp('./config')
  }

  parseAppJson(env)
}

module.exports = runConfig
