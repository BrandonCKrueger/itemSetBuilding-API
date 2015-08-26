/// <reference path="../../typings/tsd.d.ts" />
import mongodb = require('mongodb');
import Promise = require('bluebird');
import Configuration = require('../server.config');

let mongoUrl: string = Configuration.settings.database.mongoUrl;
let myDb: any = null;

export function getConnection(): any {
    return new Promise(function(resolve: any, reject: any): any {
        if (!myDb) {
    		mongodb.MongoClient.connect(mongoUrl, function(error: any, db: mongodb.Db): void{
                if (error) {
    				reject(error);
                } else {
                    myDb = {
                        db: db,
                        users: db.collection('Users'),
                        itemSetDetails: db.collection('ItemSetDetails')
                    };
                    resolve(myDb);
                }
            });
    	} else {
            resolve(myDb);
        }
    });
}