import { Client } from '@xmtp/xmtp-js';
import dotenv from 'dotenv';
import { Wallet } from 'ethers';
dotenv.config();

export default async function createClient(): Promise<Client> {
  let privateKey;

  if (process.env.NODE_ENV === 'dev') {
    privateKey = Wallet.createRandom().privateKey;
  } else {
    privateKey = process.env.CLIENT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error(
        'CLIENT_PRIVATE_KEY environment variable not set for production.'
      );
    }
  }

  const wallet = new Wallet(privateKey);
  const client = await Client.create(wallet, {
    env: process.env.NODE_ENV as 'dev' | 'local' | 'production',
  });
  await client.publishUserContact();

  return client;
}
