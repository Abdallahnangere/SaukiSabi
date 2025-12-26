
import { Network, Transaction, TransactionStatus, TransactionType } from '../types';

/**
 * All sensitive API calls now route through /api/pay or /api/data 
 * to handle CORS and protect secret keys.
 */

export const amigoApi = {
  async deliverData(payload: { network: number; mobile_number: string; plan: number; Ported_number: boolean }) {
    // This routes to our internal API which then calls Amigo
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Delivery failed');
    }
    
    return await response.json();
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
    // Calling our internal proxy instead of Flutterwave directly
    const response = await fetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment initialization failed');
    }

    return await response.json();
  }
};
