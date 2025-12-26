
import { neon, neonConfig } from '@neondatabase/serverless';

// Essential for serverless stability
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

/**
 * Returns a Neon SQL instance or null if not configured.
 * This prevents the entire server from crashing on boot.
 */
export const getSql = () => {
  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL is not defined in environment variables.");
    return null;
  }
  return neon(connectionString);
};

/**
 * Executes SQL with a safety wrapper.
 */
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const db = getSql();
  if (!db) throw new Error("Database connection not configured.");
  return await db(strings, ...values);
};

/**
 * Ensures we always return JSON, even in a total crash.
 */
export const sendJson = (res: any, status: number, data: any) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
};

/**
 * Robustly parses request body for Vercel environments.
 */
export const getBody = (req: any) => {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return req.body ? JSON.parse(req.body) : {};
  } catch (e) {
    return {};
  }
};

/**
 * Standard error logger and responder.
 */
export const reportError = (res: any, error: any, context: string) => {
  console.error(`[${context} ERROR]:`, error.message || error);
  return sendJson(res, 500, {
    success: false,
    error: error.message || "Unknown Server Error",
    context
  });
};
