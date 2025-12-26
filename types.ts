
export type Network = 'MTN' | 'AIRTEL' | 'GLO';

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  DELIVERING = 'DELIVERING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED'
}

export enum TransactionType {
  PRODUCT = 'PRODUCT',
  DATA = 'DATA',
  AGENT_DATA = 'AGENT_DATA'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  specifications: string[];
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export interface DataPlan {
  id: string;
  network: Network;
  size: string;
  validity: string;
  price: number;
  planId: number; // Amigo internal ID
}

export interface Agent {
  id: string;
  fullName: string;
  phone: string;
  pin: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  walletBalance: number;
  virtualAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  phone: string;
  details: string;
  receiptUrl?: string;
  paymentDetails?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
  };
}

export interface AppState {
  products: Product[];
  dataPlans: DataPlan[];
  agents: Agent[];
  transactions: Transaction[];
  currentAgent: Agent | null;
  isAdmin: boolean;
}
