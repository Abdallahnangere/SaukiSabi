import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// 1. WebSocket Fix for Vercel/Node environment
neonConfig.webSocketConstructor = ws;
neonConfig.fetchConnectionCache = true;

const getDbUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing from Environment Variables.");
  }
  return url;
};

// 2. RESTORED: This is the function api/health.ts was looking for
export const getSql = () => {
  const databaseUrl = getDbUrl();
  return neon(databaseUrl);
};

// 3. Standard SQL tag function
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  try {
    const query = getSql();
    return await query(strings, ...values);
  } catch (error: any) {
    console.error("Database Query Failed:", error);
    throw error; 
  }
};

export const getSafeBody = (req: any) => {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch (e) {
    return {};
  }
};

export const apiError = (res: any, error: any, context: string) => {
  console.error(`[${context} Error]:`, error);
  if (res && typeof res.status === 'function') {
    return res.status(500).json({ 
      error: error.message || "Internal Server Error", 
      context 
    });
  }
};
