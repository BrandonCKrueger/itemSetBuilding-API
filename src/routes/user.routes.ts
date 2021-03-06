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
                        password: Joi.string(),
                        username: Joi.string()
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
        },
        {
            method: 'GET',
            path: '/getCredentials',
            handler: getCredentialsHandler,
            config: {
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
        }
    ];
    return routes;
}

// private functions
function registerHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let user: any = {
        email: request.payload.email,
        password: request.payload.password,
        username: request.payload.username
    };

    db.users.register(user).then(function(response: any): void {
        let user: any = {
            id: response.ops[0]._id,
            username: response.ops[0].username,
            email: response.ops[0].email
        };
        request.auth.session.set(user);
        reply(user);
    }).catch(function(error: any): void {
        reply({error: error});
    });
}

function loginHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    let user: any = null;
    if (request.auth.isAuthenticated) {
        user = {
            id: request.auth.credentials.id,
            username: request.auth.credentials.username,
            email: request.auth.credentials.email
        };
        reply(user);
    } else {
        let userToValidate: any = {
            email: request.payload.email,
            password: request.payload.password
        };

        db.users.validate(userToValidate).then(function(response: UserCollection.User): void {
            user = {
                id: response._id,
                username: response.username,
                email: response.email
            };
            request.auth.session.set(user);
            reply(user);
        }).catch(function(error: any): void {
            reply(error).code(500);
        });
    }
}

function logoutHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    request.auth.session.clear();
    reply('Logged out');
}

function getCredentialsHandler(request: Hapi.Request, reply: Hapi.IReply): void {
    reply(request.auth.credentials);
}