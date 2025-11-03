import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { insertMemorySchema } from "@shared/schema";
import { generateMemoryStory } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();

  // Object storage: Get presigned URL for uploading photos
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Object storage: Serve uploaded photos (public access for this use case)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Create a new memory
  app.post("/api/memories", async (req, res) => {
    try {
      const validatedData = insertMemorySchema.parse(req.body);
      
      // Normalize the photo URL to use the /objects/ path format
      const normalizedPhotoUrl = objectStorageService.normalizeObjectEntityPath(
        validatedData.photoUrl
      );

      const memory = await storage.createMemory({
        ...validatedData,
        photoUrl: normalizedPhotoUrl,
      });

      res.status(201).json(memory);
    } catch (error) {
      console.error("Error creating memory:", error);
      res.status(400).json({ error: "Failed to create memory" });
    }
  });

  // Get all memories for a space
  app.get("/api/memories/:spaceId", async (req, res) => {
    try {
      const { spaceId } = req.params;
      const memories = await storage.getMemoriesBySpaceId(spaceId);
      res.json(memories);
    } catch (error) {
      console.error("Error fetching memories:", error);
      res.status(500).json({ error: "Failed to fetch memories" });
    }
  });

  // Get generated story for a space
  app.get("/api/generated-story/:spaceId", async (req, res) => {
    try {
      const { spaceId } = req.params;
      const story = await storage.getGeneratedStoryBySpaceId(spaceId);
      res.json(story || null);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });

  // Generate a memory book story using OpenAI
  app.post("/api/generate-story", async (req, res) => {
    try {
      const { spaceId } = req.body;
      
      if (!spaceId) {
        return res.status(400).json({ error: "spaceId is required" });
      }

      // Get all memories for this space
      const memories = await storage.getMemoriesBySpaceId(spaceId);

      if (memories.length === 0) {
        return res.status(400).json({ error: "No memories found for this space" });
      }

      // Generate story using OpenAI
      const { title, content } = await generateMemoryStory(
        memories.map(m => ({
          displayName: m.displayName,
          note: m.note,
          photoUrl: m.photoUrl,
        }))
      );

      // Save or update the generated story
      const existingStory = await storage.getGeneratedStoryBySpaceId(spaceId);
      
      const story = existingStory
        ? await storage.updateGeneratedStory(spaceId, {
            spaceId,
            storyTitle: title,
            storyContent: content,
          })
        : await storage.createGeneratedStory({
            spaceId,
            storyTitle: title,
            storyContent: content,
          });

      res.json(story);
    } catch (error) {
      console.error("Error generating story:", error);
      res.status(500).json({ error: "Failed to generate story" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
