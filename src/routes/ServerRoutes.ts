/// <reference path="../../typings/tsd.d.ts" />
import Hapi = require('hapi');
import UserRoutes = require('./user.routes');
import ItemSetDetailsRoutes = require('./itemSetDetails.routes');

export function RegisterRoutes(server: Hapi.Server): void {
	let routes: Hapi.IRouteConfiguration[] = [].concat(
		UserRoutes.getRoutes(),
		ItemSetDetailsRoutes.getRoutes()
	);
	server.route(routes);
}