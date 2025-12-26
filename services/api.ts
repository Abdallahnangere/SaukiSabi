
import { Network, Transaction, TransactionStatus, TransactionType } from '../types';

/**
 * ENVIRONMENT VARIABLES:
 * These are now mapped in vite.config.ts from your standard Vercel 
 * Environment Variables.
 */

const AMIGO_BASE_URL = process.env.AMIGO_BASE_URL;
const AMIGO_API_KEY = process.env.AMIGO_API_KEY; 
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const MY_BVN = process.env.MY_BVN;

export const amigoApi = {
  async deliverData(payload: { network: number; mobile_number: string; plan: number; Ported_number: boolean }) {
    if (!AMIGO_API_KEY) throw new Error('AMIGO_API_KEY is not configured');
    
    // Always use the base URL from env
    const url = `${AMIGO_BASE_URL || 'https://amigo.ng/api'}/data/`;
    
    const response = await fetch(url, {
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
