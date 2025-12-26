
import { Product, DataPlan, Agent, Transaction } from '../types';

const API_BASE = '/api';

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return res.ok ? await res.json() : [];
  },

  async updateProduct(product: Product): Promise<void> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Save failed');
  },

  async getDataPlans(): Promise<DataPlan[]> {
    const res = await fetch(`${API_BASE}/plans`);
    return res.ok ? await res.json() : [];
  },

  async saveDataPlan(plan: DataPlan): Promise<void> {
    const res = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('Save failed');
  },

  async deleteDataPlan(id: string): Promise<void> {
    await fetch(`${API_BASE}/plans?id=${id}`, { method: 'DELETE' });
  },

  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE}/transactions`);
    return res.ok ? await res.json() : [];
  },

  async saveTransaction(tx: Transaction): Promise<void> {
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    });
  },

  async getAgents(): Promise<Agent[]> {
    const res = await fetch(`${API_BASE}/agents`);
    return res.ok ? await res.json() : [];
  },

  async saveAgent(agent: Agent): Promise<void> {
    const res = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    });
    if (!res.ok) throw new Error('Onboarding failed');
  }
};
