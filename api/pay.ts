
import { sql, getBody, sendJson, reportError } from './db';

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { amount, email, name, txRef, phone, details, type } = getBody(req);
    const fwKey = process.env.FLUTTERWAVE_SECRET_KEY;

    // 1. Check Config First
    if (!fwKey) {
      return sendJson(res, 500, { 
        error: "FLUTTERWAVE_SECRET_KEY is missing on the server. Cannot 'summon' payment API." 
      });
    }

    // 2. Summon Flutterwave Virtual Account
    console.log(`[PAY] Initiating Flutterwave for: ${email}`);
    
    const fwRes = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fwKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email || 'customer@saukimart.com',
        is_permanent: false,
        amount: amount,
        tx_ref: txRef,
        phonenumber: phone,
        firstname: name?.split(' ')[0] || 'Sauki',
        lastname: name?.split(' ')[1] || 'Customer',
        narration: `Payment for ${details}`
      })
    });

    const fwData = await fwRes.json();

    if (!fwRes.ok) {
      console.error("[PAY] Flutterwave Rejected:", fwData);
      return sendJson(res, 400, { 
        error: fwData.message || "Flutterwave rejected the account request." 
      });
    }

    // Successful data from Flutterwave
    const paymentInfo = {
      account_number: fwData.data.account_number,
      bank_name: fwData.data.bank_name,
      account_name: fwData.data.note,
      amount: amount,
      txRef: txRef
    };

    // 3. Optional Database Logging (Non-blocking)
    // We try to log the transaction, but if it fails, we still return the payment info to the user.
    try {
      await sql`
        INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
        VALUES (${`tx_${Date.now()}`}, ${txRef}, ${type}, ${amount}, 'PENDING', ${Date.now()}, ${phone}, ${details}, ${JSON.stringify(paymentInfo)})
      `;
    } catch (dbErr: any) {
      console.warn("[PAY] Payment details generated but DB log failed:", dbErr.message);
      // We don't return here; we want the user to get the paymentInfo regardless.
    }

    return sendJson(res, 200, paymentInfo);
  } catch (err: any) {
    return reportError(res, err, "PaymentSummoner");
  }
}
