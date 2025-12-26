
import { Network, Transaction, TransactionStatus, TransactionType } from '../types';

// Fix: Accessing environment variables via process.env instead of import.meta.env to match the execution environment
const AMIGO_BASE_URL = process.env.VITE_AMIGO_BASE_URL || 'https://amigo.ng/api';
// Fix: Use process.env for AMIGO_API_KEY
const AMIGO_API_KEY = process.env.VITE_AMIGO_API_KEY; 

// Fix: Use process.env for FLUTTERWAVE_SECRET_KEY
const FLUTTERWAVE_SECRET_KEY = process.env.VITE_FLUTTERWAVE_SECRET_KEY;
// Fix: Use process.env for MY_BVN
const MY_BVN = process.env.VITE_MY_BVN;

/**
 * SECURITY NOTE: 
 * Sensitive keys like SECRET_KEY should ideally only be used in /api serverless functions.
 * If used here, ensure they are prefixed with VITE_ in your Vercel Dashboard.
 */

export const amigoApi = {
  async deliverData(payload: { network: number; mobile_number: string; plan: number; Ported_number: boolean }) {
    if (!AMIGO_API_KEY) throw new Error('AMIGO_API_KEY is not configured');
    
    const response = await fetch(`${AMIGO_BASE_URL}/data/`, {
      method: 'POST',
      headers: {
        'X-API-Key': AMIGO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Amigo API delivery failed');
    }
    
    return await response.json();
  }
};

export const flutterwaveApi = {
  async generateVirtualAccount(amount: number, email: string, name: string, txRef: string) {
    if (!FLUTTERWAVE_SECRET_KEY) throw new Error('FLUTTERWAVE_SECRET_KEY is not configured');

    const response = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        is_permanent: false,
        amount: amount,
        tx_ref: txRef,
        phonenumber: "09000000000",
        firstname: name.split(' ')[0] || 'Customer',
        lastname: name.split(' ')[1] || 'Sauki'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Flutterwave account generation failed');
    }

    const data = await response.json();
    return {
      account_number: data.data.account_number,
      bank_name: data.data.bank_name,
      account_name: data.data.note,
      amount: amount
    };
  },

  async generateAgentStaticAccount(agentName: string, agentPhone: string) {
    if (!FLUTTERWAVE_SECRET_KEY) throw new Error('FLUTTERWAVE_SECRET_KEY is not configured');

    const response = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: `${agentPhone}@saukimart.com`,
        is_permanent: true,
        bvn: MY_BVN,
        tx_ref: `AGENT-${agentPhone}-${Date.now()}`,
        phonenumber: agentPhone,
        firstname: agentName.split(' ')[0] || 'Agent',
        lastname: agentName.split(' ')[1] || 'Sauki'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Static account generation failed');
    }

    const data = await response.json();
    return {
      account_number: data.data.account_number,
      bank_name: data.data.bank_name,
      account_name: data.data.note
    };
  }
};
