import { type Memory, type InsertMemory, type GeneratedStory, type InsertGeneratedStory } from "@shared/schema";
import { supabase } from "./supabase";

export interface IStorage {
  // Memory operations
  createMemory(memory: InsertMemory): Promise<Memory>;
  getMemoriesBySpaceId(spaceId: string): Promise<Memory[]>;
  
  // Story operations
  createGeneratedStory(story: InsertGeneratedStory): Promise<GeneratedStory>;
  getGeneratedStoryBySpaceId(spaceId: string): Promise<GeneratedStory | undefined>;
  updateGeneratedStory(spaceId: string, story: InsertGeneratedStory): Promise<GeneratedStory>;
}

export class SupabaseStorage implements IStorage {
  // Memory operations
  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const { data, error } = await supabase
      .from('memories')
      .insert(insertMemory)
      .select()
      .single();

    if (error) {
      console.error('Error creating memory:', error);
      throw new Error(`Failed to create memory: ${error.message}`);
    }

    return data;
  }

  async getMemoriesBySpaceId(spaceId: string): Promise<Memory[]> {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching memories:', error);
      throw new Error(`Failed to fetch memories: ${error.message}`);
    }

    return data || [];
  }

  // Story operations
  async createGeneratedStory(insertStory: InsertGeneratedStory): Promise<GeneratedStory> {
    const { data, error } = await supabase
      .from('generated_stories')
      .insert(insertStory)
      .select()
      .single();

    if (error) {
      console.error('Error creating story:', error);
      throw new Error(`Failed to create story: ${error.message}`);
    }

    return data;
  }

  async getGeneratedStoryBySpaceId(spaceId: string): Promise<GeneratedStory | undefined> {
    const { data, error } = await supabase
      .from('generated_stories')
      .select('*')
      .eq('space_id', spaceId)
      .single();

    if (error) {
      // Not found is not an error - return undefined
      if (error.code === 'PGRST116') {
        return undefined;
      }
      console.error('Error fetching story:', error);
      throw new Error(`Failed to fetch story: ${error.message}`);
    }

    return data;
  }

  async updateGeneratedStory(spaceId: string, insertStory: InsertGeneratedStory): Promise<GeneratedStory> {
    // First check if story exists
    const existing = await this.getGeneratedStoryBySpaceId(spaceId);

    if (existing) {
      // Update existing story
      const { data, error } = await supabase
        .from('generated_stories')
        .update({ story_text: insertStory.story_text })
        .eq('space_id', spaceId)
        .select()
        .single();

      if (error) {
        console.error('Error updating story:', error);
        throw new Error(`Failed to update story: ${error.message}`);
      }

      return data;
    } else {
      // Create new story
      return await this.createGeneratedStory(insertStory);
    }
  }
}

// Export singleton instance
export const storage = new SupabaseStorage();
