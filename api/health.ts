
import { getSql, sendJson } from './db';

export default async function handler(req: any, res: any) {
  const db = getSql();
  const dbConfigured = !!db;
  const fwConfigured = !!process.env.FLUTTERWAVE_SECRET_KEY;
  const amigoConfigured = !!process.env.AMIGO_API_KEY;

  let dbWorking = false;
  if (db) {
    try {
      await db`SELECT 1`;
      dbWorking = true;
    } catch (e) {
      dbWorking = false;
    }
  }

  return sendJson(res, 200, {
    status: "Service Active",
    config: {
      database: dbConfigured ? (dbWorking ? "Connected" : "Configured but failing connection") : "Missing DATABASE_URL",
      flutterwave: fwConfigured ? "Ready" : "Missing FLUTTERWAVE_SECRET_KEY",
      amigo: amigoConfigured ? "Ready" : "Missing AMIGO_API_KEY"
    },
    version: "1.2.0-atox"
  });
}
