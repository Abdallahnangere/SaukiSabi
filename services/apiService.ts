
import { Product, DataPlan, Agent, Transaction, TransactionStatus } from '../types';

const API_BASE = '/api';

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) return [];
    return await res.json();
  },

  async updateProduct(product: Product): Promise<void> {
    await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${API_BASE}/products?id=${id}`, {
      method: 'DELETE'
    });
  },

  async getDataPlans(): Promise<DataPlan[]> {
    const res = await fetch(`${API_BASE}/plans`);
    if (!res.ok) return [];
    return await res.json();
  },

  async saveDataPlan(plan: DataPlan): Promise<void> {
    const res = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('Failed to save data plan');
  },

  async deleteDataPlan(id: string): Promise<void> {
    await fetch(`${API_BASE}/plans?id=${id}`, {
      method: 'DELETE'
    });
  },

  async saveTransaction(tx: Transaction): Promise<void> {
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    });
  },

  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getUserTransactions(phone: string): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE}/transactions?phone=${phone}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getAgents(): Promise<Agent[]> {
    const res = await fetch(`${API_BASE}/agents`);
    if (!res.ok) return [];
    return await res.json();
  },

  async saveAgent(agent: Agent): Promise<void> {
    const res = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    });
    if (!res.ok) throw new Error('Failed to save agent');
  }
};
