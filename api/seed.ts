
import { sql } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    // 1. Seed MTN Plan ID 1001
    await sql`
      INSERT INTO data_plans (id, network, size, validity, price, planId)
      VALUES ('seed_mtn_1gb', 'MTN', '1.0GB', '30 Days', 450, 1001)
      ON CONFLICT (id) DO UPDATE SET price = 450, planId = 1001
    `;

    // 2. Seed Default Product
    await sql`
      INSERT INTO products (id, name, description, specifications, price, imageUrl, inStock)
      VALUES ('seed_router', 'MTN 5G Router Pro', 'Industrial grade connectivity', '["5G Support", "Wi-Fi 6"]', 55000, '/router.png', true)
      ON CONFLICT (id) DO UPDATE SET price = 55000
    `;

    res.status(200).json({ success: true, message: "Database seeded with MTN 1001 Plan" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
