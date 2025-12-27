
import { sql, jsonResponse, catchApi, getSafeBody } from './db';

/**
 * EXTERNAL INTEGRATION HANDLER
 */
export default async function handler(req: any, res: any) {
  const { intent } = req.query;

  return catchApi(res, async () => {
    if (intent === 'initiate') {
      const { amount, email, name, txRef, phone, details, type } = getSafeBody(req);
      const fwKey = process.env.FLUTTERWAVE_SECRET_KEY;
      if (!fwKey) throw new Error("Server: Flutterwave key missing.");

      const fwRes = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${fwKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount, tx_ref: txRef, phonenumber: phone, firstname: name.split(' ')[0] })
      });

      const fwData = await fwRes.json();
      if (!fwRes.ok) throw new Error(fwData.message || "Payment Gateway Error");

      const paymentInfo = { account_number: fwData.data.account_number, bank_name: fwData.data.bank_name, account_name: fwData.data.note, amount, txRef };
      
      // Auto-log initial transaction
      await sql`INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails) VALUES (${`tx_${Date.now()}`}, ${txRef}, ${type}, ${amount}, 'PENDING', ${Date.now()}, ${phone}, ${details}, ${JSON.stringify(paymentInfo)})`;
      
      return jsonResponse(res, 200, paymentInfo);
    }

    if (intent === 'deliver') {
      const { network, mobile_number, plan, Ported_number } = getSafeBody(req);
      const apiKey = process.env.AMIGO_API_KEY;
      const baseUrl = process.env.AMIGO_BASE_URL || 'https://amigo.ng/api';
      if (!apiKey) throw new Error("Server: Amigo API Key missing.");

      const response = await fetch(`${baseUrl}/data/`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ network, mobile_number, plan, Ported_number })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Data Gateway Rejected Delivery");
      return jsonResponse(res, 200, result);
    }

    return jsonResponse(res, 400, { error: "Invalid intent" });
  }, "ExternalProcessor");
}
