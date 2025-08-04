// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer } from "ws";

// server/storage.ts
var MemStorage = class {
  users;
  claimants;
  claims;
  rooms;
  items;
  documentations;
  potentialDuplicates;
  collaborators;
  currentUserId;
  currentClaimantId;
  currentClaimId;
  currentRoomId;
  currentItemId;
  currentDocumentationId;
  currentPotentialDuplicateId;
  currentCollaboratorId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.claimants = /* @__PURE__ */ new Map();
    this.claims = /* @__PURE__ */ new Map();
    this.rooms = /* @__PURE__ */ new Map();
    this.items = /* @__PURE__ */ new Map();
    this.documentations = /* @__PURE__ */ new Map();
    this.potentialDuplicates = /* @__PURE__ */ new Map();
    this.collaborators = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentClaimantId = 1;
    this.currentClaimId = 1;
    this.currentRoomId = 1;
    this.currentItemId = 1;
    this.currentDocumentationId = 1;
    this.currentPotentialDuplicateId = 1;
    this.currentCollaboratorId = 1;
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const createdAt = /* @__PURE__ */ new Date();
    const user = {
      ...insertUser,
      id,
      createdAt,
      lastLogin: null,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null
    };
    this.users.set(id, user);
    return user;
  }
  async updateUserLastLogin(id) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, lastLogin: /* @__PURE__ */ new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Claimant operations
  async getClaimant(id) {
    return this.claimants.get(id);
  }
  async createClaimant(insertClaimant) {
    const id = this.currentClaimantId++;
    const createdAt = /* @__PURE__ */ new Date();
    const claimant = {
      ...insertClaimant,
      id,
      createdAt,
      policyNumber: insertClaimant.policyNumber || null,
      language: insertClaimant.language || "en",
      currency: insertClaimant.currency || "USD"
    };
    this.claimants.set(id, claimant);
    return claimant;
  }
  async updateClaimant(id, claimant) {
    const existingClaimant = this.claimants.get(id);
    if (!existingClaimant) return void 0;
    const updatedClaimant = { ...existingClaimant, ...claimant };
    this.claimants.set(id, updatedClaimant);
    return updatedClaimant;
  }
  // Claim operations
  async getClaim(id) {
    return this.claims.get(id);
  }
  async getClaimsByClaimantId(claimantId) {
    return Array.from(this.claims.values()).filter(
      (claim) => claim.claimantId === claimantId
    );
  }
  async createClaim(insertClaim) {
    const id = this.currentClaimId++;
    const createdAt = /* @__PURE__ */ new Date();
    const updatedAt = /* @__PURE__ */ new Date();
    const claim = {
      ...insertClaim,
      id,
      createdAt,
      updatedAt,
      status: insertClaim.status || "draft",
      totalValue: insertClaim.totalValue || 0
    };
    this.claims.set(id, claim);
    return claim;
  }
  async updateClaim(id, claim) {
    const existingClaim = this.claims.get(id);
    if (!existingClaim) return void 0;
    const updatedClaim = {
      ...existingClaim,
      ...claim,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }
  // Room operations
  async getRoomsByClaimId(claimId) {
    return Array.from(this.rooms.values()).filter(
      (room) => room.claimId === claimId
    );
  }
  async createRoom(insertRoom) {
    const id = this.currentRoomId++;
    const room = {
      ...insertRoom,
      id,
      isCustom: insertRoom.isCustom ?? false
    };
    this.rooms.set(id, room);
    return room;
  }
  // Item operations
  async getItemsByRoomId(roomId) {
    return Array.from(this.items.values()).filter(
      (item) => item.roomId === roomId
    );
  }
  async createItem(insertItem) {
    const id = this.currentItemId++;
    const createdAt = /* @__PURE__ */ new Date();
    const updatedAt = /* @__PURE__ */ new Date();
    const item = {
      ...insertItem,
      id,
      createdAt,
      updatedAt,
      brand: insertItem.brand || null,
      description: insertItem.description || null,
      category: insertItem.category || null,
      purchaseDate: insertItem.purchaseDate || null,
      retailer: insertItem.retailer || null,
      modelNumber: insertItem.modelNumber || null,
      serialNumber: insertItem.serialNumber || null,
      notes: insertItem.notes || null,
      warranty: insertItem.warranty || null,
      imageUrls: insertItem.imageUrls || [],
      tags: insertItem.tags || null,
      createdBy: insertItem.createdBy || null,
      updatedBy: insertItem.updatedBy || null
    };
    this.items.set(id, item);
    return item;
  }
  async updateItem(id, item) {
    const existingItem = this.items.get(id);
    if (!existingItem) return void 0;
    const updatedItem = { ...existingItem, ...item };
    this.items.set(id, updatedItem);
    return updatedItem;
  }
  async deleteItem(id) {
    return this.items.delete(id);
  }
  // Documentation operations
  async getDocumentationsByItemId(itemId) {
    return Array.from(this.documentations.values()).filter(
      (doc) => doc.itemId === itemId
    );
  }
  async getDocumentation(id) {
    return this.documentations.get(id);
  }
  async createDocumentation(insertDocumentation) {
    const id = this.currentDocumentationId++;
    const createdAt = /* @__PURE__ */ new Date();
    const updatedAt = /* @__PURE__ */ new Date();
    const documentation = {
      ...insertDocumentation,
      id,
      createdAt,
      updatedAt,
      description: insertDocumentation.description || null,
      sourceUrl: insertDocumentation.sourceUrl || null,
      sourceName: insertDocumentation.sourceName || null,
      metadata: insertDocumentation.metadata || null
    };
    this.documentations.set(id, documentation);
    return documentation;
  }
  async updateDocumentation(id, documentation) {
    const existingDoc = this.documentations.get(id);
    if (!existingDoc) return void 0;
    const updatedDoc = {
      ...existingDoc,
      ...documentation,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.documentations.set(id, updatedDoc);
    return updatedDoc;
  }
  async deleteDocumentation(id) {
    return this.documentations.delete(id);
  }
  // Potential duplicates operations
  async getPotentialDuplicates(itemId) {
    return Array.from(this.potentialDuplicates.values()).filter(
      (dup) => dup.itemId1 === itemId || dup.itemId2 === itemId
    );
  }
  async createPotentialDuplicate(duplicate) {
    const id = this.currentPotentialDuplicateId++;
    const createdAt = /* @__PURE__ */ new Date();
    const updatedAt = /* @__PURE__ */ new Date();
    const potentialDuplicate = {
      ...duplicate,
      id,
      createdAt,
      updatedAt,
      status: duplicate.status || "pending"
    };
    this.potentialDuplicates.set(id, potentialDuplicate);
    return potentialDuplicate;
  }
  async updatePotentialDuplicateStatus(id, status) {
    const existingDuplicate = this.potentialDuplicates.get(id);
    if (!existingDuplicate) return void 0;
    const updatedDuplicate = {
      ...existingDuplicate,
      status,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.potentialDuplicates.set(id, updatedDuplicate);
    return updatedDuplicate;
  }
  async detectPotentialDuplicates(itemId) {
    const targetItem = this.items.get(itemId);
    if (!targetItem) return [];
    const potentialDuplicates2 = [];
    const roomsInClaim = await this.getRoomsByClaimId(
      (await this.getRoom(targetItem.roomId))?.claimId || 0
    );
    const roomIds = roomsInClaim.map((room) => room.id);
    for (const item of Array.from(this.items.values())) {
      if (item.id === itemId || !roomIds.includes(item.roomId)) continue;
      const similarity = this.calculateStringSimilarity(
        targetItem.name.toLowerCase(),
        item.name.toLowerCase()
      );
      if (similarity > 0.6) {
        const potentialDuplicate = await this.createPotentialDuplicate({
          itemId1: itemId,
          itemId2: item.id,
          confidence: similarity,
          status: "pending"
        });
        potentialDuplicates2.push(potentialDuplicate);
      }
    }
    return potentialDuplicates2;
  }
  // Helper method to get a room by ID (needed for detectPotentialDuplicates)
  async getRoom(id) {
    return this.rooms.get(id);
  }
  // Simple string similarity calculation
  calculateStringSimilarity(str1, str2) {
    const words1 = str1.split(" ");
    const words2 = str2.split(" ");
    const sharedWords = words1.filter((word) => words2.includes(word)).length;
    const uniqueWords = (/* @__PURE__ */ new Set([...words1, ...words2])).size;
    return uniqueWords === 0 ? 0 : sharedWords / uniqueWords;
  }
  // Collaboration operations
  async getCollaboratorsByClaimId(claimId) {
    return Array.from(this.collaborators.values()).filter(
      (collaborator) => collaborator.claimId === claimId
    );
  }
  async getCollaboratorsByUserId(userId) {
    return Array.from(this.collaborators.values()).filter(
      (collaborator) => collaborator.userId === userId
    );
  }
  async getCollaborator(id) {
    return this.collaborators.get(id);
  }
  async createCollaborator(insertCollaborator) {
    const id = this.currentCollaboratorId++;
    const createdAt = /* @__PURE__ */ new Date();
    const updatedAt = /* @__PURE__ */ new Date();
    const collaborator = {
      ...insertCollaborator,
      id,
      createdAt,
      updatedAt,
      role: insertCollaborator.role || "viewer",
      inviteStatus: insertCollaborator.inviteStatus || "pending"
    };
    this.collaborators.set(id, collaborator);
    return collaborator;
  }
  async updateCollaborator(id, collaborator) {
    const existingCollaborator = this.collaborators.get(id);
    if (!existingCollaborator) return void 0;
    const updatedCollaborator = {
      ...existingCollaborator,
      ...collaborator,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.collaborators.set(id, updatedCollaborator);
    return updatedCollaborator;
  }
  async deleteCollaborator(id) {
    return this.collaborators.delete(id);
  }
  // Summary operations
  async getClaimSummary(claimId) {
    const claim = await this.getClaim(claimId);
    if (!claim) return void 0;
    const claimant = await this.getClaimant(claim.claimantId);
    if (!claimant) return void 0;
    const roomsList = await this.getRoomsByClaimId(claimId);
    const roomsWithItems = await Promise.all(
      roomsList.map(async (room) => {
        const roomItems = await this.getItemsByRoomId(room.id);
        return { ...room, items: roomItems };
      })
    );
    return {
      claim,
      claimant,
      rooms: roomsWithItems
    };
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, json, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var documentTypeEnum = pgEnum("document_type", ["receipt", "photo", "warranty", "manual", "appraisal", "other"]);
var sourceTypeEnum = pgEnum("source_type", ["email", "retailer", "photo_library", "manual_upload", "other"]);
var collaboratorRoleEnum = pgEnum("collaborator_role", ["owner", "editor", "viewer"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true
});
var claimants = pgTable("claimants", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  policyNumber: text("policy_number"),
  streetAddress: text("street_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  language: text("language").notNull().default("en"),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertClaimantSchema = createInsertSchema(claimants).omit({
  id: true,
  createdAt: true
});
var claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  claimantId: integer("claimant_id").notNull(),
  totalValue: real("total_value").notNull().default(0),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").notNull(),
  name: text("name").notNull(),
  isCustom: boolean("is_custom").notNull().default(false)
});
var insertRoomSchema = createInsertSchema(rooms).omit({
  id: true
});
var items = pgTable("items", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  cost: real("cost").notNull(),
  quantity: integer("quantity").notNull().default(1),
  purchaseDate: text("purchase_date"),
  retailer: text("retailer"),
  model: text("model"),
  serialNumber: text("serial_number"),
  brand: text("brand"),
  condition: text("condition"),
  notes: text("notes"),
  imageUrls: json("image_urls").$type().default([]),
  documentUrls: json("document_urls").$type().default([]),
  tags: json("tags").$type().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by")
});
var insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true
});
var documentations = pgTable("documentations", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  userId: integer("user_id").notNull(),
  documentType: documentTypeEnum("document_type").notNull(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  sourceUrl: text("source_url"),
  sourceName: text("source_name"),
  metadata: json("metadata").$type().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertDocumentationSchema = createInsertSchema(documentations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var potentialDuplicates = pgTable("potential_duplicates", {
  id: serial("id").primaryKey(),
  itemId1: integer("item_id_1").notNull(),
  itemId2: integer("item_id_2").notNull(),
  confidence: real("confidence").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertPotentialDuplicateSchema = createInsertSchema(potentialDuplicates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").notNull(),
  userId: integer("user_id").notNull(),
  email: text("email").notNull(),
  role: collaboratorRoleEnum("role").notNull().default("viewer"),
  inviteStatus: text("invite_status").notNull().default("pending"),
  // pending, accepted, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertCollaboratorSchema = createInsertSchema(collaborators).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/routes.ts
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import OpenAI from "openai";
async function registerRoutes(app2) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "demo_key"
  });
  app2.post("/api/claimants", async (req, res) => {
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
  app2.get("/api/claimants/:id", async (req, res) => {
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
  app2.patch("/api/claimants/:id", async (req, res) => {
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
  app2.post("/api/claims", async (req, res) => {
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
  app2.get("/api/claims/:id", async (req, res) => {
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
  app2.get("/api/claimants/:claimantId/claims", async (req, res) => {
    try {
      const claimantId = parseInt(req.params.claimantId);
      const claims2 = await storage.getClaimsByClaimantId(claimantId);
      res.json(claims2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });
  app2.patch("/api/claims/:id", async (req, res) => {
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
  app2.post("/api/rooms", async (req, res) => {
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
  app2.get("/api/claims/:claimId/rooms", async (req, res) => {
    try {
      const claimId = parseInt(req.params.claimId);
      const rooms2 = await storage.getRoomsByClaimId(claimId);
      res.json(rooms2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });
  app2.post("/api/items", async (req, res) => {
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
  app2.get("/api/rooms/:roomId/items", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const items2 = await storage.getItemsByRoomId(roomId);
      res.json(items2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });
  app2.patch("/api/items/:id", async (req, res) => {
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
  app2.delete("/api/items/:id", async (req, res) => {
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
  app2.get("/api/claims/:id/summary", async (req, res) => {
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
  app2.post("/api/ai/room-items", async (req, res) => {
    try {
      const { room, homeType } = req.body;
      if (!room) {
        return res.status(400).json({ message: "Room name is required" });
      }
      const fallbackItems = {
        "living room": ["TV", "Sofa", "Coffee Table", "Bookshelf", "Entertainment Center"],
        "kitchen": ["Refrigerator", "Microwave", "Toaster", "Blender", "Dishwasher"],
        "master bedroom": ["Bed", "Dresser", "Nightstand", "TV", "Closet items"],
        "bathroom": ["Shower curtain", "Towels", "Toiletries", "Medicine cabinet items"],
        "garage": ["Tools", "Lawn equipment", "Sports equipment", "Storage items"]
      };
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that suggests common items found in a specific room for wildfire insurance documentation purposes. 
              
              You help users remember items they might have lost in a wildfire by suggesting items commonly found in specific rooms.
              
              Return a JSON object with an 'items' array. Each item in the array should have the following properties:
              - name: The name of the item
              - category: The category of the item (Electronics, Furniture, Appliances, Clothing, Jewelry, etc.)
              - estimatedCost: Estimated cost in dollars (numeric value, no currency symbol)
              - description: A brief description of the item that could help with identification
              - commonBrands: Array of 2-3 common brands for this item
              - ageInYears: Typical age of the item in years (average lifespan before replacement)
              - replacementDifficulty: How difficult to replace on a scale of 1-5 (1 = easy to replace, 5 = very difficult or irreplaceable)
              - sentimentalValue: Typical sentimental value on a scale of 1-5 (1 = low, 5 = high)
              `
            },
            {
              role: "user",
              content: `Suggest 5-10 common items typically found in a ${room}${homeType ? ` for a ${homeType}` : ""}. 
              
              Focus on both everyday items and potentially valuable or difficult-to-replace items that might be overlooked during an insurance claim.
              
              For each item, include realistic estimated costs, common brands, and other required fields to help with insurance claims documentation.`
            }
          ],
          response_format: { type: "json_object" }
        });
        const suggestedItems = JSON.parse(response.choices[0].message.content);
        res.json(suggestedItems);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        const normalizedRoom = room.toLowerCase();
        const items2 = fallbackItems[normalizedRoom] || fallbackItems["living room"];
        const formattedItems = items2.map((name) => ({
          name,
          category: "Other",
          estimatedCost: 100,
          description: `A typical ${name.toLowerCase()}`,
          commonBrands: ["Generic"],
          ageInYears: 5,
          replacementDifficulty: 2,
          sentimentalValue: 2
        }));
        res.json({ items: formattedItems });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get item suggestions" });
    }
  });
  app2.post("/api/ai/product-links", async (req, res) => {
    try {
      const { itemName, description, category } = req.body;
      if (!itemName) {
        return res.status(400).json({ message: "Item name is required" });
      }
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that suggests potential product links and retailers for items being documented for insurance purposes.
              
              Return a JSON object with a 'retailers' array. Each retailer in the array should have:
              - name: Name of the retailer
              - websiteUrl: Base URL of the retailer (without specific product search)
              - searchUrl: URL to search for this specific product
              - searchTips: Tips on how to filter or navigate to find similar products
              - productCategory: The general product category on this retailer's site
              - priceRange: Estimated price range for this type of item
              `
            },
            {
              role: "user",
              content: `Suggest retailers and search links for a ${itemName} ${description ? `described as: ${description}` : ""} ${category ? `in the category: ${category}` : ""}.
              
              Focus on major retailers where replacement items could be purchased. Include both online-only retailers and brick-and-mortar stores.
              
              For each retailer, provide a specific search URL that would help locate similar products, along with tips on filtering/navigating to find comparable items.`
            }
          ],
          response_format: { type: "json_object" }
        });
        const suggestedRetailers = JSON.parse(response.choices[0].message.content);
        res.json(suggestedRetailers);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        res.json({
          retailers: [
            {
              name: "Amazon",
              websiteUrl: "https://www.amazon.com",
              searchUrl: `https://www.amazon.com/s?k=${encodeURIComponent(itemName)}`,
              searchTips: "Filter by customer reviews and price range",
              productCategory: category || "General",
              priceRange: "$20-$200"
            },
            {
              name: "Walmart",
              websiteUrl: "https://www.walmart.com",
              searchUrl: `https://www.walmart.com/search?q=${encodeURIComponent(itemName)}`,
              searchTips: "Sort by best sellers or highest rated",
              productCategory: category || "General",
              priceRange: "$15-$150"
            }
          ]
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get product link suggestions" });
    }
  });
  app2.post("/api/ai/analyze-image", async (req, res) => {
    try {
      const { base64Image } = req.body;
      if (!base64Image) {
        return res.status(400).json({ message: "Image data is required" });
      }
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that analyzes photos of household items and identifies items for insurance documentation purposes.
              
              Focus on identifying valuable or notable items that would be important for an insurance claim after a wildfire.
              
              Return a JSON object with:
              - identifiedItems: Array of items you've identified in the image
                - name: Name of the item
                - category: Category the item belongs to (Electronics, Furniture, etc.)
                - estimatedValue: Estimated value range (e.g. "$100-$500")
                - description: Brief description of the item as seen in the image
                - confidence: Your confidence level (1-5) in this identification
              - suggestions: Tips for better documenting these items for insurance
              `
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and identify any items that would be important to document for insurance purposes after a wildfire. Please be specific about what you see and provide realistic estimated values."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" }
        });
        const analysisResults = JSON.parse(response.choices[0].message.content);
        res.json(analysisResults);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        res.json({
          identifiedItems: [
            {
              name: "Unknown Item",
              category: "Miscellaneous",
              estimatedValue: "Unknown",
              description: "Unable to analyze the image",
              confidence: 0
            }
          ],
          suggestions: "Please try uploading a clearer image or manually document the items you see."
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });
  app2.post("/api/ai/image-suggestions", async (req, res) => {
    try {
      const { itemName, description, category, brand } = req.body;
      if (!itemName) {
        return res.status(400).json({ message: "Item name is required" });
      }
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that suggests search terms for finding images of products for insurance documentation.
              
              Return a JSON object with:
              - searchTerms: Array of effective search terms to find images of this product
              - specificDescriptors: Array of specific descriptors that help identify the exact item
              - searchEngineUrls: Object with URLs to search for images on Google, Bing, and DuckDuckGo
              - searchTips: Tips on refining image searches
              `
            },
            {
              role: "user",
              content: `Suggest image search terms and URLs for a ${brand ? `${brand} ` : ""}${itemName} ${description ? `described as: ${description}` : ""} ${category ? `in the category: ${category}` : ""}.
              
              Provide specific search terms that would help someone find images of this exact item or something very similar for insurance documentation purposes.
              
              Include direct search engine URLs for Google Images, Bing Images, and DuckDuckGo Images.`
            }
          ],
          response_format: { type: "json_object" }
        });
        const imageSuggestions = JSON.parse(response.choices[0].message.content);
        res.json(imageSuggestions);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        const searchTerm = brand ? `${brand} ${itemName}` : itemName;
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        res.json({
          searchTerms: [searchTerm, `${searchTerm} product photo`, `${searchTerm} high resolution`],
          specificDescriptors: [category || "product", "high quality", "front view"],
          searchEngineUrls: {
            google: `https://www.google.com/search?q=${encodedSearchTerm}&tbm=isch`,
            bing: `https://www.bing.com/images/search?q=${encodedSearchTerm}`,
            duckduckgo: `https://duckduckgo.com/?q=${encodedSearchTerm}&t=h_&iax=images&ia=images`
          },
          searchTips: "Try adding the year, model number, or color for more specific results. Use terms like 'product photo' for cleaner images."
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get image search suggestions" });
    }
  });
  app2.post("/api/upload-image", async (req, res) => {
    try {
      const { itemId, base64Image, fileName, description } = req.body;
      if (!base64Image) {
        return res.status(400).json({ message: "Image data is required" });
      }
      const uniqueFileName = fileName || `image_${Date.now()}.jpg`;
      const documentationData = {
        itemId: itemId ? parseInt(itemId) : 0,
        // Use 0 as placeholder if no item ID provided
        userId: 1,
        // In a real app, this would be the authenticated user's ID
        title: uniqueFileName,
        description: description || "User uploaded image",
        documentType: "photo",
        sourceType: "manual_upload",
        fileUrl: base64Image,
        // In production, this would be a URL to the stored file
        sourceUrl: null,
        sourceName: "User Upload",
        metadata: {
          upload_info: [fileName || "unnamed", (/* @__PURE__ */ new Date()).toISOString()]
        }
      };
      const documentation = await storage.createDocumentation(documentationData);
      if (itemId) {
        return res.status(201).json(documentation);
      } else {
        return res.status(201).json({
          ...documentation,
          success: true,
          message: "Image uploaded successfully (not associated with a specific item)",
          fileName: uniqueFileName
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  app2.post("/api/documentations", async (req, res) => {
    try {
      const validatedData = insertDocumentationSchema.parse(req.body);
      const documentation = await storage.createDocumentation(validatedData);
      res.status(201).json(documentation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create documentation" });
      }
    }
  });
  app2.get("/api/items/:itemId/documentations", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const documentations2 = await storage.getDocumentationsByItemId(itemId);
      res.json(documentations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documentations" });
    }
  });
  app2.get("/api/documentations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const documentation = await storage.getDocumentation(id);
      if (!documentation) {
        return res.status(404).json({ message: "Documentation not found" });
      }
      res.json(documentation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documentation" });
    }
  });
  app2.patch("/api/documentations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDocumentationSchema.partial().parse(req.body);
      const documentation = await storage.updateDocumentation(id, validatedData);
      if (!documentation) {
        return res.status(404).json({ message: "Documentation not found" });
      }
      res.json(documentation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update documentation" });
      }
    }
  });
  app2.delete("/api/documentations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDocumentation(id);
      if (!success) {
        return res.status(404).json({ message: "Documentation not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete documentation" });
    }
  });
  app2.get("/api/items/:itemId/duplicates", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const duplicates = await storage.getPotentialDuplicates(itemId);
      res.json(duplicates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch potential duplicates" });
    }
  });
  app2.post("/api/items/:itemId/detect-duplicates", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const duplicates = await storage.detectPotentialDuplicates(itemId);
      res.json(duplicates);
    } catch (error) {
      res.status(500).json({ message: "Failed to detect potential duplicates" });
    }
  });
  app2.patch("/api/duplicates/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!status || !["pending", "confirmed", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const duplicate = await storage.updatePotentialDuplicateStatus(id, status);
      if (!duplicate) {
        return res.status(404).json({ message: "Potential duplicate not found" });
      }
      res.json(duplicate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update duplicate status" });
    }
  });
  app2.get("/api/claims/:claimId/collaborators", async (req, res) => {
    try {
      const claimId = parseInt(req.params.claimId);
      const collaborators2 = await storage.getCollaboratorsByClaimId(claimId);
      res.json(collaborators2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborators" });
    }
  });
  app2.get("/api/users/:userId/collaborations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const collaborations = await storage.getCollaboratorsByUserId(userId);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });
  app2.post("/api/collaborators", async (req, res) => {
    try {
      const validatedData = insertCollaboratorSchema.parse(req.body);
      const collaborator = await storage.createCollaborator(validatedData);
      console.log(`Invitation sent to ${collaborator.email} for claim ${collaborator.claimId}`);
      res.status(201).json(collaborator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create collaborator" });
      }
    }
  });
  app2.patch("/api/collaborators/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCollaboratorSchema.partial().parse(req.body);
      const collaborator = await storage.updateCollaborator(id, validatedData);
      if (!collaborator) {
        return res.status(404).json({ message: "Collaborator not found" });
      }
      res.json(collaborator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update collaborator" });
      }
    }
  });
  app2.delete("/api/collaborators/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCollaborator(id);
      if (!success) {
        return res.status(404).json({ message: "Collaborator not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete collaborator" });
    }
  });
  app2.post("/api/collaborators/:id/resend-invitation", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const collaborator = await storage.getCollaborator(id);
      if (!collaborator) {
        return res.status(404).json({ message: "Collaborator not found" });
      }
      console.log(`Invitation resent to ${collaborator.email} for claim ${collaborator.claimId}`);
      res.json({ message: "Invitation resent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to resend invitation" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    ws.send(JSON.stringify({ type: "connected", message: "Connected to documentation collaboration server" }));
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        switch (data.type) {
          case "join-claim":
            if (data.claimId) {
              console.log(`User joined claim ${data.claimId} for collaboration`);
              ws.send(JSON.stringify({
                type: "join-success",
                claimId: data.claimId
              }));
            }
            break;
          case "item-update":
            if (data.item) {
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws.OPEN) {
                  client.send(JSON.stringify({
                    type: "item-updated",
                    item: data.item
                  }));
                }
              });
            }
            break;
          case "documentation-added":
            if (data.documentation) {
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws.OPEN) {
                  client.send(JSON.stringify({
                    type: "new-documentation",
                    documentation: data.documentation
                  }));
                }
              });
            }
            break;
          default:
            ws.send(JSON.stringify({
              type: "error",
              message: "Unknown message type"
            }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Invalid message format"
        }));
      }
    });
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
