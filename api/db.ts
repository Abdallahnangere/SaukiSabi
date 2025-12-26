
import { neon, neonConfig } from '@neondatabase/serverless';

// Essential for serverless environments to prevent connection hangs
neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

let sqlClient: any = null;

export const getSql = () => {
  if (!sqlClient) {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is missing.");
    }
    sqlClient = neon(databaseUrl);
  }
  return sqlClient;
};

// Main SQL tag function with automatic initialization
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  try {
    const client = getSql();
    return client(strings, ...values);
  } catch (err) {
    console.error("SQL Execution Failure:", err);
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
  console.error(`[API Error - ${context}]:`, error);
  const status = 500;
  const message = error.message || "Internal Server Error";
  
  return res.status(status).json({ 
    error: message, 
    context,
    code: error.code
  });
};
