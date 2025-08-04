import { 
  users, type User, type InsertUser,
  claimants, type Claimant, type InsertClaimant,
  claims, type Claim, type InsertClaim,
  rooms, type Room, type InsertRoom,
  items, type Item, type InsertItem,
  documentations, type Documentation, type InsertDocumentation,
  potentialDuplicates, type PotentialDuplicate, type InsertPotentialDuplicate,
  collaborators, type Collaborator, type InsertCollaborator,
  type ClaimSummary
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull, not, gt } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  
  // Claimant operations
  getClaimant(id: number): Promise<Claimant | undefined>;
  createClaimant(claimant: InsertClaimant): Promise<Claimant>;
  updateClaimant(id: number, claimant: Partial<InsertClaimant>): Promise<Claimant | undefined>;
  
  // Claim operations
  getClaim(id: number): Promise<Claim | undefined>;
  getClaimsByClaimantId(claimantId: number): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: number, claim: Partial<InsertClaim>): Promise<Claim | undefined>;
  
  // Room operations
  getRoomsByClaimId(claimId: number): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  
  // Item operations
  getItemsByRoomId(roomId: number): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: number): Promise<boolean>;
  
  // Documentation operations
  getDocumentationsByItemId(itemId: number): Promise<Documentation[]>;
  getDocumentation(id: number): Promise<Documentation | undefined>;
  createDocumentation(documentation: InsertDocumentation): Promise<Documentation>;
  updateDocumentation(id: number, documentation: Partial<InsertDocumentation>): Promise<Documentation | undefined>;
  deleteDocumentation(id: number): Promise<boolean>;
  
  // Potential duplicates operations
  getPotentialDuplicates(itemId: number): Promise<PotentialDuplicate[]>;
  createPotentialDuplicate(duplicate: InsertPotentialDuplicate): Promise<PotentialDuplicate>;
  updatePotentialDuplicateStatus(id: number, status: string): Promise<PotentialDuplicate | undefined>;
  detectPotentialDuplicates(itemId: number): Promise<PotentialDuplicate[]>;

  // Collaboration operations  
  getCollaboratorsByClaimId(claimId: number): Promise<Collaborator[]>;
  getCollaboratorsByUserId(userId: number): Promise<Collaborator[]>;
  getCollaborator(id: number): Promise<Collaborator | undefined>;
  createCollaborator(collaborator: InsertCollaborator): Promise<Collaborator>;
  updateCollaborator(id: number, collaborator: Partial<InsertCollaborator>): Promise<Collaborator | undefined>;
  deleteCollaborator(id: number): Promise<boolean>;
  
  // Summary operations
  getClaimSummary(claimId: number): Promise<ClaimSummary | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private claimants: Map<number, Claimant>;
  private claims: Map<number, Claim>;
  private rooms: Map<number, Room>;
  private items: Map<number, Item>;
  private documentations: Map<number, Documentation>;
  private potentialDuplicates: Map<number, PotentialDuplicate>;
  private collaborators: Map<number, Collaborator>;
  
  private currentUserId: number;
  private currentClaimantId: number;
  private currentClaimId: number;
  private currentRoomId: number;
  private currentItemId: number;
  private currentDocumentationId: number;
  private currentPotentialDuplicateId: number;
  private currentCollaboratorId: number;

  constructor() {
    this.users = new Map();
    this.claimants = new Map();
    this.claims = new Map();
    this.rooms = new Map();
    this.items = new Map();
    this.documentations = new Map();
    this.potentialDuplicates = new Map();
    this.collaborators = new Map();
    
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
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { 
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
  
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, lastLogin: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Claimant operations
  async getClaimant(id: number): Promise<Claimant | undefined> {
    return this.claimants.get(id);
  }

  async createClaimant(insertClaimant: InsertClaimant): Promise<Claimant> {
    const id = this.currentClaimantId++;
    const createdAt = new Date();
    const claimant: Claimant = { 
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

  async updateClaimant(id: number, claimant: Partial<InsertClaimant>): Promise<Claimant | undefined> {
    const existingClaimant = this.claimants.get(id);
    if (!existingClaimant) return undefined;
    
    const updatedClaimant = { ...existingClaimant, ...claimant };
    this.claimants.set(id, updatedClaimant);
    return updatedClaimant;
  }
  
  // Claim operations
  async getClaim(id: number): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getClaimsByClaimantId(claimantId: number): Promise<Claim[]> {
    return Array.from(this.claims.values()).filter(
      (claim) => claim.claimantId === claimantId,
    );
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = this.currentClaimId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const claim: Claim = { 
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

  async updateClaim(id: number, claim: Partial<InsertClaim>): Promise<Claim | undefined> {
    const existingClaim = this.claims.get(id);
    if (!existingClaim) return undefined;
    
    const updatedClaim = { 
      ...existingClaim, 
      ...claim, 
      updatedAt: new Date() 
    };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }
  
  // Room operations
  async getRoomsByClaimId(claimId: number): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(
      (room) => room.claimId === claimId,
    );
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const room: Room = { 
      ...insertRoom, 
      id,
      isCustom: insertRoom.isCustom ?? false
    };
    this.rooms.set(id, room);
    return room;
  }
  
  // Item operations
  async getItemsByRoomId(roomId: number): Promise<Item[]> {
    return Array.from(this.items.values()).filter(
      (item) => item.roomId === roomId,
    );
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = this.currentItemId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const item: Item = { 
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
      imageUrls: insertItem.imageUrls || [],
      tags: insertItem.tags || null,
      createdBy: insertItem.createdBy || null,
      updatedBy: insertItem.updatedBy || null
    };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: number, item: Partial<InsertItem>): Promise<Item | undefined> {
    const existingItem = this.items.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem = { ...existingItem, ...item, updatedAt: new Date() };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: number): Promise<boolean> {
    return this.items.delete(id);
  }

  // Documentation operations
  async getDocumentationsByItemId(itemId: number): Promise<Documentation[]> {
    return Array.from(this.documentations.values()).filter(
      (doc) => doc.itemId === itemId
    );
  }

  async getDocumentation(id: number): Promise<Documentation | undefined> {
    return this.documentations.get(id);
  }

  async createDocumentation(insertDocumentation: InsertDocumentation): Promise<Documentation> {
    const id = this.currentDocumentationId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const documentation: Documentation = { 
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

  async updateDocumentation(id: number, documentation: Partial<InsertDocumentation>): Promise<Documentation | undefined> {
    const existingDoc = this.documentations.get(id);
    if (!existingDoc) return undefined;
    
    const updatedDoc = { 
      ...existingDoc, 
      ...documentation, 
      updatedAt: new Date() 
    };
    this.documentations.set(id, updatedDoc);
    return updatedDoc;
  }

  async deleteDocumentation(id: number): Promise<boolean> {
    return this.documentations.delete(id);
  }

  // Potential duplicates operations
  async getPotentialDuplicates(itemId: number): Promise<PotentialDuplicate[]> {
    return Array.from(this.potentialDuplicates.values()).filter(
      (dup) => dup.itemId1 === itemId || dup.itemId2 === itemId
    );
  }

  async createPotentialDuplicate(duplicate: InsertPotentialDuplicate): Promise<PotentialDuplicate> {
    const id = this.currentPotentialDuplicateId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const potentialDuplicate: PotentialDuplicate = { 
      ...duplicate, 
      id, 
      createdAt, 
      updatedAt,
      status: duplicate.status || "pending"
    };
    this.potentialDuplicates.set(id, potentialDuplicate);
    return potentialDuplicate;
  }

  async updatePotentialDuplicateStatus(id: number, status: string): Promise<PotentialDuplicate | undefined> {
    const existingDuplicate = this.potentialDuplicates.get(id);
    if (!existingDuplicate) return undefined;
    
    const updatedDuplicate = { 
      ...existingDuplicate, 
      status, 
      updatedAt: new Date() 
    };
    this.potentialDuplicates.set(id, updatedDuplicate);
    return updatedDuplicate;
  }

  async detectPotentialDuplicates(itemId: number): Promise<PotentialDuplicate[]> {
    // In a real implementation, this would use AI/ML to detect duplicates
    // For now, we'll just do a simple name similarity check
    const targetItem = this.items.get(itemId);
    if (!targetItem) return [];
    
    const potentialDuplicates: PotentialDuplicate[] = [];
    
    // Get all items from the same claim
    const roomsInClaim = await this.getRoomsByClaimId(
      (await this.getRoom(targetItem.roomId))?.claimId || 0
    );
    
    const roomIds = roomsInClaim.map(room => room.id);
    
    // Check all items in the claim except the target item
    for (const item of Array.from(this.items.values())) {
      if (item.id === itemId || !roomIds.includes(item.roomId)) continue;
      
      // Calculate simple string similarity between item names (Levenshtein distance would be better)
      const similarity = this.calculateStringSimilarity(
        targetItem.name.toLowerCase(),
        item.name.toLowerCase()
      );
      
      // If similarity is above threshold, create a potential duplicate
      if (similarity > 0.6) {
        const potentialDuplicate = await this.createPotentialDuplicate({
          itemId1: itemId,
          itemId2: item.id,
          confidence: similarity,
          status: "pending"
        });
        
        potentialDuplicates.push(potentialDuplicate);
      }
    }
    
    return potentialDuplicates;
  }
  
  // Helper method to get a room by ID (needed for detectPotentialDuplicates)
  private async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }
  
  // Simple string similarity calculation
  private calculateStringSimilarity(str1: string, str2: string): number {
    // For demo purposes - a real implementation would use Levenshtein distance
    // or another proper string similarity algorithm
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    // Count shared words
    const sharedWords = words1.filter(word => words2.includes(word)).length;
    
    // Calculate similarity as a ratio of shared words to total unique words
    const uniqueWords = new Set([...words1, ...words2]).size;
    return uniqueWords === 0 ? 0 : sharedWords / uniqueWords;
  }

  // Collaboration operations
  async getCollaboratorsByClaimId(claimId: number): Promise<Collaborator[]> {
    return Array.from(this.collaborators.values()).filter(
      (collaborator) => collaborator.claimId === claimId
    );
  }

  async getCollaboratorsByUserId(userId: number): Promise<Collaborator[]> {
    return Array.from(this.collaborators.values()).filter(
      (collaborator) => collaborator.userId === userId
    );
  }

  async getCollaborator(id: number): Promise<Collaborator | undefined> {
    return this.collaborators.get(id);
  }

  async createCollaborator(insertCollaborator: InsertCollaborator): Promise<Collaborator> {
    const id = this.currentCollaboratorId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const collaborator: Collaborator = { 
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

  async updateCollaborator(id: number, collaborator: Partial<InsertCollaborator>): Promise<Collaborator | undefined> {
    const existingCollaborator = this.collaborators.get(id);
    if (!existingCollaborator) return undefined;
    
    const updatedCollaborator = { 
      ...existingCollaborator, 
      ...collaborator, 
      updatedAt: new Date() 
    };
    this.collaborators.set(id, updatedCollaborator);
    return updatedCollaborator;
  }

  async deleteCollaborator(id: number): Promise<boolean> {
    return this.collaborators.delete(id);
  }
  
  // Summary operations
  async getClaimSummary(claimId: number): Promise<ClaimSummary | undefined> {
    const claim = await this.getClaim(claimId);
    if (!claim) return undefined;

    const claimant = await this.getClaimant(claim.claimantId);
    if (!claimant) return undefined;

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
      rooms: roomsWithItems,
    };
  }
}

export const storage = new MemStorage();
