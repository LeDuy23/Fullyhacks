import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClaimantSchema, insertClaimSchema, insertRoomSchema, insertItemSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "demo_key"
  });

  // Claimant routes
  app.post("/api/claimants", async (req, res) => {
    try {
      const validatedData = insertClaimantSchema.parse(req.body);
      const claimant = await storage.createClaimant(validatedData);
      res.status(201).json(claimant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create claimant" });
      }
    }
  });

  app.get("/api/claimants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const claimant = await storage.getClaimant(id);
      
      if (!claimant) {
        return res.status(404).json({ message: "Claimant not found" });
      }
      
      res.json(claimant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claimant" });
    }
  });

  app.patch("/api/claimants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClaimantSchema.partial().parse(req.body);
      const claimant = await storage.updateClaimant(id, validatedData);
      
      if (!claimant) {
        return res.status(404).json({ message: "Claimant not found" });
      }
      
      res.json(claimant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update claimant" });
      }
    }
  });

  // Claims routes
  app.post("/api/claims", async (req, res) => {
    try {
      const validatedData = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(validatedData);
      res.status(201).json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create claim" });
      }
    }
  });

  app.get("/api/claims/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const claim = await storage.getClaim(id);
      
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      res.json(claim);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claim" });
    }
  });

  app.get("/api/claimants/:claimantId/claims", async (req, res) => {
    try {
      const claimantId = parseInt(req.params.claimantId);
      const claims = await storage.getClaimsByClaimantId(claimantId);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  app.patch("/api/claims/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClaimSchema.partial().parse(req.body);
      const claim = await storage.updateClaim(id, validatedData);
      
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      res.json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update claim" });
      }
    }
  });

  // Room routes
  app.post("/api/rooms", async (req, res) => {
    try {
      const validatedData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(validatedData);
      res.status(201).json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create room" });
      }
    }
  });

  app.get("/api/claims/:claimId/rooms", async (req, res) => {
    try {
      const claimId = parseInt(req.params.claimId);
      const rooms = await storage.getRoomsByClaimId(claimId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  // Item routes
  app.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create item" });
      }
    }
  });

  app.get("/api/rooms/:roomId/items", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const items = await storage.getItemsByRoomId(roomId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update item" });
      }
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Summary routes
  app.get("/api/claims/:id/summary", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const summary = await storage.getClaimSummary(id);
      
      if (!summary) {
        return res.status(404).json({ message: "Claim summary not found" });
      }
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claim summary" });
    }
  });

  // AI routes for item suggestions
  app.post("/api/ai/room-items", async (req, res) => {
    try {
      const { room } = req.body;
      
      if (!room) {
        return res.status(400).json({ message: "Room name is required" });
      }

      // Fallback items if OpenAI API fails
      const fallbackItems = {
        "living room": ["TV", "Sofa", "Coffee Table", "Bookshelf", "Entertainment Center"],
        "kitchen": ["Refrigerator", "Microwave", "Toaster", "Blender", "Dishwasher"],
        "master bedroom": ["Bed", "Dresser", "Nightstand", "TV", "Closet items"],
        "bathroom": ["Shower curtain", "Towels", "Toiletries", "Medicine cabinet items"],
        "garage": ["Tools", "Lawn equipment", "Sports equipment", "Storage items"],
      };

      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that suggests common items found in a specific room for insurance documentation purposes. Return a JSON array of objects with name, category, and estimatedCost fields."
            },
            {
              role: "user",
              content: `Suggest 5-10 common items typically found in a ${room}. For each item, include an estimated cost range.`
            }
          ],
          response_format: { type: "json_object" }
        });

        const suggestedItems = JSON.parse(response.choices[0].message.content);
        res.json(suggestedItems);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        // Return fallback items if OpenAI fails
        const normalizedRoom = room.toLowerCase();
        const items = fallbackItems[normalizedRoom] || 
                     fallbackItems["living room"]; // Default to living room if unknown
        
        const formattedItems = items.map((name) => ({
          name,
          category: "Other",
          estimatedCost: 100
        }));
        
        res.json({ items: formattedItems });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get item suggestions" });
    }
  });

  // Image upload routes would go here with Firebase Storage integration
  // For simplicity, we'll use base64 strings in the API responses

  const httpServer = createServer(app);
  return httpServer;
}
