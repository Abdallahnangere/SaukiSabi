
import { neon, neonConfig } from '@neondatabase/serverless';

// Improve stability in serverless environments
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

/**
 * Returns a Neon SQL instance or null.
 * Strictly prevents crashing the process on missing config.
 */
export const getSql = () => {
  if (!connectionString || connectionString.trim() === "") {
    return null;
  }
  try {
    return neon(connectionString);
  } catch (e) {
    console.error("Failed to initialize Neon client:", e);
    return null;
  }
};

/**
 * Executes SQL only if database is configured.
 */
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const db = getSql();
  if (!db) {
    throw new Error("DATABASE_URL is missing or invalid. Check your environment variables.");
  }
  return await db(strings, ...values);
};

/**
 * Ensures a standard JSON response is sent.
 */
export const sendJson = (res: any, status: number, data: any) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
};

/**
 * Robustly parses the request body.
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
 * Global Error Handler for API routes.
 */
export const reportError = (res: any, error: any, context: string) => {
  const message = error.message || "Unknown Server Error";
  console.error(`[API ERROR][${context}]:`, message);
  return sendJson(res, 500, {
    success: false,
    error: message,
    context: context,
    help: "Ensure DATABASE_URL and FLUTTERWAVE_SECRET_KEY are set in Vercel."
  });
};
