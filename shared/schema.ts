import { pgTable, text, serial, integer, boolean, timestamp, json, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Document type enum
export const documentTypeEnum = pgEnum('document_type', ['receipt', 'photo', 'warranty', 'manual', 'appraisal', 'other']);

// Source type enum
export const sourceTypeEnum = pgEnum('source_type', ['email', 'retailer', 'photo_library', 'manual_upload', 'other']);

// Collaborator role enum
export const collaboratorRoleEnum = pgEnum('collaborator_role', ['owner', 'editor', 'viewer']);

// Users table with enhanced profile info
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Claimants table
export const claimants = pgTable("claimants", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClaimantSchema = createInsertSchema(claimants).omit({
  id: true,
  createdAt: true,
});

// Claims table
export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  claimantId: integer("claimant_id").notNull(),
  totalValue: real("total_value").notNull().default(0),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Rooms table
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").notNull(),
  name: text("name").notNull(),
  isCustom: boolean("is_custom").notNull().default(false),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

// Items table with enhanced documentation fields
export const items = pgTable("items", {
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
  imageUrls: json("image_urls").$type<string[]>().default([]),
  documentUrls: json("document_urls").$type<string[]>().default([]),
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

// Documentation sources table
export const documentations = pgTable("documentations", {
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
  metadata: json("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDocumentationSchema = createInsertSchema(documentations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Potential duplicates table
export const potentialDuplicates = pgTable("potential_duplicates", {
  id: serial("id").primaryKey(),
  itemId1: integer("item_id_1").notNull(),
  itemId2: integer("item_id_2").notNull(),
  confidence: real("confidence").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPotentialDuplicateSchema = createInsertSchema(potentialDuplicates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Collaborators table
export const collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").notNull(),
  userId: integer("user_id").notNull(),
  email: text("email").notNull(),
  role: collaboratorRoleEnum("role").notNull().default("viewer"),
  inviteStatus: text("invite_status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCollaboratorSchema = createInsertSchema(collaborators).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClaimant = z.infer<typeof insertClaimantSchema>;
export type Claimant = typeof claimants.$inferSelect;

export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claims.$inferSelect;

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;

export type InsertDocumentation = z.infer<typeof insertDocumentationSchema>;
export type Documentation = typeof documentations.$inferSelect;

export type InsertPotentialDuplicate = z.infer<typeof insertPotentialDuplicateSchema>;
export type PotentialDuplicate = typeof potentialDuplicates.$inferSelect;

export type InsertCollaborator = z.infer<typeof insertCollaboratorSchema>;
export type Collaborator = typeof collaborators.$inferSelect;

export type ClaimSummary = {
  claim: Claim;
  claimant: Claimant;
  rooms: (Room & { items: Item[] })[];
};