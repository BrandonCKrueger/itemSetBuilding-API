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
            handler: registerHandler,
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
            handler: loginHandler,
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
            handler: logoutHandler,
            config: {
                auth: 'session'
            }
        }
    ];
    return routes;
}

// private functions
function registerHandler(request: Hapi.Request, reply: Hapi.IReply): void {
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

function loginHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    if (request.auth.isAuthenticated) {
        reply('Already authenticated');
    } else {

        let user: any = {
            email: request.payload.email,
            password: request.payload.password
        };

        db.users.validate(user).then(function(response: UserCollection.User): void {
            let user: any = {
                id: response._id,
                username: response.username,
                email: response.email
            };
            request.auth.session.set(user);
            reply(user);
        }).catch(function(error: any): void {
            reply(error);
        });
    }
}

function logoutHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    request.auth.session.clear();
    reply('Logged out');
}