
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Please add it to your Vercel Environment Variables.");
}

export const sql = neon(process.env.DATABASE_URL || "");

/**
 * SCHEMA SETUP (Run this in your Neon SQL Console):
 * 
 * CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, specifications JSONB, price NUMERIC NOT NULL, imageUrl TEXT, inStock BOOLEAN DEFAULT true);
 * CREATE TABLE IF NOT EXISTS data_plans (id TEXT PRIMARY KEY, network TEXT NOT NULL, size TEXT NOT NULL, validity TEXT NOT NULL, price NUMERIC NOT NULL, planId INTEGER NOT NULL);
 * CREATE TABLE IF NOT EXISTS agents (id TEXT PRIMARY KEY, fullName TEXT NOT NULL, phone TEXT UNIQUE NOT NULL, pin TEXT NOT NULL, status TEXT DEFAULT 'PENDING', walletBalance NUMERIC DEFAULT 0, virtualAccount JSONB);
 * CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, reference TEXT UNIQUE NOT NULL, type TEXT NOT NULL, amount NUMERIC NOT NULL, status TEXT NOT NULL, timestamp BIGINT NOT NULL, phone TEXT NOT NULL, details TEXT, paymentDetails JSONB);
 */

export const getSafeBody = (req: any) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  return req.body;
};
