import dotenv from 'dotenv';

dotenv.config();
export const config = {
  quickNodeApiKey: process.env.QUICKNODE_API_KEY || '',
  apiBaseUrl: 'https://api.quicknode.com/',
  webhookUrl: process.env.WEBHOOK_HOST_URL || '',
  nftContract: '0x824842C726102dbde648B6f4b096B43C9c22e5da' as `0x${string}`,
};
