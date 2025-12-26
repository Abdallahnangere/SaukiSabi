
import { sql, sendJson, reportError } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    console.log("[SEED] Initializing Database Schema...");

    // Transactions Table
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

    // Products Table
    await sql`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      specifications JSONB DEFAULT '[]',
      price DECIMAL NOT NULL,
      imageUrl TEXT,
      inStock BOOLEAN DEFAULT true
    )`;

    // Data Plans Table
    await sql`CREATE TABLE IF NOT EXISTS data_plans (
      id TEXT PRIMARY KEY,
      network TEXT NOT NULL,
      size TEXT NOT NULL,
      validity TEXT NOT NULL,
      price DECIMAL NOT NULL,
      planId INTEGER NOT NULL,
      isActive BOOLEAN DEFAULT true
    )`;

    // Agents Table
    await sql`CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      pin TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      walletBalance DECIMAL DEFAULT 0,
      virtualAccount JSONB
    )`;

    return sendJson(res, 200, { 
      success: true, 
      message: "Database tables verified/created successfully." 
    });
  } catch (err: any) {
    return reportError(res, err, "DatabaseSeeder");
  }
}
