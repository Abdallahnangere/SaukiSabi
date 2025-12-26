
import { sql } from './db';

export default async function handler(req: any, res: any) {
  try {
    const start = Date.now();
    
    // 1. Check DB Connection
    const dbTest = await sql`SELECT 1 as connected`;
    const latency = Date.now() - start;

    // 2. Check Environment Variables
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      FLUTTERWAVE_SECRET_KEY: !!process.env.FLUTTERWAVE_SECRET_KEY,
      AMIGO_API_KEY: !!process.env.AMIGO_API_KEY,
      AMIGO_BASE_URL: !!process.env.AMIGO_BASE_URL
    };

    res.status(200).json({
      status: 'online',
      db: dbTest[0].connected === 1 ? 'connected' : 'error',
      latency: `${latency}ms`,
      environment: envVars,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}
