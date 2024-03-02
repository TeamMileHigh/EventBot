import dotenv from 'dotenv';

dotenv.config();
export const config = {
  quickNodeApiKey: process.env.QUICKNODE_API_KEY || '',
  apiBaseUrl: 'https://api.quicknode.com/',
  webhookUrl: process.env.WEBHOOK_HOST_URL || '',
  nftContract: '0xE452D6B8873d0ab6A9d1c7a6868Ca5019a2D8213' as `0x${string}`,
};
