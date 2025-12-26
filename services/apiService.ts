
import { Product, DataPlan, Agent, Transaction } from '../types';

const API_BASE = '/api';

const handleResponse = async (res: Response) => {
  const text = await res.text();
  let data;
  
  try {
    data = JSON.parse(text);
  } catch (e) {
    // If we can't parse JSON, it's likely a 404/500 HTML page or a plain text error
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

  async getDataPlans(network?: string): Promise<DataPlan[]> {
    const url = network ? `${API_BASE}/plans?network=${network}` : `${API_BASE}/plans`;
    const res = await fetch(url);
    return handleResponse(res);
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
