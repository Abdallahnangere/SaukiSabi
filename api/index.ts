
import { sql, jsonResponse, catchApi, getSafeBody, getSql } from './db';

/**
 * SAUKI MART MASTER GATEWAY
 * GET /api?action=...
 * POST /api?action=...
 */
export default async function handler(req: any, res: any) {
  const { action } = req.query;

  return catchApi(res, async () => {
    switch (action) {
      case 'health':
        const db = getSql();
        let dbStatus = "Disconnected";
        if (db) {
          try { await db`SELECT 1`; dbStatus = "Connected"; } catch { dbStatus = "Error"; }
        }
        return jsonResponse(res, 200, {
          status: "Harmonized",
          database: dbStatus,
          flutterwave: !!process.env.FLUTTERWAVE_SECRET_KEY,
          amigo: !!process.env.AMIGO_API_KEY
        });

      case 'seed':
        if (req.method !== 'POST') return jsonResponse(res, 405, { error: "POST required" });
        await sql`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT, description TEXT, specifications JSONB, price DECIMAL, imageUrl TEXT, inStock BOOLEAN)`;
        await sql`CREATE TABLE IF NOT EXISTS data_plans (id TEXT PRIMARY KEY, network TEXT, size TEXT, validity TEXT, price DECIMAL, planId INTEGER, isActive BOOLEAN)`;
        await sql`CREATE TABLE IF NOT EXISTS agents (id TEXT PRIMARY KEY, fullName TEXT, phone TEXT UNIQUE, pin TEXT, status TEXT, walletBalance DECIMAL, virtualAccount JSONB)`;
        await sql`CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, reference TEXT UNIQUE, type TEXT, amount DECIMAL, status TEXT, timestamp BIGINT, phone TEXT, details TEXT, paymentDetails JSONB)`;
        return jsonResponse(res, 200, { success: true, message: "System core seeded." });

      case 'products':
        if (req.method === 'POST') {
          const { id, name, description, specifications, price, imageUrl, inStock } = getSafeBody(req);
          await sql`INSERT INTO products (id, name, description, specifications, price, imageUrl, inStock) VALUES (${id}, ${name}, ${description}, ${JSON.stringify(specifications)}, ${price}, ${imageUrl}, ${inStock}) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price, inStock=EXCLUDED.inStock`;
          return jsonResponse(res, 200, { success: true });
        }
        const products = await sql`SELECT * FROM products ORDER BY price DESC`;
        return jsonResponse(res, 200, products);

      case 'plans':
        if (req.method === 'POST') {
          const { id, network, size, validity, price, planId } = getSafeBody(req);
          await sql`INSERT INTO data_plans (id, network, size, validity, price, planId, isActive) VALUES (${id}, ${network}, ${size}, ${validity}, ${price}, ${planId}, true) ON CONFLICT (id) DO UPDATE SET price=EXCLUDED.price, planId=EXCLUDED.planId`;
          return jsonResponse(res, 200, { success: true });
        }
        if (req.method === 'DELETE') {
          await sql`DELETE FROM data_plans WHERE id = ${req.query.id}`;
          return jsonResponse(res, 200, { success: true });
        }
        // Support network filtering for plans
        const { network } = req.query;
        const plans = network 
          ? await sql`SELECT * FROM data_plans WHERE network = ${network} AND isActive = true ORDER BY price ASC`
          : await sql`SELECT * FROM data_plans ORDER BY network, price`;
        return jsonResponse(res, 200, plans);

      case 'agents':
        if (req.method === 'POST') {
          const { id, fullName, phone, pin } = getSafeBody(req);
          await sql`INSERT INTO agents (id, fullName, phone, pin, status, walletBalance) VALUES (${id}, ${fullName}, ${phone}, ${pin}, 'PENDING', 0)`;
          return jsonResponse(res, 200, { success: true });
        }
        if (req.method === 'PATCH') {
          const { id, status, virtualAccount, walletBalance } = getSafeBody(req);
          await sql`UPDATE agents SET status=COALESCE(${status}, status), virtualAccount=COALESCE(${JSON.stringify(virtualAccount)}, virtualAccount), walletBalance=COALESCE(${walletBalance}, walletBalance) WHERE id=${id}`;
          return jsonResponse(res, 200, { success: true });
        }
        const agents = await sql`SELECT * FROM agents ORDER BY id DESC`;
        return jsonResponse(res, 200, agents);

      case 'transactions':
        if (req.method === 'POST') {
          const tx = getSafeBody(req);
          await sql`INSERT INTO transactions (id, reference, type, amount, status, timestamp, phone, details, paymentDetails) VALUES (${tx.id}, ${tx.reference}, ${tx.type}, ${tx.amount}, ${tx.status}, ${tx.timestamp}, ${tx.phone}, ${tx.details}, ${JSON.stringify(tx.paymentDetails)}) ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status`;
          return jsonResponse(res, 200, { success: true });
        }
        const { phone: txPhone } = req.query;
        const txs = txPhone 
          ? await sql`SELECT * FROM transactions WHERE phone = ${txPhone} ORDER BY timestamp DESC LIMIT 5`
          : await sql`SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 50`;
        return jsonResponse(res, 200, txs);

      default:
        return jsonResponse(res, 400, { error: `Invalid action: ${action}` });
    }
  }, "MasterGateway");
}
