
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const sql = neon(process.env.DATABASE_URL);

/**
 * Migration Helper: Run this once manually or via a setup script to create tables
 * CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT, description TEXT, specifications JSONB, price NUMERIC, imageUrl TEXT, inStock BOOLEAN);
 * CREATE TABLE IF NOT EXISTS data_plans (id TEXT PRIMARY KEY, network TEXT, size TEXT, validity TEXT, price NUMERIC, planId INTEGER);
 * CREATE TABLE IF NOT EXISTS agents (id TEXT PRIMARY KEY, fullName TEXT, phone TEXT, pin TEXT, status TEXT, walletBalance NUMERIC, virtualAccount JSONB);
 * CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, reference TEXT, type TEXT, amount NUMERIC, status TEXT, timestamp BIGINT, phone TEXT, details TEXT, paymentDetails JSONB);
 */
