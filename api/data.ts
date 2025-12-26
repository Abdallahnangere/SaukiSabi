
import { parseBody, apiError, sendResponse } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { network, mobile_number, plan, Ported_number } = parseBody(req);
    const apiKey = process.env.AMIGO_API_KEY;
    const baseUrl = process.env.AMIGO_BASE_URL || 'https://amigo.ng/api';

    if (!apiKey) return sendResponse(res, 500, { error: "Amigo API Key missing." });

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
      return sendResponse(res, 400, { message: result.message || "Delivery Rejected by Gateway" });
    }

    return sendResponse(res, 200, result);
  } catch (error: any) {
    return apiError(res, error, "DataDelivery");
  }
}
