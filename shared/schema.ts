import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

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

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").notNull(),
  name: text("name").notNull(),
  isCustom: boolean("is_custom").notNull().default(false),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  cost: real("cost").notNull(),
  quantity: integer("quantity").notNull().default(1),
  purchaseDate: text("purchase_date"),
  imageUrls: json("image_urls").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
});

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

export type ClaimSummary = {
  claim: Claim;
  claimant: Claimant;
  rooms: (Room & { items: Item[] })[];
};
