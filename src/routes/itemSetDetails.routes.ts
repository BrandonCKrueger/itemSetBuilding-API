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
            path: '/api/itemSetBuilds',
            handler: itemSetBuildsHandler,
            config: {
                validate: {
                    query: {
                        championId: Joi.number().integer().optional(),
                        userId: Joi.number().integer().optional(),
                        userName: Joi.string().optional()
                    }
                },
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/api/itemSetBuilds',
            handler: itemSetBuildsHandler,
            config: {
                validate: {
                    query: {
                        championId: Joi.number().integer().optional(),
                        userId: Joi.number().integer().optional(),
                        userName: Joi.string().optional()
                    },
                    payload: {
                        options: {
                            limit: Joi.number().integer().optional(),
                            skip: Joi.number().integer().optional(),
                            sort: {
                                field: Joi.string().optional(),
                                direction: Joi.number().integer().optional()
                            }
                        }
                    }
                },
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
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
                },
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/api/itemSetBuild',
            handler: insertItemSetHandler,
            config: {
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
                },
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: 'PUT',
            path: '/api/itemSetBuild/{buildId}',
            handler: updateItemSetHandler,
            config: {
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
                },
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/api/itemSetBuild/{buildId}/comments',
            handler: itemSetBuildCommentsHandler,
            config: {
                validate: {
                    params: {
                        buildId: Joi.string()
                    },
                    query: {
                        sliceStart: Joi.number().integer().optional(),
                        sliceLength: Joi.number().integer().optional()
                    }
                },
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
    ];
    return routes;
}

function itemSetBuildsHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let requestor: string = null;
    let query: any = {};
    let options: any = {};
    if (request.query) {
        if (request.query.championId) {
            query['champion.championId'] = request.query.championId;
        }
        if (request.query.userId) {
            query['who.createdBy.userId'] = request.query.userId;
        }
        if (request.query.userName) {
            query['who.createdBy.user'] = request.query.userName;
        }
    }
    if (request.payload) {
        options = request.payload.options;
    }
    if (request.auth && request.auth.credentials && request.auth.credentials.username) {
        requestor = request.auth.credentials.username;
    }
    db.itemSetDetails.getItemSetDetails(query, null, options, requestor).then(function(response: any): void {
        reply(response);
    }).catch(function(error: any): void {
        reply(error);
    });
}

function itemSetBuildHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let requestor: string = null;
    let query: any = {};
    if (request.params) {
        query = {
            '_id': new Mongo.ObjectID(request.params['buildId'])
        };
    }
    if (request.auth && request.auth.credentials && request.auth.credentials.username) {
        requestor = request.auth.credentials.username;
    }
    db.itemSetDetails.getItemSetDetails(query, null, null, requestor).then(function(response: any): void {
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

function itemSetBuildCommentsHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let query: any = {
        '_id': new Mongo.ObjectID(request.params['buildId'])
    };
    let projection: any = null;
    if (request.query) {
        let startSlice: number = request.query.sliceStart || 0;
        let sliceLength: number = request.query.sliceLength || 10;
        projection = {
            '_id': 1,
            'comments': {
                '$slice': [startSlice, (startSlice + sliceLength)]
            }
        };
    }
    db.itemSetDetails.getItemSetDetails(query, projection).then(function(response: any): void {
        reply(response);
    }).catch(function(error: any): void {
        reply(error);
    });
}