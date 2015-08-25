/// <reference path="../../typings/tsd.d.ts" />
import Hapi = require('hapi');
import Joi = require('joi');
import Database = require('../database/index');
import UserCollection = require('../database/collections/users');

let db: Database.Database;

export function getRoutes(): Hapi.IRouteConfiguration[] {
    db = new Database.Database();
    let routes: Hapi.IRouteConfiguration[] = [
        {
            method: 'POST',
            path: '/register',
            handler: register,
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email(),
                        password: Joi.string()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/login',
            handler: login,
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email(),
                        password: Joi.string()
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
            path: '/logout',
            handler: logout,
            config: {
                auth: 'session'
            }
        }
    ];
    return routes;
}

// private functions
function register(request: Hapi.Request, reply: Hapi.IReply): void {
    let user: any = {
        email: request.payload.email,
        password: request.payload.password
    };

    db.users.register(user).then(function(response: UserCollection.User): void {
        reply(response);
    }).catch(function(error: any): void {
        reply(error);
    });
}

function login(request: Hapi.Request, reply: Hapi.IReply): void {
    if (request.auth.isAuthenticated) {
        reply('Already authenticated');
    } else {

        let user: any = {
            email: request.payload.email,
            password: request.payload.password
        };

        db.users.validate(user).then(function(response: UserCollection.User): void {
            request.auth.session.set(response);
            reply(response);
        }).catch(function(error: any): void {
            reply(error);
        });
    }
}

function logout(request: Hapi.Request, reply: Hapi.IReply): void {
    request.auth.session.clear();
    reply('Logged out');
}