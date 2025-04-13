
export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  selectedCurrency: string;
  selectedLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  userId: string;
  claimId: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  cost: number;
  currency: string;
  roomId: string;
  userId: string;
  claimId: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Claim {
  id: string;
  userId: string;
  status: 'draft' | 'submitted' | 'approved' | 'denied';
  totalAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  deniedAt?: Date;
  notes?: string;
}

export interface AiPromptLog {
  id: string;
  userId: string;
  prompt: string;
  response: string;
  createdAt: Date;
  success: boolean;
  model: string;
  tokensUsed?: number;
}
