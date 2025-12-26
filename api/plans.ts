
import { sql } from './db';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const plans = await sql`SELECT * FROM data_plans ORDER BY network ASC, price ASC`;
      return res.status(200).json(plans);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, network, size, validity, price, planId } = body;
      
      await sql`
        INSERT INTO data_plans (id, network, size, validity, price, planId)
        VALUES (${id}, ${network}, ${size}, ${validity}, ${price}, ${planId})
        ON CONFLICT (id) DO UPDATE SET 
          network = EXCLUDED.network, 
          size = EXCLUDED.size, 
          validity = EXCLUDED.validity, 
          price = EXCLUDED.price, 
          planId = EXCLUDED.planId
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
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
