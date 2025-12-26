import { sql, getSafeBody, apiError } from './db';

export default async function handler(req: any, res: any) {
  console.log("Payment Handler Started"); // Debug Log

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = getSafeBody(req);
    const { amount, email, name, txRef, phone, details, type } = body;
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) {
      console.error("Missing FLUTTERWAVE_SECRET_KEY");
      return res.status(500).json({ error: "Server Configuration Error: Flutterwave Key Missing" });
    }

    console.log(`Initiating Payment for ${email}, Ref: ${txRef}`);

    // 1. Generate Virtual Account from Flutterwave
    const fwResponse = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email || 'customer@saukimart.com',
        is_permanent: false,
        amount,
        tx_ref: txRef,
        phonenumber: phone,
        firstname: name ? name.split(' ')[0] : 'Sauki',
        lastname: name && name.split(' ').length > 1 ? name.split(' ')[1] : 'Customer'
      })
    });

    const fwData = await fwResponse.json();

    if (!fwResponse.ok) {
      console.error("FW API Error Details:", fwData);
      return res.status(400).json({ 
        error: fwData.message || "Flutterwave could not generate an account." 
      });
    }

    const pInfo = {
      account_number: fwData.data.account_number,
      bank_name: fwData.data.bank_name,
      account_name: fwData.data.note,
      amount: amount
    };

    // 2. Persist transaction to database
    const txId = `tx_${Date.now()}`;
    const timestamp = Date.now();
    
    try {
      await sql`
        INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
        VALUES (${txId}, ${txRef}, ${type}, ${amount}, 'PENDING', ${timestamp}, ${phone}, ${details}, ${JSON.stringify(pInfo)})
      `;
    } catch (dbErr: any) {
      console.error("DB Insert Failed (Non-fatal):", dbErr.message);
      // We do NOT stop here. We still return the bank details so the user can pay.
    }

    return res.status(200).json(pInfo);
  } catch (error: any) {
    return apiError(res, error, "PaymentProxy");
  }
}
