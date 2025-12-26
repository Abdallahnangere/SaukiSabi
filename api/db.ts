
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

// Lazy-loaded SQL client to prevent crash if env var is missing during build/cold-start
let sqlClient: any = null;

export const getSql = () => {
  if (!sqlClient) {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is missing.");
    }
    sqlClient = neon(databaseUrl);
  }
  return sqlClient;
};

// Proxied sql object to maintain the existing API
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  return getSql()(strings, ...values);
};

export const getSafeBody = (req: any) => {
  if (!req.body) return {};
  try {
    if (typeof req.body === 'string') return JSON.parse(req.body);
    return req.body;
  } catch (e) {
    console.error("JSON Parse Error in Request Body:", e);
    return {};
  }
};

export const apiError = (res: any, error: any, context: string) => {
  console.error(`[API Error - ${context}]:`, error);
  const status = error.code === '23505' ? 409 : 500;
  const message = error.code === '23505' 
    ? "Conflicting data (e.g., ID or phone number already exists)." 
    : (error.message || "Internal Server Error");
  
  return res.status(status).json({ 
    error: message, 
    context,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined 
  });
};
