# exp-deploy-cli

[![Build Status](https://travis-ci.org/preposterous/exp-deploy-cli.svg?branch=master)](https://travis-ci.org/preposterous/exp-deploy-cli)
[![NPM Version](https://badge.fury.io/js/exp-deploy-cli.svg)](https://badge.fury.io/js/exp-deploy-cli)

## Features
- Automated deployments of Expo (React Native) projects
- Multi-environment app.json support
- Release History
  - Rollback to an old version via git tags

## Install

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

For more information go to https://github.com/preposterous/exp-depoloy-cli
```
