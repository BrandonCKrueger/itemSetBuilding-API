/// <reference path="../../typings/tsd.d.ts" />
import Hapi = require('hapi');
import UserRoutes = require('./user.routes');
import ItemSetDetailsRoutes = require('./itemSetDetails.routes');
import ExportBuildRoutes = require('./exportBuild.routes');

export function RegisterRoutes(server: Hapi.Server): void {
	let routes: Hapi.IRouteConfiguration[] = [].concat(
		UserRoutes.getRoutes(),
		ItemSetDetailsRoutes.getRoutes(),
		ExportBuildRoutes.getRoutes()
	);
	server.route(routes);
}