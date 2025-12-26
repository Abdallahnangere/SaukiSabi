
import { Product, DataPlan, Agent, Transaction, TransactionStatus } from '../types';

const API_BASE = '/api';

// This service centralizes all communication. 
// For production, these fetch calls connect to your Vercel Serverless Functions which talk to Neon.
export const apiService = {
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      // Fallback to initial local data if API is not yet deployed
      const local = localStorage.getItem('SAUKI_PRODUCTS');
      return local ? JSON.parse(local) : [];
    }
  },

  // Added handling for new products when updating local cache
  async updateProduct(product: Product): Promise<void> {
    await fetch(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(product)
    });
    // Persist locally for immediate UI feedback in demo mode
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id === product.id);
    if (idx > -1) {
      products[idx] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem('SAUKI_PRODUCTS', JSON.stringify(products));
  },

  async getDataPlans(): Promise<DataPlan[]> {
    try {
      const res = await fetch(`${API_BASE}/plans`);
      return await res.json();
    } catch {
      const local = localStorage.getItem('SAUKI_PLANS');
      return local ? JSON.parse(local) : [];
    }
  },

  // Fix: Added missing saveDataPlan method required by AdminDashboard.tsx
  async saveDataPlan(plan: DataPlan): Promise<void> {
    await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      body: JSON.stringify(plan)
    });
    // Persist locally for immediate UI feedback in demo mode
    const plans = await this.getDataPlans();
    const idx = plans.findIndex(p => p.id === plan.id);
    if (idx > -1) {
      plans[idx] = plan;
    } else {
      plans.push(plan);
    }
    localStorage.setItem('SAUKI_PLANS', JSON.stringify(plans));
  },

  async saveTransaction(tx: Transaction): Promise<void> {
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      body: JSON.stringify(tx)
    });
    const txs = JSON.parse(localStorage.getItem('SAUKI_TX') || '[]');
    txs.push(tx);
    localStorage.setItem('SAUKI_TX', JSON.stringify(txs));
  },

  async getTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      return await res.json();
    } catch {
      return JSON.parse(localStorage.getItem('SAUKI_TX') || '[]');
    }
  },

  async getAgents(): Promise<Agent[]> {
    try {
      const res = await fetch(`${API_BASE}/agents`);
      return await res.json();
    } catch {
      return JSON.parse(localStorage.getItem('SAUKI_AGENTS') || '[]');
    }
  }
};
