export type ArticlePopularityStats = {
	articleId: string;
	totalEngagements: number;
	likes: number;
	dislikes: number;
	opens: number;
	likeRatio: number;
	trendingScore: number;
};

export type PopularityOptions = {
	trendingWindowHours?: number;
};
