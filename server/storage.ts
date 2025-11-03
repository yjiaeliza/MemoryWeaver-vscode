import { type Memory, type InsertMemory, type GeneratedStory, type InsertGeneratedStory, type User, type UpsertUser, memories, generatedStories, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Memory operations
  createMemory(memory: InsertMemory): Promise<Memory>;
  getMemoriesBySpaceId(spaceId: string): Promise<Memory[]>;
  
  // Story operations
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

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Memory operations
  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const [memory] = await db.insert(memories).values(insertMemory).returning();
    return memory;
  }

  async getMemoriesBySpaceId(spaceId: string): Promise<Memory[]> {
    return await db
      .select()
      .from(memories)
      .where(eq(memories.spaceId, spaceId))
      .orderBy(memories.createdAt);
  }

  async createGeneratedStory(insertStory: InsertGeneratedStory): Promise<GeneratedStory> {
    const [story] = await db.insert(generatedStories).values(insertStory).returning();
    return story;
  }

  async getGeneratedStoryBySpaceId(spaceId: string): Promise<GeneratedStory | undefined> {
    const [story] = await db
      .select()
      .from(generatedStories)
      .where(eq(generatedStories.spaceId, spaceId))
      .limit(1);
    return story;
  }

  async updateGeneratedStory(spaceId: string, insertStory: InsertGeneratedStory): Promise<GeneratedStory> {
    const existing = await this.getGeneratedStoryBySpaceId(spaceId);
    
    if (existing) {
      const [updated] = await db
        .update(generatedStories)
        .set(insertStory)
        .where(eq(generatedStories.spaceId, spaceId))
        .returning();
      return updated;
    } else {
      return await this.createGeneratedStory(insertStory);
    }
  }
}

export const storage = new DatabaseStorage();
