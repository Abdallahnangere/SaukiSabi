
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn("CRITICAL: DATABASE_URL is missing from Environment Variables.");
}

// Direct SQL driver is used instead of Prisma for faster cold starts and zero-config deployment.
export const sql = neon(process.env.DATABASE_URL || "");

export const getSafeBody = (req: any) => {
  if (!req.body) return {};
  try {
    if (typeof req.body === 'string') return JSON.parse(req.body);
    return req.body;
  } catch (e) {
    console.error("Body Parse Error:", e);
    return {};
  }
};

export const apiError = (res: any, error: any, context: string) => {
  console.error(`[${context}] Error:`, error);
  const status = error.code === '23505' ? 409 : 500; // 409 for unique constraint (duplicate phone)
  const message = error.code === '23505' ? "Record already exists (e.g. Phone number taken)" : error.message;
  return res.status(status).json({ error: message, context });
};
