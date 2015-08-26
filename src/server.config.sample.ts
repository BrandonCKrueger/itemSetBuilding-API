export interface IConfigSettings {
	cookie: ICookie;
	database: IDatabase;
}

export interface ICookie {
	cookie: string;
	password: string;
	ttl?: string;
	domain?: string;
	path?: string;
	clearInvalid?: boolean;
	keepAlive?: boolean;
	isSecure?: boolean;
	isHttpOnly?: boolean;
	redirectTo?: string;
	appendNext?: boolean;
	redirectOnTry?: boolean;
	validateFunc?: (request: any, session: any, callback: (err: any, isValid: any, credentials: any) => void) => void;
};
export interface IDatabase {
	mongoUrl: string;
	username?: string;
	password?: string;
	database?: string;
	host?: string;
	port?: string;
}

let cookie: ICookie = {
	cookie: '', // cookie name
	password: '', // iron encryption password
	redirectTo: '/login', // authentication redirect
    isSecure: false
};

let database: IDatabase = {
	mongoUrl: null, // complete mongoDB url
	username: '', // database admin username
	password: '', // database admin password
	database: '', // database
	host: '', // mongoDB url (Ex: 1234.mongolab.com)
	port: '' // mongoDB por
};
if (!database.mongoUrl) {
	database.mongoUrl = 'mongodb://' +
		database.username + ':' + database.password + '@' +
		database.host + ':' + database.port + '/' + database.database;
}

export var settings: IConfigSettings = {
	cookie: cookie,
	database: database
};