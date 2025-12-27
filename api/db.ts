
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

/**
 * DATABASE CORE - HARMONIZED
 */
if (!neonConfig.webSocketConstructor) {
  neonConfig.webSocketConstructor = ws;
}
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

export const getSql = () => {
  if (!connectionString) return null;
  try {
    return neon(connectionString);
  } catch (e) {
    console.error("[DB] Init Error:", e);
    return null;
  }
};

export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const db = getSql();
  if (!db) throw new Error("Missing DATABASE_URL");
  return await db(strings, ...values);
};

// Standardized JSON Response
export const jsonResponse = (res: any, status: number, data: any) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
};

// Add sendJson alias to support existing code
export const sendJson = jsonResponse;

// Helper to catch and format API errors as JSON
export const catchApi = async (res: any, fn: () => Promise<any>, context: string) => {
  try {
    return await fn();
  } catch (err: any) {
    console.error(`[API ERROR][${context}]:`, err.message);
    let help = "Check server logs for details.";
    if (err.message.includes('relation') && err.message.includes('does not exist')) {
      help = "Schema missing. Please run the 'Seed' action.";
    }
    return jsonResponse(res, 500, {
      success: false,
      error: err.message || "Internal Server Error",
      context,
      help
    });
  }
};

// Body parsing utility
export const getSafeBody = (req: any) => {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return req.body ? JSON.parse(req.body) : {};
  } catch {
    return {};
  }
};

// Add getBody alias to support existing code
export const getBody = getSafeBody;

// Standardized error reporter
export const reportError = (res: any, error: any, context: string) => {
  console.error(`[${context}] Error:`, error);
  return jsonResponse(res, 500, { 
    error: error.message || "Internal Server Error", 
    context 
  });
};
