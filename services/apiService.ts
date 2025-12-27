
import { Product, DataPlan, Agent, Transaction } from '../types';

const GATEWAY = '/api?action=';
const EXTERNAL = '/api/pay?intent=';

const handleResponse = async (res: Response) => {
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Critical Error: Expected JSON but got "${text.substring(0, 50)}..."`);
  }
  if (!res.ok) throw new Error(data.error || data.message || `API Error ${res.status}`);
  return data;
};

export const apiService = {
  async getHealth() { return handleResponse(await fetch(`${GATEWAY}health`)); },
  async seedDatabase() { return handleResponse(await fetch(`${GATEWAY}seed`, { method: 'POST' })); },
  async getProducts(): Promise<Product[]> { return handleResponse(await fetch(`${GATEWAY}products`)); },
  async saveProduct(p: Product) { return handleResponse(await fetch(`${GATEWAY}products`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(p) })); },
  
  // Fix: Added network parameter to support filtering
  async getDataPlans(network?: string): Promise<DataPlan[]> { 
    const url = network ? `${GATEWAY}plans&network=${network}` : `${GATEWAY}plans`;
    return handleResponse(await fetch(url)); 
  },
  async saveDataPlan(p: DataPlan) { return handleResponse(await fetch(`${GATEWAY}plans`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(p) })); },
  async deleteDataPlan(id: string) { return handleResponse(await fetch(`${GATEWAY}plans&id=${id}`, { method: 'DELETE' })); },

  async getAgents(): Promise<Agent[]> { return handleResponse(await fetch(`${GATEWAY}agents`)); },
  async saveAgent(a: any) { return handleResponse(await fetch(`${GATEWAY}agents`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(a) })); },
  async updateAgent(a: any) { return handleResponse(await fetch(`${GATEWAY}agents`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(a) })); },

  async getTransactions(phone?: string): Promise<Transaction[]> { return handleResponse(await fetch(`${GATEWAY}transactions${phone ? `&phone=${phone}` : ''}`)); },
  async saveTransaction(t: Transaction) { return handleResponse(await fetch(`${GATEWAY}transactions`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(t) })); }
};

export const externalApi = {
  async initiatePayment(params: any) {
    return handleResponse(await fetch(`${EXTERNAL}initiate`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(params) }));
  },
  async deliverData(payload: any) {
    return handleResponse(await fetch(`${EXTERNAL}deliver`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) }));
  }
};
