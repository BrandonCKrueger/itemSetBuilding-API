/// <reference path="../../../typings/tsd.d.ts" />
import Promise = require('bluebird');
import dbConnection = require('../dbConnection');
let Bcrypt: any = require('bcrypt');

export class User {
	email: string;
	password: string;
}

export function getMethods(): Object {
	let collectionMethods: Object = {
		validate: validate,
		register: register
	};
	return collectionMethods;
}

function validate(user: User): any {
	return new Promise(function(resolve: any, reject: any): any {
        dbConnection.getConnection().then(function(db: any): void {
			db.users.findOne({ email: user.email }).then(function(document: User): void {
				if (!document) {
					reject('Invalid username or password');
				} else {
					Bcrypt.compare(user.password, document.password, function (bcryptError: any, isValid: boolean): void {
						if (isValid) {
							resolve(document); // todo: remove password from user object
						} else {
							reject('Invalid username or password');
						}
					});
				}
			}).catch(function(error: any): void {
				reject(error);
			});
		}).catch(function(error: any): void {
			reject(error);
		});
    });
}

function register(user: User): any {
	return new Promise(function(resolve: any, reject: any): any {
		dbConnection.getConnection().then(function(db: any): void {
			db.users.findOne({ email: user.email}).then(function(document: User): void {
				if (document) {
					reject('There is already an account associated with that email');
				} else {
					Bcrypt.genSalt(10, function(saltError: any, salt: string): void {
						Bcrypt.hash(user.password, salt, function(hashError: any, hashPassword: string): void {
							user.password = hashPassword;
							db.users.insert(user, function(insertError: any, record: User): void {
								if (insertError) {
									reject(insertError);
								} else {
									resolve(record);
								}
							});
						});
					});
				}
			}).catch(function(error: any): void {
				reject(error);
			});
		});
	});
}