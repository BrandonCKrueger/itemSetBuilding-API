/// <reference path="../../typings/tsd.d.ts" />
import UserCollection = require('../database/collections/users');
import ItemSetDetailsCollection = require('../database/collections/itemSetDetails');

export class Database {
	public users: any;
	public itemSetDetails: any;

	constructor() {
		this.users = UserCollection.getMethods();
		this.itemSetDetails = ItemSetDetailsCollection.getMethods();
	}
}