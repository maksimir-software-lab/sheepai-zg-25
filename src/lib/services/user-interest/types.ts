import type { userInterests } from "@/db/schema";

export type UserInterest = typeof userInterests.$inferSelect;
