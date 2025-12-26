
import { sql, apiError } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    // 1. Seed Mandatory MTN Plan (ID: 1001)
    await sql`
      INSERT INTO data_plans (id, network, size, validity, price, planId, isActive)
      VALUES ('seed_mtn_1gb_1001', 'MTN', '1.0GB', '30 Days', 450, 1001, true)
      ON CONFLICT (id) DO UPDATE SET price = 450, planId = 1001, isActive = true
    `;

    // 2. Seed High-Value Hardware
    await sql`
      INSERT INTO products (id, name, description, specifications, price, imageUrl, inStock)
      VALUES ('seed_router_pro', 'MTN 5G Router Pro', 'Industrial grade 5G broadband connectivity.', '["Wi-Fi 6", "Gigabit Port"]', 55000, '/router.png', true)
      ON CONFLICT (id) DO UPDATE SET price = 55000, inStock = true
    `;

    return res.status(200).json({ success: true, message: "System initialized with authoritative data (MTN 1001 included)." });
  } catch (error: any) {
    return apiError(res, error, "Seeder");
  }
}
