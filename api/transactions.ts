
import { sql, parseBody, apiError, sendResponse } from './db';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { phone } = req.query;
      const txs = phone 
        ? await sql`SELECT * FROM transactions WHERE phone = ${phone} ORDER BY timestamp DESC`
        : await sql`SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 50`;
      return sendResponse(res, 200, txs);
    }
    
    if (req.method === 'POST') {
      const body = parseBody(req);
      const { id, reference, type, amount, status, timestamp, phone, details, paymentDetails } = body;
      
      await sql`
        INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
        VALUES (${id}, ${reference}, ${type}, ${amount}, ${status}, ${timestamp}, ${phone}, ${details}, ${JSON.stringify(paymentDetails)})
        ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
      `;
      return sendResponse(res, 200, { success: true });
    }

    res.status(405).end();
  } catch (error: any) {
    return apiError(res, error, "TransactionsList");
  }
}
