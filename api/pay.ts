
import { sql, getSafeBody, apiError } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, email, name, txRef, phone, details, type } = getSafeBody(req);
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) throw new Error("Server Configuration Error: Flutterwave Key is missing.");

    // 1. Call Flutterwave from the Backend (No CORS issues here)
    const fwResponse = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        is_permanent: false,
        amount,
        tx_ref: txRef,
        phonenumber: phone,
        firstname: name.split(' ')[0] || 'Customer',
        lastname: name.split(' ')[1] || 'Sauki'
      })
    });

    const fwData = await fwResponse.json();

    if (!fwResponse.ok) {
      console.error("Flutterwave API Error:", fwData);
      return res.status(400).json({ error: fwData.message || "Failed to generate payment account" });
    }

    const pInfo = {
      account_number: fwData.data.account_number,
      bank_name: fwData.data.bank_name,
      account_name: fwData.data.note,
      amount: amount
    };

    // 2. Save the transaction to the database automatically
    const txId = `tx_${Date.now()}`;
    const timestamp = Date.now();
    
    await sql`
      INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
      VALUES (${txId}, ${txRef}, ${type}, ${amount}, 'PENDING', ${timestamp}, ${phone}, ${details}, ${JSON.stringify(pInfo)})
    `;

    return res.status(200).json(pInfo);
  } catch (error: any) {
    return apiError(res, error, "PaymentProxy");
  }
}
