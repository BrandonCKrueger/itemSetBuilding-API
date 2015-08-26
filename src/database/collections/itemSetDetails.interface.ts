/// <reference path="../../../typings/tsd.d.ts" />

export interface IQueryOptions {
	itemSetId?: string;
	championId?: number;
	isPublic?: boolean;
	userId?: number;
	userName?: string;
}

export interface IItemSetData {
	itemSetDetails: IItemSetDetails;
	who: IItemSetDataWho;
	champion: IItemSetDataChampion;
}

export interface IItemSetDataChampion {
	championId: number;
	championName: string;
}

export interface IItemSetDataWho {
	lastEdit: Date;
	createdDate: Date;
	createdBy: {
		userId: number;
		user: string;
	};
	public: boolean;
	editable: boolean;
}

export interface IItemSetDetails  {
	title: string;
    type: string;
    map: string;
    mode: string;
    priority: boolean;
    sortrank: number;
    blocks: IBlock[];
}

export interface IBlock {
	type: string;
	recMath: boolean;
	minSummonerLevel: number;
	maxSummonerLevel: number;
	showIfSummonerSpell: string;
	hideIfSummonerSpell: string;
	items: IItem[];
}

export interface IItem {
	id: number;
	count: number;
}