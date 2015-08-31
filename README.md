## Riot Item Set Backend
This is the backend for the Item Set Builder created for Riot's API Challenge 2.0.  The associated frontend is located [here](https://github.com/BrandonCKrueger/itemSetBuilding)

This API is currently live at [api-itemsetbuilder.rhcloud.com](http://api-itemsetbuilder.rhcloud.com), hosted for free by [OpenShift](https://www.openshift.com/).  The MongoDB used in the live application is also hosted for free thanks to [MongoLabs](https://mongolab.com/).

The application is built using [TypeScript](http://www.typescriptlang.org) in conjunction with the [Hapi Framework](http://hapijs.com/) running on [NodeJS](https://nodejs.org/).  In addition, it uses a [MongoDB](https://www.mongodb.org/) to store and retrieve data.  The code is maintained using [TSLint](https://www.npmjs.com/package/tslint) for code linting, and [Mocha](http://mochajs.org/), [Chai](http://chaijs.com/), [Sinon](http://sinonjs.org/) for unit tests.  The API also uses [Gulp](http://gulpjs.com/) to handle transforming the TypeScript files into JavaScript files and building the server files.

### Endpoints
```
Path: /api/exportBuild/{buildId}
Method: GET
Returns: {buildId}.json Item Set file that can be imported into League of Legends
```
```
Path: /api/itemSetBuilds
Method: GET
Accepted Query Parameters (at least one is required):
* [string] championName - Name of the champion you want builds for
* [string] championId - ID of the champion you want builds for
* [string] userId - The user's account ID you want to get builds for
* [string] userName - The user's username you want to get builds for
Returns: list of item set builds, gets the first page with the default response limit (25)
```
```
Path: /api/itemSetBuilds
Method: POST
Accepted Query Parameters (at least one is required):
* [string] championName - Name of the champion you want builds for
* [string] championId - ID of the champion you want builds for
* [string] userId - The user's account ID you want to get builds for
* [string] userName - The user's username you want to get builds for
Payload Parameters (all options):
* [integer] limit - The number of responses you want returned (default & max of 25)
* [integer] skip - Number of builds to skip (default of 0)
* [hash] sort
  * [string] field - Field of item set to sort on
  * [integer] direction - Direction of sorting (-1 is descending, 1 is ascending)
Returns: A list of item set builds with the ability to specificy what range of builds returned
```
```
Path: /api/itemSetBuild/{buildId}
Method: GET
Returns: Item Set Build with ID equal to buildId
```

----

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
* Create a `server.config.ts` file based off the [`itemSetBuilding-API/src/server.config.sample.ts`](https://github.com/BrandonCKrueger/itemSetBuilding-API/blob/master/src/server.config.sample.ts) for a connection to your Mongo database
* Compile the TypeScript
  * From Terminal: `gulp'
  * From VSCode: `CMD + SHIFT + B` for Mac | `CTRL + SHIFT + B` for Windows
* Run `gulp develop` from the terminal, or debug from your IDE to start the server on port 3000

### Unit Tests
---
* Unit tests are done using [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/)
* Unit tests code quality is maintained with the help of [ESLint](http://eslint.org/)
* To run unit tests: `mocha "tests/**/*.spec.js"`
* Unit test coverage is currently pathetically low, but there are some unit tests to build on as an example
