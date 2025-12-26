
import { neon, neonConfig } from '@neondatabase/serverless';

// Prevents function timeouts in serverless
neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

export const getSql = () => {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined.");
  }
  return neon(databaseUrl);
};

/**
 * Standard SQL tag function for Neon
 */
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const query = getSql();
  return await query(strings, ...values);
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
  console.error(`[Server Error - ${context}]:`, error.message);
  
  return res.status(500).json({ 
    error: error.message || "Internal Server Error", 
    context,
    ok: false
  });
};
