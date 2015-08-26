/// <reference path="../../../typings/tsd.d.ts" />
import Promise = require('bluebird');
import dbConnection = require('../dbConnection');
import IItemSetDetails = require('./itemSetDetails.interface');
import Mongo = require('mongodb');

export function getMethods(): Object {
	let collectionMethods: Object = {
		getItemSetDetails: getItemSetDetails
	};
	return collectionMethods;
}

function getItemSetDetails(queryOptions: IItemSetDetails.IQueryOptions): any {
	return new Promise(function(resolve: any, reject: any): any {
        dbConnection.getConnection().then(function(db: any): void {
			let query: IItemSetDetails.IQueryOptions = craftQuery(queryOptions);
			if (!query) {
				reject('Invalid query parameters');
			} else {
				db.itemSetDetails.find(query).toArray(function(error: any, result: IItemSetDetails.IItemSetData): void {
					if (error) {
						reject(error);
					} else if (!result) {
						reject('No builds found');
					} else {
						resolve(result);
					}
				});
			}
		}).catch(function(error: any): void {
			reject(error);
		});
    });
}

// private functions
function craftQuery(queryOptions: IItemSetDetails.IQueryOptions): IItemSetDetails.IQueryOptions {
	let query: IItemSetDetails.IQueryOptions = null;
	if (queryOptions) {
		query = {};
		if (queryOptions.itemSetId) {
			query['_id'] = new Mongo.ObjectID(queryOptions.itemSetId);
		}
		if (queryOptions.championId) {
			query['champion.championId'] = queryOptions.championId;
		}
		if (queryOptions.championId) {
			query['who.public'] = queryOptions.isPublic;
		}
		if (queryOptions.userId) {
			query['who.createdBy.userId'] = queryOptions.userId;
		}
		if (queryOptions.userName) {
			query['who.createdBy.userName'] = queryOptions.userName;
		}
	}
	return query;
}