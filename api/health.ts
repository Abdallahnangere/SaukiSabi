
import { getSql, sendResponse } from './db';

export default async function handler(req: any, res: any) {
  try {
    const start = Date.now();
    let dbStatus = 'Offline';
    
    try {
      const db = getSql();
      const check = await db`SELECT 1 as active`;
      if (check[0].active === 1) dbStatus = 'Connected';
    } catch (e: any) {
      dbStatus = `Error: ${e.message}`;
    }

    return sendResponse(res, 200, {
      status: 'Ready',
      database: dbStatus,
      latency: `${Date.now() - start}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
