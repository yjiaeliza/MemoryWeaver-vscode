import { z } from "zod";

// Memory type - matches Supabase table structure
export interface Memory {
  id: number;
  space_id: string;
  user_name: string;
  note: string;
  photo_url: string;
  created_at: string;
}

// Generated story type - matches Supabase table structure
export interface GeneratedStory {
  id: number;
  space_id: string;
  story_text: string;
  created_at: string;
}

// Insert schemas for validation
export const insertMemorySchema = z.object({
  space_id: z.string().min(1, "Space ID is required"),
  user_name: z.string().min(1, "Display name is required"),
  note: z.string().min(1, "Note is required"),
  photo_url: z.string().url("Photo URL must be valid"),
});

export const insertGeneratedStorySchema = z.object({
  space_id: z.string().min(1, "Space ID is required"),
  story_text: z.string().min(1, "Story text is required"),
});

// Types
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type InsertGeneratedStory = z.infer<typeof insertGeneratedStorySchema>;
