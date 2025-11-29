import { relations } from "drizzle-orm";
import {
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
	vector,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: varchar("id", { length: 255 }).primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 500 }).notNull(),
	summary: text("summary").notNull(),
	content: text("content").notNull(),
	embedding: vector("embedding", { dimensions: 3072 }).notNull(),
	sourceUrl: varchar("source_url", { length: 2048 }).notNull().unique(),
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userInterests = pgTable("user_interests", {
	id: serial("id").primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	embedding: vector("embedding", { dimensions: 3072 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const engagementEventType = pgEnum("engagement_event_type", [
	"open",
	"expand_summary",
	"like",
	"dislike",
	"scroll",
]);

export const engagementEvents = pgTable("engagement_events", {
	id: serial("id").primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	articleId: integer("article_id")
		.notNull()
		.references(() => articles.id, { onDelete: "cascade" }),
	eventType: engagementEventType("event_type").notNull(),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	interests: many(userInterests),
	engagementEvents: many(engagementEvents),
}));

export const articlesRelations = relations(articles, ({ many }) => ({
	engagementEvents: many(engagementEvents),
}));

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
