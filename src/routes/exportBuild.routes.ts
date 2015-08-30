/// <reference path="../../typings/tsd.d.ts" />
import Hapi = require('hapi');
import Joi = require('joi');
import Mongo = require('mongodb');
import Database = require('../database/index');
import IItemSetDetails = require('../database/collections/itemSetDetails.interface');

let db: Database.Database;

export function getRoutes(): Hapi.IRouteConfiguration[] {
    db = new Database.Database();
    let routes: Hapi.IRouteConfiguration[] = [
        {
            method: 'GET',
            path: '/api/exportBuild/{buildId}',
            handler: exportBuildHandler,
            config: {
                validate: {
                    params: {
                        buildId: Joi.string()
                    }
                }
            }
        }
    ];
    return routes;
}

// private functions
function exportBuildHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let query: any = {};
    if (request.params) {
        query = {
            '_id': new Mongo.ObjectID(request.params['buildId'])
        };
    }
    db.itemSetDetails.getItemSetDetails(query).then(function(result: any): void {
        let outputData: IItemSetDetails.IItemSetDetails = {
            title: result[0].itemSetDetails.title,
            type: result[0].itemSetDetails.type,
            map: result[0].itemSetDetails.map,
            mode: result[0].itemSetDetails.mode,
            priority: result[0].itemSetDetails.priority,
            sortrank: result[0].itemSetDetails.sortrank,
            blocks: result[0].itemSetDetails.blocks
        };
        reply(outputData).header('Content-disposition', 'attachment');
    }).catch(function(error: any): void {
        reply(error);
    });
}