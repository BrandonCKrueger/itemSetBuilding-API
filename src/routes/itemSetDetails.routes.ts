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
        },
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
            method: 'POST',
            path: '/api/itemSetBuild',
            handler: insertItemSetHandler,
            config: {
                auth: 'session',
                validate: {
                    payload: {
                        itemSetDetails: {
                            title: Joi.string().required(),
                            type: Joi.string().required(),
                            map: Joi.string().required(),
                            mode: Joi.string().required(),
                            priority: Joi.boolean().required(),
                            sortrank: Joi.number().required()
                        },
                        champion: {
                            championId: Joi.number().required(),
                            championName: Joi.string().required()
                        }
                    }
                }
            }
        },
        {
            method: 'PUT',
            path: '/api/itemSetBuild/{buildId}',
            handler: updateItemSetHandler,
            config: {
                auth: 'session',
                validate: {
                    params: {
                        buildId: Joi.string()
                    },
                    payload: {
                        itemSetDetails: {
                            title: Joi.string().required(),
                            type: Joi.string().required(),
                            map: Joi.string().required(),
                            mode: Joi.string().required(),
                            priority: Joi.boolean().required(),
                            sortrank: Joi.number().required(),
                            blocks: Joi.array().optional()
                        }
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

function insertItemSetHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    if (!request.auth.isAuthenticated) {
        reply('You need to be logged in to save item builds').code(401);
    } else {
        let itemSetData: IItemSetDetails.IItemSetData = {
            itemSetDetails: request.payload.itemSetDetails,
            champion: request.payload.champion,
            who: {
                lastEdit: new Date(),
                createdDate: new Date(),
                createdBy: {
                    userId: request.auth.credentials.id,
                    user: request.auth.credentials.username
                },
                public: false
            }
        };

        db.itemSetDetails.insertItemSetData(itemSetData).then(function(response: any): void {
            reply(response);
        }).catch(function(error: any): void {
            reply(error);
        });
    }
}

function updateItemSetHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let buildId: string = request.params['buildId'];
    let itemSetDetails: IItemSetDetails.IItemSetDetails = request.payload.itemSetDetails;
    let user: string = request.auth.credentials.id;

    db.itemSetDetails.updateItemSetData(buildId, itemSetDetails, user).then(function(response: any): void {
        reply(response);
    }).catch(function(error: any): void {
        reply(error);
    });
}
