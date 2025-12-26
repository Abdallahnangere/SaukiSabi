
import { sql, getSafeBody, apiError } from './db';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { phone } = req.query;
      const txs = phone 
        ? await sql`SELECT * FROM transactions WHERE phone = ${phone} ORDER BY timestamp DESC`
        : await sql`SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 100`;
      return res.status(200).json(txs);
    }
    
    if (req.method === 'POST') {
      const body = getSafeBody(req);
      const { id, reference, type, amount, status, timestamp, phone, details, paymentDetails } = body;
      
      await sql`
        INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
        VALUES (${id}, ${reference}, ${type}, ${amount}, ${status}, ${timestamp}, ${phone}, ${details}, ${JSON.stringify(paymentDetails)})
        ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
      `;
      return res.status(200).json({ success: true });
    }

    res.status(405).end();
  } catch (error: any) {
    // Corrected sendError to apiError
    return apiError(res, error, "Transactions");
  }
}
