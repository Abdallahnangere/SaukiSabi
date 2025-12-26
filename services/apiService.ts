
import { Product, DataPlan, Agent, Transaction } from '../types';

const API_BASE = '/api';

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
};

export const apiService = {
  // Health & System
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  async seedDatabase(): Promise<any> {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    return handleResponse(res);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return handleResponse(res);
  },

  async updateProduct(product: Product): Promise<void> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    await handleResponse(res);
  },

  // Plans
  async getDataPlans(): Promise<DataPlan[]> {
    const res = await fetch(`${API_BASE}/plans`);
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

  // Agents
  async getAgents(): Promise<Agent[]> {
    const res = await fetch(`${API_BASE}/agents`);
    return handleResponse(res);
  },

  async saveAgent(agent: Agent): Promise<void> {
    const res = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    });
    await handleResponse(res);
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE}/transactions`);
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
