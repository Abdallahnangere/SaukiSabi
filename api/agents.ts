
import { sql } from './db';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const agents = await sql`SELECT * FROM agents ORDER BY id DESC`;
      return res.status(200).json(agents);
    }
    
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, fullName, phone, pin, status, walletBalance, virtualAccount } = body;
      
      await sql`
        INSERT INTO agents (id, fullName, phone, pin, status, walletBalance, virtualAccount)
        VALUES (${id}, ${fullName}, ${phone}, ${pin}, ${status}, ${walletBalance}, ${JSON.stringify(virtualAccount)})
        ON CONFLICT (id) DO UPDATE SET 
          status = EXCLUDED.status, 
          walletBalance = EXCLUDED.walletBalance, 
          virtualAccount = EXCLUDED.virtualAccount
      `;
      return res.status(200).json({ success: true });
    }

    res.status(405).end();
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
