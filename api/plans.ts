
// Use parseBody instead of non-existent getSafeBody
import { sql, parseBody, apiError } from './db';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { network } = req.query;
      const plans = network 
        ? await sql`SELECT * FROM data_plans WHERE network = ${network} AND isActive = true ORDER BY price ASC`
        : await sql`SELECT * FROM data_plans ORDER BY network ASC, price ASC`;
      return res.status(200).json(plans);
    }

    if (req.method === 'POST') {
      // Use parseBody instead of non-existent getSafeBody
      const body = parseBody(req);
      const { id, network, size, validity, price, planId } = body;
      
      if (!id || !network || !size || !price) return res.status(400).json({ error: "Missing required fields" });

      await sql`
        INSERT INTO data_plans (id, network, size, validity, price, planId, isActive)
        VALUES (${id}, ${network}, ${size}, ${validity || '30 Days'}, ${price}, ${planId || 0}, true)
        ON CONFLICT (id) DO UPDATE SET 
          network = EXCLUDED.network, size = EXCLUDED.size, price = EXCLUDED.price, planId = EXCLUDED.planId
      `;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM data_plans WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    res.status(405).end();
  } catch (error: any) {
    // Corrected sendError to apiError
    return apiError(res, error, "Plans");
  }
}
