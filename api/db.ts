import { neon, neonConfig } from '@neondatabase/serverless';

// 1. Configure caching safely
try {
  neonConfig.fetchConnectionCache = true;
} catch (err) {
  console.warn("Failed to set neonConfig cache (non-critical):", err);
}

// 2. Helper to check config
const getDbUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("CRITICAL: DATABASE_URL Environment Variable is missing.");
    throw new Error("Database configuration error");
  }
  return url;
};

// 3. Robust SQL Executor
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  try {
    const databaseUrl = getDbUrl();
    const query = neon(databaseUrl);
    return await query(strings, ...values);
  } catch (error: any) {
    console.error("Database Query Failed:", error);
    // Rethrow so the API handler can catch it and send a 500 response
    throw new Error(`Database Error: ${error.message}`);
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
  console.error(`[Server Error - ${context}]:`, error);
  const message = error instanceof Error ? error.message : "Unknown error occurred";
  
  // Ensure we don't crash if res.status is undefined (edge case)
  if (res && typeof res.status === 'function') {
    return res.status(500).json({ 
      error: message, 
      context,
      ok: false 
    });
  }
};
