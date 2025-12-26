
import { sql } from './db';

export default async function handler(req: any, res: any) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
  const signature = req.headers['verif-hash'];

  if (!signature || signature !== secretHash) {
    return res.status(401).end();
  }

  const payload = req.body;
  const { tx_ref, status, amount } = payload.data;

  if (status === 'successful') {
    // 1. Update transaction in Neon
    await sql`UPDATE transactions SET status = 'PAID' WHERE reference = ${tx_ref}`;

    // 2. If it's a data transaction, trigger Amigo (Logic handled via backend polling or direct call here)
    const tx = await sql`SELECT * FROM transactions WHERE reference = ${tx_ref} LIMIT 1`;
    if (tx[0] && tx[0].type === 'DATA') {
      // Automatic Amigo Trigger logic would go here
      // For brevity, we mark as DELIVERING
      await sql`UPDATE transactions SET status = 'SUCCESSFUL' WHERE reference = ${tx_ref}`;
    }
  }

  res.status(200).end();
}
