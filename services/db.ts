
import { Product, DataPlan, Agent, Transaction, TransactionStatus, TransactionType } from '../types';

const DB_KEY = 'SAUKI_MART_DB';

interface DBStore {
  products: Product[];
  dataPlans: DataPlan[];
  agents: Agent[];
  transactions: Transaction[];
}

const INITIAL_DB: DBStore = {
  products: [
    {
      id: 'p1',
      name: 'MTN 5G Broadband Router',
      description: 'Experience blazing fast 5G speeds. Perfect for home and office use.',
      specifications: ['5G/4G/3G Support', 'Wi-Fi 6 Technology', 'Up to 32 users', 'Gigabit Ethernet'],
      price: 55000,
      imageUrl: 'https://picsum.photos/seed/router/400/400',
      inStock: true
    },
    {
      id: 'p2',
      name: 'MTN 4G LTE MiFi',
      description: 'Portable high-speed internet on the go.',
      specifications: ['4G LTE Support', '8 Hours Battery', 'Up to 10 users', 'Pocket size'],
      price: 15000,
      imageUrl: 'https://picsum.photos/seed/mifi/400/400',
      inStock: true
    }
  ],
  dataPlans: [
    { id: 'd1', network: 'MTN', size: '1GB', validity: '30 Days', price: 429, planId: 1001 },
    { id: 'd2', network: 'MTN', size: '2GB', validity: '30 Days', price: 849, planId: 6666 },
    { id: 'd3', network: 'MTN', size: '5GB', validity: '30 Days', price: 1799, planId: 9999 },
    { id: 'd4', network: 'GLO', size: '1GB', validity: '30 Days', price: 399, planId: 206 },
  ],
  agents: [],
  transactions: []
};

export const dbService = {
  getStore(): DBStore {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : INITIAL_DB;
  },

  saveStore(store: DBStore) {
    localStorage.setItem(DB_KEY, JSON.stringify(store));
  },

  getProducts(): Product[] {
    return this.getStore().products;
  },

  updateProducts(products: Product[]) {
    const store = this.getStore();
    store.products = products;
    this.saveStore(store);
  },

  getDataPlans(): DataPlan[] {
    return this.getStore().dataPlans;
  },

  saveDataPlan(plan: DataPlan) {
    const store = this.getStore();
    const index = store.dataPlans.findIndex(p => p.id === plan.id);
    if (index > -1) {
      store.dataPlans[index] = plan;
    } else {
      store.dataPlans.push(plan);
    }
    this.saveStore(store);
  },

  deleteDataPlan(id: string) {
    const store = this.getStore();
    store.dataPlans = store.dataPlans.filter(p => p.id !== id);
    this.saveStore(store);
  },

  getAgents(): Agent[] {
    return this.getStore().agents;
  },

  saveAgent(agent: Agent) {
    const store = this.getStore();
    const index = store.agents.findIndex(a => a.id === agent.id);
    if (index > -1) {
      store.agents[index] = agent;
    } else {
      store.agents.push(agent);
    }
    this.saveStore(store);
  },

  getTransactions(): Transaction[] {
    return this.getStore().transactions;
  },

  saveTransaction(tx: Transaction) {
    const store = this.getStore();
    const index = store.transactions.findIndex(t => t.id === tx.id);
    if (index > -1) {
      store.transactions[index] = tx;
    } else {
      store.transactions.push(tx);
    }
    this.saveStore(store);
  },

  getUserTransactions(phone: string): Transaction[] {
    return this.getStore().transactions
      .filter(tx => tx.phone === phone)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
  }
};
