
// Use parseBody instead of non-existent getSafeBody
import { sql, parseBody, apiError } from './db';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const agents = await sql`SELECT * FROM agents ORDER BY id DESC`;
      return res.status(200).json(agents);
    }
    
    if (req.method === 'POST') {
      // Use parseBody instead of non-existent getSafeBody
      const body = parseBody(req);
      const { id, fullName, phone, pin } = body;
      
      if (!id || !fullName || !phone || !pin) return res.status(400).json({ error: "Required: id, name, phone, pin" });

      await sql`
        INSERT INTO agents (id, fullName, phone, pin, status, walletBalance)
        VALUES (${id}, ${fullName}, ${phone}, ${pin}, 'PENDING', 0)
      `;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'PATCH') {
      // Use parseBody instead of non-existent getSafeBody
      const body = parseBody(req);
      const { id, status, virtualAccount, walletBalance } = body;
      await sql`
        UPDATE agents SET 
          status = COALESCE(${status}, status),
          virtualAccount = COALESCE(${JSON.stringify(virtualAccount)}, virtualAccount),
          walletBalance = COALESCE(${walletBalance}, walletBalance)
        WHERE id = ${id}
      `;
      return res.status(200).json({ success: true });
    }

    res.status(405).end();
  } catch (error: any) {
    // Corrected sendError to apiError
    return apiError(res, error, "Agents");
  }
}
