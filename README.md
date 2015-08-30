## Riot Item Set Backend
This is the backend for the Item Set Builder created for Riot's API Challenege 2.0

### Requirements
---
* Have Node v0.12.7 or higher installed
* Have [MongoDB](https://www.mongodb.org/) installed and a local server running
* Have TypeScript 1.5.0-beta or higher installed globally (`npm i -g tsd typescript@^1.5.3-beta`)
* Code quality is maintained with the help of [TSLint](https://www.npmjs.com/package/tslint)

### Setup
---
* Run `git clone https://github.com/BrandonCKrueger/itemSetBuilding-API.git` to clone the repository
* Run `npm install` to install dependencies
* Run `tsd install` to install TypeScript typings dependencies (node, hapi, joi, bluebird, mongodb)
* Compile the TypeScript
  * From Terminal: `gulp'
  * From VSCode: `CMD + SHIFT + B` for Mac | `CTRL + SHIFT + B` for Windows
* Run `gulp develop` from the terminal, or debug from VSCode to start the server on port 3000

### Unit Tests
---
* Unit tests are done using [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/)
* Unit tests code quality is maintained with the help of [ESLint](http://eslint.org/)
* To run unit tests: `mocha "tests/**/*.spec.js"`
