/// <reference path="../../typings/tsd.d.ts" />
import hapi = require('hapi');
import accountRoutes = require('./account.routes');

export function RegisterRoutes(server: hapi.Server): void {
	let routes: hapi.IRouteConfiguration[] = [].concat(
		accountRoutes.getRoutes()
	);
	server.route(routes);
}