import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemorySchema, insertGeneratedStorySchema } from "@shared/schema";
import { generateMemoryStory } from "./openai";
import { supabase } from "./supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Supabase Storage: Get upload URL for photos
  app.post("/api/storage/upload", async (req, res) => {
    try {
      const { fileName, fileType } = req.body;
      
      if (!fileName || !fileType) {
        return res.status(400).json({ error: "fileName and fileType are required" });
      }

      // Generate a unique file name
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      const filePath = `photos/${uniqueFileName}`;

      // Get signed URL for upload
      const { data, error } = await supabase.storage
        .from('memories')
        .createSignedUploadUrl(filePath);

      if (error) {
        console.error("Error getting upload URL:", error);
        return res.status(500).json({ error: "Failed to get upload URL" });
      }

      // Return both the upload URL and the final public URL
      const publicUrl = supabase.storage
        .from('memories')
        .getPublicUrl(filePath).data.publicUrl;

      res.json({ 
        uploadURL: data.signedUrl,
        publicURL: publicUrl,
        filePath
      });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Create a new memory
  app.post("/api/memories", async (req, res) => {
    try {
      const validatedData = insertMemorySchema.parse(req.body);
      const memory = await storage.createMemory(validatedData);
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

      // Generate captions for photos using OpenAI
      const { title, captions } = await generateMemoryStory(
        memories.map(m => ({
          displayName: m.user_name,
          note: m.note,
          photoUrl: m.photo_url,
        }))
      );

      // Store title and captions as JSON in story_text
      const storyData = JSON.stringify({ title, captions });

      // Save or update the generated story
      const story = await storage.updateGeneratedStory(spaceId, {
        space_id: spaceId,
        story_text: storyData,
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
