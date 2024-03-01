import axios from 'axios';
import { config } from './Config.js';

interface DestinationResponse {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  to: string;
  webhook_type: string;
  service: string;
  token: string;
  payload_type: number;
}

export async function createDestination(): Promise<DestinationResponse> {
  try {
    const response = await axios.post<DestinationResponse>(
      `${config.apiBaseUrl}quickalerts/rest/v1/destinations`,
      {
        name: 'LensProfileFollowWebhook',
        to_url: config.webhookUrl,
        webhook_type: 'POST',
        service: 'webhook',
        payload_type: 1,
      },
      {
        headers: {
          'x-api-key': config.quickNodeApiKey,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
      }
    );
    console.log('Destination created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create destination:', error);
    throw error;
  }
}

interface NotificationResponse {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    expression: string;
    network: string;
    destinations: Array<{
        id: string;
        name: string;
        to: string;
        webhook_type: string;
        service: string;
        payload_type: number;
    }>;
    enabled: boolean;
}

function encodeExpression(criteria: string): string {
    return Buffer.from(criteria).toString('base64');
}

export async function createNotification(destinationId: string, lensProfileId: string): Promise<NotificationResponse> {
    const hexLensProfileId = parseInt(lensProfileId).toString(16);
    const expression = `tx_logs_address == '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d' && tx_logs_topic0 == '0x817d2c71a3ec35dc50f2e4b0d890943c89f2a7ab9d96eff233eda4932b506d0b' && tx_logs_data =~ '${hexLensProfileId}'`;
    const encodedExpression = Buffer.from(expression).toString('base64');
    
    try {
      const response = await axios.post<NotificationResponse>(
          `${config.apiBaseUrl}quickalerts/rest/v1/notifications`,
          {
              name: "LensProfileFollowNotification",
              expression: encodedExpression,
              network: "polygon-mainnet",
              destinationIds: [destinationId],
          },
          {
              headers: {
                  'x-api-key': config.quickNodeApiKey,
                  'Content-Type': 'application/json',
              },
          }
      );
      console.log('Notification created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
}
