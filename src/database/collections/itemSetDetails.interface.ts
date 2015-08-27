/// <reference path="../../../typings/tsd.d.ts" />

export interface IQueryOptions {
	limit?: number;
	skip?: number;
	sort?: {
		key?: string;
		direction?: string;
	};
}

export interface IItemSetData {
	itemSetDetails: IItemSetDetails;
	who: IItemSetDataWho;
	champion: IItemSetDataChampion;
	averageRating?: number;
	ratings?: IItemSetDataSocialRatings[];
	commentCount?: number;
	comments?: IItemSetDataSocialComments[];
}

export interface IItemSetDataChampion {
	championId: number;
	championName: string;
}

export interface IItemSetDataWho {
	lastEdit: Date;
	createdDate: Date;
	createdBy: {
		userId: string;
		user: string;
	};
	public: boolean;
}

export interface IItemSetDataSocialComments {
	user: string;
	createdDate: Date;
	comment: string;
}

export interface IItemSetDataSocialRatings {
	user: string;
	rating: Date;
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