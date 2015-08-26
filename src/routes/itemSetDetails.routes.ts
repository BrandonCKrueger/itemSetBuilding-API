/// <reference path="../../typings/tsd.d.ts" />
import Hapi = require('hapi');
import Joi = require('joi');
import Database = require('../database/index');
import IItemSetDetails = require('../database/collections/itemSetDetails.interface');

let db: Database.Database;

export function getRoutes(): Hapi.IRouteConfiguration[] {
    db = new Database.Database();
    let routes: Hapi.IRouteConfiguration[] = [
        {
            method: 'GET',
            path: '/api/itemSetBuild/{buildId}',
            handler: itemSetBuildHandler,
            config: {
                validate: {
                    params: {
                        buildId: Joi.string()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/api/itemSetBuilds',
            handler: itemSetBuildsHandler,
            config: {
                validate: {
                    query: {
                        championId: Joi.number().integer().optional(),
                        userId: Joi.number().integer().optional(),
                        userName: Joi.string().optional()
                    }
                }
            }
        }
    ];
    return routes;
}

function itemSetBuildHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let queryOptions: IItemSetDetails.IQueryOptions = {
        itemSetId: request.params['buildId']
    };
    db.itemSetDetails.getItemSetDetails(queryOptions).then(function(response: any): void {
        reply(response);
    }).catch(function(error: any): void {
        reply(error);
    });
}

function itemSetBuildsHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let queryOptions: IItemSetDetails.IQueryOptions = {};
    if (request.query) {
        if (request.query.championId) {
            queryOptions.championId = request.query.championId;
        }
        if (request.query.userId) {
            queryOptions.userId = request.query.userId;
        }
        if (request.query.userName) {
            queryOptions.userName = request.query.userName;
        }
        if (false) {
            // only get private item builds if they belong to the user
        }
    }
    db.itemSetDetails.getItemSetDetails(queryOptions).then(function(response: any): void {
        reply(response);
    }).catch(function(error: any): void {
        reply(error);
    });
}