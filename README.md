# exp-deploy-cli

[![npm version](https://badge.fury.io/js/exp-deploy-cli.svg)](https://badge.fury.io/js/exp-deploy-cli)
[![npm](https://img.shields.io/npm/dt/exp-deploy-cli.svg)](https://www.npmjs.com/package/exp-deploy-cli)

## Expo Release Channels

# [Expo just released (11/17/2017) beta support for Release Channels](https://blog.expo.io/expo-sdk-v23-0-0-is-now-available-be0a8c655414)

We strongly recommend moving forward with Expo's official supported implementation!

## About

Right now Expo doesn't support different deploy environments like staging and production. This is a simple tool to help mimic that environment by creating a copy of your `app.json` and adding a suffix to stuff like name and slug.

*Expo is working on supporting their own deployment environments. As soon as its released I'll update the repo to take you there instead*

[Orchard](https://www.orchard.ai) uses this on an daily basis to deploy their different environments

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
    "name": "MyAppName",
    "privacy": "unlisted",
    "slug": "my-app-name",
    "sdkVersion": "1.0.0",
    "scheme": "my-app-name",
    "version": "1.0.0",
  }
  ```
- Running `exp-deploy --production` will now do the following:
  - copy `config/exp-production.json` over into `app.json`
  - run `exp publish`
  - reset app.json to its previous state

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

Options:
  --help  Show help        [boolean]

Examples:
  exp-deploy config
  exp-deploy --env production
  exp-deploy --env staging
```

## Using Config Variables in your app

Since Expo doesn't give you access to Config via `Constants.manifest`, you can import the json file directly:

```es6
import App from './app.json'

const API_URL = App.config.apiUrl
```

## Future Api
- `exp config`
- `exp deploy`
- `exp releases`
- `exp rollback`

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
