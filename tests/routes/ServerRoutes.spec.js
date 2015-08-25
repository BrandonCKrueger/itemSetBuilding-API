/// <reference path="../../typings/tsd.d.ts"/>
'use strict';

// Testing frameworks
var chai = require('chai'),
	should = chai.should(),
	sinon = require('sinon');
	
// Modules to be mocked
var accountRoutes = require('../../dest/routes/account.routes');

// Module to be tested
var serverRoutes = require('../../dest/routes/ServerRoutes');
	
describe('routes.ServerRoutes', function() {
	
	it('should create an array of routes', function() {
		// Arrange
		var server = {
			route: sinon.spy()
		};
		var accountRoutesData = [
			{
				method: 'GET',
				path: '/',
				handler: function(){}
			}
		];
		sinon.stub(accountRoutes, 'getRoutes', function() {
			return accountRoutesData;
		});
		
		// Act
		serverRoutes.RegisterRoutes(server);
		
		// Assert
		server.route.called.should.be.true;
		server.route.calledWith([].concat(accountRoutesData));
	});
});