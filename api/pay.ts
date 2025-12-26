
import { sql, getBody, sendJson, reportError } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { amount, email, name, txRef, phone, details, type } = getBody(req);
    const fwKey = process.env.FLUTTERWAVE_SECRET_KEY;

    // 1. Validate Environment
    if (!fwKey) {
      return sendJson(res, 500, { error: "FLUTTERWAVE_SECRET_KEY is missing on server." });
    }

    // 2. Request Virtual Account from Flutterwave
    // We do this BEFORE DB operations to ensure payment always works.
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
        lastname: name?.split(' ')[1] || 'Customer'
      })
    });

    const fwData = await fwRes.json();

    if (!fwRes.ok) {
      return sendJson(res, 400, { 
        error: fwData.message || "Flutterwave rejected account generation." 
      });
    }

    const paymentInfo = {
      account_number: fwData.data.account_number,
      bank_name: fwData.data.bank_name,
      account_name: fwData.data.note,
      amount: amount
    };

    // 3. Try to log to database (Non-blocking)
    // If DB fails, the user still gets their payment info.
    try {
      await sql`
        INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
        VALUES (${`tx_${Date.now()}`}, ${txRef}, ${type}, ${amount}, 'PENDING', ${Date.now()}, ${phone}, ${details}, ${JSON.stringify(paymentInfo)})
      `;
    } catch (dbErr) {
      console.warn("Payment info generated but DB logging failed:", dbErr);
    }

    return sendJson(res, 200, paymentInfo);
  } catch (err: any) {
    return reportError(res, err, "PaymentProxy");
  }
}
