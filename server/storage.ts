import { 
  users, type User, type InsertUser,
  claimants, type Claimant, type InsertClaimant,
  claims, type Claim, type InsertClaim,
  rooms, type Room, type InsertRoom,
  items, type Item, type InsertItem,
  type ClaimSummary
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  
  // Summary operations
  getClaimSummary(claimId: number): Promise<ClaimSummary | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private claimants: Map<number, Claimant>;
  private claims: Map<number, Claim>;
  private rooms: Map<number, Room>;
  private items: Map<number, Item>;
  
  private currentUserId: number;
  private currentClaimantId: number;
  private currentClaimId: number;
  private currentRoomId: number;
  private currentItemId: number;

  constructor() {
    this.users = new Map();
    this.claimants = new Map();
    this.claims = new Map();
    this.rooms = new Map();
    this.items = new Map();
    
    this.currentUserId = 1;
    this.currentClaimantId = 1;
    this.currentClaimId = 1;
    this.currentRoomId = 1;
    this.currentItemId = 1;
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Claimant operations
  async getClaimant(id: number): Promise<Claimant | undefined> {
    return this.claimants.get(id);
  }

  async createClaimant(insertClaimant: InsertClaimant): Promise<Claimant> {
    const id = this.currentClaimantId++;
    const createdAt = new Date();
    const claimant: Claimant = { ...insertClaimant, id, createdAt };
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
    const claim: Claim = { ...insertClaim, id, createdAt, updatedAt };
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
    const room: Room = { ...insertRoom, id };
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
    const item: Item = { ...insertItem, id, createdAt };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: number, item: Partial<InsertItem>): Promise<Item | undefined> {
    const existingItem = this.items.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem = { ...existingItem, ...item };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: number): Promise<boolean> {
    return this.items.delete(id);
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
