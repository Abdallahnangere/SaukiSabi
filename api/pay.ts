
import { sql, parseBody, apiError, sendResponse } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = parseBody(req);
    const { amount, email, name, txRef, phone, details, type } = body;
    const fwKey = process.env.FLUTTERWAVE_SECRET_KEY;

    // 1. Validate Environment
    if (!fwKey) {
      return sendResponse(res, 500, { error: "Payment Gateway not configured (Key Missing)." });
    }

    // 2. Contact Flutterwave (Server-to-Server)
    console.log(`Initiating Flutterwave for ${email}...`);
    const fwRes = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fwKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email || 'user@saukimart.com',
        is_permanent: false,
        amount,
        tx_ref: txRef,
        phonenumber: phone,
        firstname: name?.split(' ')[0] || 'Sauki',
        lastname: name?.split(' ')[1] || 'Customer'
      })
    });

    const fwData = await fwRes.json();

    if (!fwRes.ok) {
      console.error("Flutterwave Rejected:", fwData);
      return sendResponse(res, 400, { error: fwData.message || "Payment Gateway Error" });
    }

    const paymentInfo = {
      account_number: fwData.data.account_number,
      bank_name: fwData.data.bank_name,
      account_name: fwData.data.note,
      amount: amount
    };

    // 3. Log to Database
    try {
      const txId = `tx_${Date.now()}`;
      await sql`
        INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
        VALUES (${txId}, ${txRef}, ${type}, ${amount}, 'PENDING', ${Date.now()}, ${phone}, ${details}, ${JSON.stringify(paymentInfo)})
      `;
    } catch (dbErr) {
      console.warn("DB logging failed, but payment account generated.", dbErr);
    }

    return sendResponse(res, 200, paymentInfo);
  } catch (error: any) {
    return apiError(res, error, "PaymentInitiation");
  }
}
