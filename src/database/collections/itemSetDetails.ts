/// <reference path="../../../typings/tsd.d.ts" />
import Promise = require('bluebird');
import dbConnection = require('../dbConnection');
import IItemSetDetails = require('./itemSetDetails.interface');
import Mongo = require('mongodb');

export function getMethods(): Object {
	let collectionMethods: Object = {
		getItemSetDetails: getItemSetDetails,
		insertItemSetData: insertItemSetData,
		updateItemSetData: updateItemSetData
	};
	return collectionMethods;
}

function getItemSetDetails(query: any, projection?: any, options?: IItemSetDetails.IQueryOptions, requestor?: string): any {
	return new Promise(function(resolve: any, reject: any): any {
        dbConnection.getConnection().then(function(db: any): void {
			if (!query) { query = {}; }
			if (!projection) {
				projection = {
					'itemSetDetails': 1,
					'who': 1,
					'champion': 1,
					'averageRating': 1,
					'commentCount': 1,
					'ratings': { $elemMatch: { user: requestor } },
					'comments': { $elemMatch: { user: requestor } }
				};
			}
			let results: any = db.itemSetDetails.find(query, projection);
			results = applyOptions(results, options);
			results.toArray(function(error: any, result: IItemSetDetails.IItemSetData): void {
				if (error) {
					reject(error);
				} else if (!result) {
					reject('No builds found');
				} else {
					resolve(result);
				}
			});
		}).catch(function(error: any): void {
			reject(error);
		});
    });
}

function insertItemSetData(itemSetData: IItemSetDetails.IItemSetData): any {
	return new Promise(function(resolve: any, reject: any): any {
        dbConnection.getConnection().then(function(db: any): void {
			db.itemSetDetails.insert(itemSetData, function(insertError: any, record: IItemSetDetails.IItemSetData): void {
				if (insertError) {
					reject(insertError);
				} else {
					resolve(record);
				}
			});
		}).catch(function(error: any): void {
			reject(error);
		});
    });
}

function updateItemSetData(buildId: string, itemSetDetails: IItemSetDetails.IItemSetDetails, userId: string): any {
	return new Promise(function(resolve: any, reject: any): any {
        dbConnection.getConnection().then(function(db: any): void {
			db.itemSetDetails.findOne({'_id': new Mongo.ObjectID(buildId)}).then(function(result: IItemSetDetails.IItemSetData): void {
				if (!result) {
					reject('No builds found');
				} else {
					if (result.who && result.who.createdBy && result.who.createdBy.userId === userId) {
						result.itemSetDetails = itemSetDetails;
						result.who.lastEdit = new Date();

						db.itemSetDetails.save(result, {w: 1}, function(updateError: any, record: IItemSetDetails.IItemSetData): void {
							if (updateError) {
								reject(updateError);
							} else {
								resolve(record);
							}
						});
					} else {
						reject('Do are not the owner of this item build');
					}
				}
			}).catch(function(error: any): void {
				reject(error);
			});
		}).catch(function(error: any): void {
			reject(error);
		});
    });
}

// private functions
function applyOptions(data: any, options: IItemSetDetails.IQueryOptions): any {
	if (options) {
		if (typeof options.limit === 'number' && options.limit > 0 && options.limit < 25) {
			data.limit(options.limit);
		} else {
			data.limit(25);
		}

		if (options.skip) {
			data.skip(options.skip);
		}

		if (options.sort) {
			data.sort(options.sort);
		}
	}
	return data;
}