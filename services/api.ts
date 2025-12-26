import { Network, Transaction, TransactionStatus, TransactionType } from '../types';

/**
 * All sensitive API calls now route through /api/pay or /api/data 
 * to handle CORS and protect secret keys.
 */

// Helper to safely parse responses, even if they are HTML error pages
const safeFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    // If we can't parse JSON, it's likely a server 500 error page or plain text
    throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}...`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }

  return data;
};

export const amigoApi = {
  async deliverData(payload: { network: number; mobile_number: string; plan: number; Ported_number: boolean }) {
    return safeFetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
};

export const flutterwaveApi = {
  async initiatePayment(params: {
    amount: number;
    email: string;
    name: string;
    txRef: string;
    phone: string;
    details: string;
    type: string;
  }) {
    return safeFetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
  }
};
