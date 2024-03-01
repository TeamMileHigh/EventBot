import { sql } from '@vercel/postgres';

export function hexToBytes(s: string): Uint8Array {
  if (s.startsWith('0x')) {
    s = s.slice(2);
  }
  const bytes = new Uint8Array(s.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const j = i * 2;
    bytes[i] = Number.parseInt(s.slice(j, j + 2), 16);
  }
  return bytes;
}

export async function createSubscriptionTable() {
  return await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(42) NOT NULL,
      subscribed_event INTEGER NOT NULL
    )
  `;
}

export async function isAddressMalicious(address: string) {
  const apiKey = process.env.HARPIE_API_KEY;

  try {
    const response = await fetch('https://api.harpie.io/v2/validateAddress', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey,
        address,
      }),
    });

    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error calling Harpie API:', e);
  }
}
