
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

let sqlClient: any = null;

export const getSql = () => {
  if (!sqlClient) {
    if (!databaseUrl) {
      console.error("DATABASE_URL is missing from environment variables.");
      throw new Error("Critical Server Config Error: DATABASE_URL is missing.");
    }
    sqlClient = neon(databaseUrl);
  }
  return sqlClient;
};

// Main SQL tag function
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  return getSql()(strings, ...values);
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
  const status = error.code === '23505' ? 409 : 500;
  const message = error.code === '23505' 
    ? "Duplicate entry error." 
    : (error.message || "Internal Server Error");
  
  return res.status(status).json({ 
    error: message, 
    context
  });
};
