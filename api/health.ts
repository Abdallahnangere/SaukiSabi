
import { getSql } from './db';

export default async function handler(req: any, res: any) {
  try {
    const start = Date.now();
    let dbStatus = 'disconnected';
    
    try {
      const sql = getSql();
      const dbCheck = await sql`SELECT 1 as connected`;
      if (dbCheck[0].connected === 1) dbStatus = 'connected';
    } catch (dbErr: any) {
      dbStatus = `error: ${dbErr.message}`;
    }
    
    const latency = Date.now() - start;

    return res.status(200).json({
      status: 'online',
      version: '2.1.1-authoritative-fix',
      db: dbStatus,
      latency: `${latency}ms`,
      env: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        AMIGO_BASE_URL: !!process.env.AMIGO_BASE_URL,
        AMIGO_API_KEY: !!process.env.AMIGO_API_KEY,
        FLUTTERWAVE_SECRET: !!process.env.FLUTTERWAVE_SECRET_KEY
      }
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', error: error.message });
  }
}
