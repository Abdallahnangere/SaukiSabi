
import { neon, neonConfig } from '@neondatabase/serverless';

// Critical for serverless reliability
neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

let cachedSql: any = null;

export const getSql = () => {
  if (!cachedSql) {
    if (!databaseUrl) {
      throw new Error("Critical: DATABASE_URL is not defined in environment.");
    }
    // We create the client only once
    cachedSql = neon(databaseUrl);
  }
  return cachedSql;
};

/**
 * Robust SQL tag that handles potential initialization errors 
 * gracefully without crashing the whole function.
 */
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  try {
    const query = getSql();
    return await query(strings, ...values);
  } catch (err: any) {
    console.error("Database Query Execution Failed:", err.message);
    throw err;
  }
};

export const getSafeBody = (req: any) => {
  if (!req.body) return {};
  try {
    if (typeof req.body === 'string') return JSON.parse(req.body);
    return req.body;
  } catch (e) {
    return {};
  }
};

export const apiError = (res: any, error: any, context: string) => {
  console.error(`[API Error - ${context}]:`, error.message);
  
  // Distinguish between common errors
  const status = error.message.includes('not defined') ? 503 : 500;
  
  return res.status(status).json({ 
    error: error.message || "Internal Server Error", 
    context,
    timestamp: new Date().toISOString()
  });
};
