
import { sql, apiError } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    // 1. Create Tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        specifications JSONB,
        price DECIMAL,
        imageUrl TEXT,
        inStock BOOLEAN
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS data_plans (
        id TEXT PRIMARY KEY,
        network TEXT,
        size TEXT,
        validity TEXT,
        price DECIMAL,
        planId INTEGER,
        isActive BOOLEAN DEFAULT true
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        fullName TEXT,
        phone TEXT UNIQUE,
        pin TEXT,
        status TEXT,
        walletBalance DECIMAL DEFAULT 0,
        virtualAccount JSONB
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        reference TEXT UNIQUE,
        type TEXT,
        amount DECIMAL,
        status TEXT,
        timestamp BIGINT,
        phone TEXT,
        details TEXT,
        paymentDetails JSONB
      )
    `;

    // 2. Seed Initial Data
    await sql`
      INSERT INTO data_plans (id, network, size, validity, price, planId, isActive)
      VALUES ('seed_mtn_1gb_1001', 'MTN', '1.0GB', '30 Days', 450, 1001, true)
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO products (id, name, description, specifications, price, imageUrl, inStock)
      VALUES ('seed_router_pro', 'MTN 5G Router Pro', 'Industrial grade 5G broadband connectivity.', '["Wi-Fi 6", "Gigabit Port"]', 55000, '/router.png', true)
      ON CONFLICT (id) DO NOTHING
    `;

    return res.status(200).json({ 
      success: true, 
      message: "Database Schema Built & Initialized Successfully." 
    });
  } catch (error: any) {
    return apiError(res, error, "Seeder");
  }
}
