CREATE INDEX "articleTagsArticleIdIdx" ON "article_tags" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "articleTagsTagIdIdx" ON "article_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "articleTldrsArticleUserIdx" ON "article_tldrs" USING btree ("article_id","user_id");--> statement-breakpoint
CREATE INDEX "engagementEventsUserIdIdx" ON "engagement_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "engagementEventsArticleIdIdx" ON "engagement_events" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "engagementEventsUserArticleIdx" ON "engagement_events" USING btree ("user_id","article_id");--> statement-breakpoint
CREATE INDEX "engagementEventsCreatedAtIdx" ON "engagement_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "userInterestsUserIdIdx" ON "user_interests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "userTagInterestsUserIdIdx" ON "user_tag_interests" USING btree ("user_id");