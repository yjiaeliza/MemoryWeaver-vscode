import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { insertMemorySchema } from "@shared/schema";
import { generateMemoryStory } from "./openai";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Auth route - Get current user (NOT protected - used to check auth state)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.json(null);
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const objectStorageService = new ObjectStorageService();

  // Object storage: Get presigned URL for uploading photos (protected)
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Object storage: Serve uploaded photos (public access for sharing)
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

  // Create a new memory (protected)
  app.post("/api/memories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertMemorySchema.parse(req.body);
      
      // Normalize the photo URL to use the /objects/ path format
      const normalizedPhotoUrl = objectStorageService.normalizeObjectEntityPath(
        validatedData.photoUrl
      );

      const memory = await storage.createMemory({
        ...validatedData,
        userId,
        photoUrl: normalizedPhotoUrl,
      });

      res.status(201).json(memory);
    } catch (error) {
      console.error("Error creating memory:", error);
      res.status(400).json({ error: "Failed to create memory" });
    }
  });

  // Get all memories for a space (protected)
  app.get("/api/memories/:spaceId", isAuthenticated, async (req, res) => {
    try {
      const { spaceId } = req.params;
      const memories = await storage.getMemoriesBySpaceId(spaceId);
      res.json(memories);
    } catch (error) {
      console.error("Error fetching memories:", error);
      res.status(500).json({ error: "Failed to fetch memories" });
    }
  });

  // Get generated story for a space (protected)
  app.get("/api/generated-story/:spaceId", isAuthenticated, async (req, res) => {
    try {
      const { spaceId } = req.params;
      const story = await storage.getGeneratedStoryBySpaceId(spaceId);
      res.json(story || null);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });

  // Generate a memory book story using OpenAI (protected)
  app.post("/api/generate-story", isAuthenticated, async (req, res) => {
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
