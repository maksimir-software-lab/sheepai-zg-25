import {
	boolean,
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const testItems = pgTable("test_items", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	count: integer("count").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
