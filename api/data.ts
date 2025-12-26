
import { getSafeBody, apiError } from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { network, mobile_number, plan, Ported_number } = getSafeBody(req);
    const apiKey = process.env.AMIGO_API_KEY;
    const baseUrl = process.env.AMIGO_BASE_URL || 'https://amigo.ng/api';

    if (!apiKey) throw new Error("Server Config Error: AMIGO_API_KEY is missing.");

    const amigoResponse = await fetch(`${baseUrl}/data/`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        network,
        mobile_number,
        plan,
        Ported_number
      })
    });

    const data = await amigoResponse.json();

    if (!amigoResponse.ok) {
      return res.status(400).json({ 
        success: false, 
        message: data.message || "Amigo API rejected the request" 
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    return apiError(res, error, "DataDelivery");
  }
}
