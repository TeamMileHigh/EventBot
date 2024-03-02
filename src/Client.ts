import { Client } from '@xmtp/xmtp-js';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from '@xmtp/content-type-remote-attachment';
import { Wallet } from 'ethers';
import dotenv from 'dotenv';
import { ClientType } from './Utils.js';
import { resolve } from 'dns/promises';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
dotenv.config();

export const account = privateKeyToAccount(
  process.env.OWNER_PRIVATE_KEY as `0x${string}`
);

export const viemClient = createWalletClient({
  chain: sepolia,
  transport: http(process.env.RPC_PROVIDER_URL),
});

// Function overloads
function createClient(clientType: ClientType.XMTP): Promise<Client>;
function createClient(clientType: ClientType.Story): StoryClient;

function createClient(clientType: ClientType): Promise<Client> | StoryClient {
  let privateKey;

  privateKey = process.env.CLIENT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      'CLIENT_PRIVATE_KEY environment variable not set for production.'
    );
  }

  let client;
  if (clientType === ClientType.XMTP) {
    client = createXmtpClient(privateKey);
  } else if (clientType === ClientType.Story) {
    client = createStoryClient(privateKey as `0x${string}`);
  }

  if (!client) {
    throw new Error('Failed to create client.');
  }

  return client;
}

async function createXmtpClient(privateKey: string): Promise<Client> {
  const wallet = new Wallet(privateKey);
  const client = await Client.create(wallet, {
    env: process.env.NODE_ENV as 'dev' | 'local' | 'production',
  });
  client.registerCodec(new AttachmentCodec());
  client.registerCodec(new RemoteAttachmentCodec());
  await client.publishUserContact();
  return client;
}

function createStoryClient(privateKey: `0x${string}`): StoryClient {
  const account = privateKeyToAccount(privateKey);
  const config: StoryConfig = {
    transport: http(process.env.RPC_PROVIDER_URL),
    account: account,
  };
  return StoryClient.newClient(config);
}

export default createClient;
