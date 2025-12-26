
import { getBody, reportError, sendJson } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Fixed: parseBody changed to getBody
    const { network, mobile_number, plan, Ported_number } = getBody(req);
    const apiKey = process.env.AMIGO_API_KEY;
    const baseUrl = process.env.AMIGO_BASE_URL || 'https://amigo.ng/api';

    if (!apiKey) return sendJson(res, 500, { error: "Amigo API Key missing." });

    const response = await fetch(`${baseUrl}/data/`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ network, mobile_number, plan, Ported_number })
    });

    const result = await response.json();

    if (!response.ok) {
      // Fixed: sendResponse changed to sendJson
      return sendJson(res, 400, { message: result.message || "Delivery Rejected by Gateway" });
    }

    // Fixed: sendResponse changed to sendJson
    return sendJson(res, 200, result);
  } catch (error: any) {
    // Fixed: apiError changed to reportError
    return reportError(res, error, "DataDelivery");
  }
}