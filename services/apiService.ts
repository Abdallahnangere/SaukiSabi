
import { Product, DataPlan, Agent, Transaction, Network } from '../types';

const API_BASE = '/api';

// Authoritative Hardcoded Catalog from Amigo Documentation
const HARDCODED_PLANS: DataPlan[] = [
  // MTN (Network ID 1)
  { id: 'mtn_1gb', network: 'MTN', size: '1GB', validity: '30 Days', price: 500, planId: 1001 },
  { id: 'mtn_2gb', network: 'MTN', size: '2GB', validity: '30 Days', price: 1000, planId: 6666 },
  { id: 'mtn_5gb', network: 'MTN', size: '5GB', validity: '30 Days', price: 2000, planId: 9999 },
  { id: 'mtn_10gb', network: 'MTN', size: '10GB', validity: '30 Days', price: 4000, planId: 1110 },
  // Glo (Network ID 2)
  { id: 'glo_1gb', network: 'GLO', size: '1GB', validity: '30 Days', price: 500, planId: 206 },
  { id: 'glo_5gb', network: 'GLO', size: '5GB', validity: '30 Days', price: 2000, planId: 222 },
  { id: 'glo_10gb', network: 'GLO', size: '10GB', validity: '30 Days', price: 4000, planId: 512 },
];

const handleResponse = async (res: Response) => {
  const text = await res.text();
  let data;
  
  try {
    data = JSON.parse(text);
  } catch (e) {
    const snippet = text.substring(0, 150).replace(/<[^>]*>?/gm, '');
    throw new Error(`Sync Error (${res.status}): ${res.statusText || 'Unknown'}. Detail: ${snippet}...`);
  }
  
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `API Error ${res.status}: ${res.statusText}`);
  }
  return data;
};

export const apiService = {
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  async seedDatabase(): Promise<any> {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    return handleResponse(res);
  },

  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return handleResponse(res);
  },

  // Now returns hardcoded plans as requested
  async getDataPlans(network?: string): Promise<DataPlan[]> {
    if (network) {
      return HARDCODED_PLANS.filter(p => p.network === network);
    }
    return HARDCODED_PLANS;
  },

  async saveDataPlan(plan: DataPlan): Promise<void> {
    const res = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    await handleResponse(res);
  },

  async deleteDataPlan(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/plans?id=${id}`, { method: 'DELETE' });
    await handleResponse(res);
  },

  async getAgents(): Promise<Agent[]> {
    const res = await fetch(`${API_BASE}/agents`);
    return handleResponse(res);
  },

  async saveAgent(agent: any): Promise<void> {
    const res = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    });
    await handleResponse(res);
  },

  async updateAgent(agent: any): Promise<void> {
    const res = await fetch(`${API_BASE}/agents`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    });
    await handleResponse(res);
  },

  async getTransactions(phone?: string): Promise<Transaction[]> {
    const url = phone ? `${API_BASE}/transactions?phone=${phone}` : `${API_BASE}/transactions`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async saveTransaction(tx: Transaction): Promise<void> {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    });
    await handleResponse(res);
  }
};
