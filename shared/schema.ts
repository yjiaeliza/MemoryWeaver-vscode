import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Memory table - stores individual photos and notes uploaded to a space
export const memories = pgTable("memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  spaceId: text("space_id").notNull(),
  displayName: text("display_name").notNull(),
  note: text("note").notNull(),
  photoUrl: text("photo_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Generated stories table - stores AI-generated memory books for each space
export const generatedStories = pgTable("generated_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  spaceId: text("space_id").notNull().unique(),
  storyTitle: text("story_title").notNull(),
  storyContent: text("story_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertMemorySchema = createInsertSchema(memories).omit({
  id: true,
  createdAt: true,
});

export const insertGeneratedStorySchema = createInsertSchema(generatedStories).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;

export type InsertGeneratedStory = z.infer<typeof insertGeneratedStorySchema>;
export type GeneratedStory = typeof generatedStories.$inferSelect;
