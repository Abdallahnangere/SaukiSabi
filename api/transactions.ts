
import { sql } from './db';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const { phone } = req.query;
    if (phone) {
      const txs = await sql`SELECT * FROM transactions WHERE phone = ${phone} ORDER BY timestamp DESC LIMIT 10`;
      return res.status(200).json(txs);
    }
    const txs = await sql`SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 50`;
    return res.status(200).json(txs);
  }
  
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { id, reference, type, amount, status, timestamp, phone, details, paymentDetails } = body;
    
    await sql`
      INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails)
      VALUES (${id}, ${reference}, ${type}, ${amount}, ${status}, ${timestamp}, ${phone}, ${details}, ${JSON.stringify(paymentDetails)})
      ON CONFLICT (id) DO UPDATE SET 
        status = EXCLUDED.status
    `;
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
