# exp-deploy-cli

[![npm version](https://badge.fury.io/js/exp-deploy-cli.svg)](https://badge.fury.io/js/exp-deploy-cli)
[![Build Status](https://travis-ci.org/preposterous/exp-deploy-cli.svg?branch=master)](https://travis-ci.org/preposterous/exp-deploy-cli)

## Features
- Automated deployments of Expo (React Native) projects
- Multi-environment app.json support
- Release History
  - Rollback to an old version via git tags

## Instructions
- `exp-deploy` requires a `config` folder with a copy of `app.json`. Create the following:
  - `config/exp-development.json`
  - `config/exp-production.json`
- If  you'd like to store environment variables, create a `config` object next to `expo` within `app.json`:
  ```json
  "config": {
    "apiUrl": "https://api.mysite.com",
    "sentryApiKey": "xyz"
  },
  "expo": {
  }
  ```
- Running `exp-deploy --production` will now do the following:
  - copy `config/exp-production.json` over into `app.json`
  - ask you if the values look correct
  - run `exp publish`
  - reset app.json to the previous state

```sh
yarn global add exp-deploy-cli
```

```sh
npm install -g exp-deploy-cli
```

## Usage

```
Usage: exp-deploy [command]

Commands:
  config                   Initial Config Setup
  deploy <env>             Deploy to specific environment [staging, production]
  releases                 See a list of past releases
  rollback <env> <version> Rollback to a specific version

Options:
  --help  Show help                                                    [boolean]

Examples:
  exp-deploy config
  exp-deploy --env production
  exp-deploy --env staging

For more information go to https://github.com/preposterous/exp-deploy-cli
```

## Philosophy /  Idea
- exp doesn't support dev. vs prod environments so lets try and make it work on our own
- create a `config` folder and place `exp-development.json` and `exp-production.json`
- within your `app.json` create a `config` object to store your api keys, etc. in
- run `exp-deploy config` which will:
  - run interactive shell
  - check for `config` folder. If doesn't exist, create it
  - copy over `app.json` into `exp-development.json` and `exp-production.json`
  - ask user for any specific api keys they would like to separate
- run `exp-deploy --production` which will:
  - check whether config/exp-production.json exists
  - copy it over into your main app.json
  - bumps the version number (or npm version patch) by default
  - save the version number, commit it including creating a tag
  - save the release into a `releases.json` file
- run `exp-deploy releases` which will:
  - look up `releases.json` with every released version
    - ties in git tag / release to what's been deployed
- run `exp-deploy rollback` which will:
  - look into `releases.json` and asks you interactively to choose a version to roll back to
  - will check out the git tag and roll back your deploy to that specific version
