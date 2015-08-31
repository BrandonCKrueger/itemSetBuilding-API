/// <reference path="../typings/tsd.d.ts" />
import Hapi = require('hapi');
import ServerRoutes = require('./routes/ServerRoutes');
import Configuration = require('./server.config');
let HapiAuthCookie: any = require('hapi-auth-cookie');

// creating the hapi server instance
let server: Hapi.Server = new Hapi.Server();

// adding a new connection that can be listened on
server.connection({
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
  host: process.env.OPENSHIFT_NODEJS_IP || 'localhost',
  labels: ['web'],
  routes: {
    cors: {
      credentials: true
    }
  }
});

// enable hapi-auth-cookie
server.register(HapiAuthCookie, function(error: any): void {
  server.auth.strategy('session', 'cookie', false, Configuration.settings.cookie);
});

// defining our routes
ServerRoutes.RegisterRoutes(server);

// starting the server
server.start(function (err: any): void {
  if (err) {
    throw err;
  }
  console.log('hapi server started');
});