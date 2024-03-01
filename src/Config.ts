import dotenv from "dotenv"

dotenv.config()
export const config = {
  quickNodeApiKey: process.env.QUICKNODE_API_KEY || "",
  apiBaseUrl: 'https://api.quicknode.com/',
  webhookUrl: 'https://yourapp.com/webhooks/quickalerts',
};