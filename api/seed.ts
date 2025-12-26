
import { sql, apiError, sendResponse } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    console.log("Starting full database reconstruction...");

    // Create Tables sequentially to avoid race conditions in serverless
    await sql`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      specifications JSONB DEFAULT '[]',
      price DECIMAL NOT NULL,
      imageUrl TEXT,
      inStock BOOLEAN DEFAULT true
    )`;

    await sql`CREATE TABLE IF NOT EXISTS data_plans (
      id TEXT PRIMARY KEY,
      network TEXT NOT NULL,
      size TEXT NOT NULL,
      validity TEXT NOT NULL,
      price DECIMAL NOT NULL,
      planId INTEGER NOT NULL,
      isActive BOOLEAN DEFAULT true
    )`;

    await sql`CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      pin TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      walletBalance DECIMAL DEFAULT 0,
      virtualAccount JSONB
    )`;

    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      amount DECIMAL NOT NULL,
      status TEXT DEFAULT 'PENDING',
      timestamp BIGINT NOT NULL,
      phone TEXT NOT NULL,
      details TEXT,
      paymentDetails JSONB
    )`;

    // Inject initial catalog items
    await sql`
      INSERT INTO data_plans (id, network, size, validity, price, planId, isActive)
      VALUES 
        ('mtn_1gb_seed', 'MTN', '1.0GB', '30 Days', 450, 1001, true),
        ('glo_1gb_seed', 'GLO', '1.0GB', '30 Days', 400, 206, true)
      ON CONFLICT (id) DO NOTHING
    `;

    return sendResponse(res, 200, { 
      success: true, 
      message: "Backend Database Initialized Successfully." 
    });
  } catch (error: any) {
    return apiError(res, error, "DatabaseSeeder");
  }
}
