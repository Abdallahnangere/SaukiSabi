
import { neon, neonConfig } from '@neondatabase/serverless';

// Essential for Vercel/Serverless stability
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

/**
 * Robust Database Client Singleton
 */
let client: any = null;

export const getSql = () => {
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing. Check Vercel Environment Variables.");
  }
  if (!client) {
    client = neon(connectionString);
  }
  return client;
};

/**
 * Global SQL execution utility with auto-logging
 */
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  try {
    const db = getSql();
    return await db(strings, ...values);
  } catch (err: any) {
    console.error(`[DB_EXEC_ERROR]: ${err.message}`);
    throw err;
  }
};

/**
 * Standardized JSON API Response Helper
 */
export const sendResponse = (res: any, status: number, data: any) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
};

/**
 * Reliable Body Parser for Vercel Functions
 */
export const parseBody = (req: any) => {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return req.body ? JSON.parse(req.body) : {};
  } catch (e) {
    return {};
  }
};

/**
 * Universal API Error Handler
 */
export const apiError = (res: any, error: any, context: string) => {
  console.error(`[API_CRASH][${context}]:`, error);
  return sendResponse(res, 500, {
    success: false,
    error: error.message || "Internal Server Error",
    context,
    timestamp: Date.now()
  });
};
