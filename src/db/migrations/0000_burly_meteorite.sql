CREATE TABLE "test_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
