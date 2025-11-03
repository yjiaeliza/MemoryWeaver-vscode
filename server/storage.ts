import { type Memory, type InsertMemory, type GeneratedStory, type InsertGeneratedStory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createMemory(memory: InsertMemory): Promise<Memory>;
  getMemoriesBySpaceId(spaceId: string): Promise<Memory[]>;
  
  createGeneratedStory(story: InsertGeneratedStory): Promise<GeneratedStory>;
  getGeneratedStoryBySpaceId(spaceId: string): Promise<GeneratedStory | undefined>;
  updateGeneratedStory(spaceId: string, story: InsertGeneratedStory): Promise<GeneratedStory>;
}

export class MemStorage implements IStorage {
  private memories: Map<string, Memory>;
  private generatedStories: Map<string, GeneratedStory>;

  constructor() {
    this.memories = new Map();
    this.generatedStories = new Map();
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const id = randomUUID();
    const memory: Memory = { 
      ...insertMemory, 
      id,
      createdAt: new Date(),
    };
    this.memories.set(id, memory);
    return memory;
  }

  async getMemoriesBySpaceId(spaceId: string): Promise<Memory[]> {
    return Array.from(this.memories.values())
      .filter(memory => memory.spaceId === spaceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createGeneratedStory(insertStory: InsertGeneratedStory): Promise<GeneratedStory> {
    const id = randomUUID();
    const story: GeneratedStory = {
      ...insertStory,
      id,
      createdAt: new Date(),
    };
    this.generatedStories.set(insertStory.spaceId, story);
    return story;
  }

  async getGeneratedStoryBySpaceId(spaceId: string): Promise<GeneratedStory | undefined> {
    return this.generatedStories.get(spaceId);
  }

  async updateGeneratedStory(spaceId: string, insertStory: InsertGeneratedStory): Promise<GeneratedStory> {
    const existing = this.generatedStories.get(spaceId);
    const story: GeneratedStory = {
      ...insertStory,
      id: existing?.id || randomUUID(),
      createdAt: new Date(),
    };
    this.generatedStories.set(spaceId, story);
    return story;
  }
}

export const storage = new MemStorage();
