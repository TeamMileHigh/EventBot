import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';
import { privateKeyToAccount } from 'viem/accounts';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import dotenv from 'dotenv';
import { ClientType } from './Utils.js';
dotenv.config();

export default async function createClient(
  clientType: ClientType
): Promise<Client> {
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

  let client;
  if (clientType === ClientType.XMTP) client = createXmtpClient(privateKey);
  if (clientType === ClientType.Story)
    client = createStoryClient(privateKey as `0x${string}`);

  return client;
}

async function createXmtpClient(privateKey: string): Promise<Client> {
  const wallet = new Wallet(privateKey);
  const client = await Client.create(wallet, {
    env: process.env.NODE_ENV as 'dev' | 'local' | 'production',
  });
  await client.publishUserContact();
  return client;
}

async function createStoryClient(privateKey: `0x${string}`): Promise<any> {
  const account = privateKeyToAccount(privateKey);
  const config: StoryConfig = {
    transport: http(process.env.RPC_PROVIDER_URL),
    account: account,
  };
  return StoryClient.newClient(config);
}
