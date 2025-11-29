import { relations } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	vector,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: varchar("id", { length: 255 }).primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const articles = pgTable(
	"articles",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: varchar("title", { length: 500 }).notNull(),
		summary: text("summary").notNull(),
		keyFacts: text("key_facts").array().notNull(),
		content: text("content").notNull(),
		embedding: vector("embedding", { dimensions: 2000 }).notNull(),
		sourceUrl: varchar("source_url", { length: 2048 }).notNull().unique(),
		publishedAt: timestamp("published_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("articleEmbeddingIndex").using(
			"hnsw",
			table.embedding.op("vector_cosine_ops"),
		),
	],
);

export const tags = pgTable("tags", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 100 }).notNull().unique(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articleTags = pgTable("article_tags", {
	articleId: uuid("article_id")
		.notNull()
		.references(() => articles.id, { onDelete: "cascade" }),
	tagId: uuid("tag_id")
		.notNull()
		.references(() => tags.id, { onDelete: "cascade" }),
});

export const userTagInterests = pgTable("user_tag_interests", {
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	tagId: uuid("tag_id")
		.notNull()
		.references(() => tags.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userInterests = pgTable(
	"user_interests",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		embedding: vector("embedding", { dimensions: 2000 }).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("userInterestEmbeddingIndex").using(
			"hnsw",
			table.embedding.op("vector_cosine_ops"),
		),
	],
);

export const engagementEventType = pgEnum("engagement_event_type", [
	"open",
	"expand_summary",
	"like",
	"dislike",
	"scroll",
]);

export const engagementEvents = pgTable("engagement_events", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	articleId: uuid("article_id")
		.notNull()
		.references(() => articles.id, { onDelete: "cascade" }),
	eventType: engagementEventType("event_type").notNull(),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfiles = pgTable(
	"user_profiles",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.unique()
			.references(() => users.id, { onDelete: "cascade" }),
		embedding: vector("embedding", { dimensions: 2000 }).notNull(),
		engagementCount: integer("engagement_count").default(0).notNull(),
		lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("userProfileEmbeddingIndex").using(
			"hnsw",
			table.embedding.op("vector_cosine_ops"),
		),
	],
);

export const usersRelations = relations(users, ({ many, one }) => ({
	interests: many(userInterests),
	tagInterests: many(userTagInterests),
	engagementEvents: many(engagementEvents),
	profile: one(userProfiles),
}));

export const articlesRelations = relations(articles, ({ many }) => ({
	engagementEvents: many(engagementEvents),
	articleTags: many(articleTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	articleTags: many(articleTags),
	userInterests: many(userTagInterests),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
	article: one(articles, {
		fields: [articleTags.articleId],
		references: [articles.id],
	}),
	tag: one(tags, {
		fields: [articleTags.tagId],
		references: [tags.id],
	}),
}));

export const userTagInterestsRelations = relations(
	userTagInterests,
	({ one }) => ({
		user: one(users, {
			fields: [userTagInterests.userId],
			references: [users.id],
		}),
		tag: one(tags, {
			fields: [userTagInterests.tagId],
			references: [tags.id],
		}),
	}),
);

export const userInterestsRelations = relations(userInterests, ({ one }) => ({
	user: one(users, {
		fields: [userInterests.userId],
		references: [users.id],
	}),
}));

export const engagementEventsRelations = relations(
	engagementEvents,
	({ one }) => ({
		user: one(users, {
			fields: [engagementEvents.userId],
			references: [users.id],
		}),
		article: one(articles, {
			fields: [engagementEvents.articleId],
			references: [articles.id],
		}),
	}),
);

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
	user: one(users, {
		fields: [userProfiles.userId],
		references: [users.id],
	}),
}));
