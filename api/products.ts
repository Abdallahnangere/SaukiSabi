
// Use parseBody instead of non-existent getSafeBody
import { sql, parseBody, apiError } from './db';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const products = await sql`SELECT * FROM products ORDER BY price DESC`;
      return res.status(200).json(products);
    }
    
    if (req.method === 'POST') {
      // Use parseBody instead of non-existent getSafeBody
      const body = parseBody(req);
      const { id, name, description, specifications, price, imageUrl, inStock } = body;
      
      if (!id || !name || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await sql`
        INSERT INTO products (id, name, description, specifications, price, imageUrl, inStock)
        VALUES (${id}, ${name}, ${description}, ${JSON.stringify(specifications || [])}, ${price}, ${imageUrl}, ${inStock})
        ON CONFLICT (id) DO UPDATE SET 
          name = EXCLUDED.name, 
          description = EXCLUDED.description, 
          specifications = EXCLUDED.specifications, 
          price = EXCLUDED.price, 
          imageUrl = EXCLUDED.imageUrl, 
          inStock = EXCLUDED.inStock
      `;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    res.status(405).end();
  } catch (error: any) {
    return apiError(res, error, "Products");
  }
}
