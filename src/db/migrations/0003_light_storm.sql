CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"embedding" vector(3072) NOT NULL,
	"engagement_count" integer DEFAULT 0 NOT NULL,
	"last_updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "userProfileEmbeddingIndex" ON "user_profiles" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "articleEmbeddingIndex" ON "articles" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "userInterestEmbeddingIndex" ON "user_interests" USING hnsw ("embedding" vector_cosine_ops);