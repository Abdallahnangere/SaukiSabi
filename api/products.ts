
import { sql } from './db';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const products = await sql`SELECT * FROM products ORDER BY price DESC`;
    return res.status(200).json(products);
  }
  
  if (req.method === 'POST') {
    const { id, name, description, specifications, price, imageUrl, inStock } = JSON.parse(req.body);
    await sql`
      INSERT INTO products (id, name, description, specifications, price, imageUrl, inStock)
      VALUES (${id}, ${name}, ${description}, ${JSON.stringify(specifications)}, ${price}, ${imageUrl}, ${inStock})
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
}
