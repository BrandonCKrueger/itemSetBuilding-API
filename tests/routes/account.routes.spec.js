/// <reference path="../../typings/tsd.d.ts"/>
'use strict';

// Testing frameworks
var chai = require('chai'),
	should = chai.should();

// Module to be tested
var baseRoutes = require('../../dest/routes/account.routes');
	
describe('routes.account', function() {
	
	it('should create the account routes', function() {
		// Arrange
		
		// Act
		var routes = baseRoutes.getRoutes();
		
		// Assert
		routes.should.have.length.greaterThan(0);
		for(var i=0; i<routes.length; i++) {
			routes[i].should.have.property('method').which.is.a.String;
			routes[i].should.have.property('path').which.is.a.String;
			routes[i].should.have.property('handler').which.is.a.Function;
		}
	});
});