import HandlerContext from 'src/HandlerContext';
import { Client as XmtpClient } from '@xmtp/xmtp-js';
import { sql } from '@vercel/postgres';

const subscribeOptions = [
  'Receive incoming tx alerts on your wallet',
  'Receive alerts on new followers from your lens profile',
  // Add more options as needed
];

export async function handleSubscription(
  context: HandlerContext,
  client: XmtpClient<any>
) {
  let reply = 'What events would you like to subscribe to:\n';
  subscribeOptions.forEach((option, index) => {
    reply += `${index + 1}. ${option}\n`;
  });

  reply += '\nReply with a number';
  await context.reply(reply);
}

export async function handleSubscriptionMsg(
  context: HandlerContext,
  client: XmtpClient<any>
) {
  // @dev store subscription consent on XMTP
  await client.contacts.refreshConsentList();
  let state = await client.contacts.consentState(context.message.senderAddress);

  if (state === 'unknown' || state === 'denied') {
    await client.contacts.allow([context.message.senderAddress]);
    await context.reply(
      'You are now subscribed to receive messages from the bot.'
    );
  } else {
    await context.reply('Error: Missing consent.');
  }
}

export async function handleDatabaseSubscribe(
  context: HandlerContext,
  client: XmtpClient<any>,
  event: number
) {
  const walletAddress = context.message.senderAddress;

  try {
    // await createSubscriptionTable();

    await sql`
      INSERT INTO subscriptions (wallet_address, subscribed_event)
      VALUES (${walletAddress}, ${event})
    `;

    await context.reply(
      'Your subscription choice has been stored successfully.'
    );
  } catch (error) {
    console.error('Error storing subscription choice:', error);
    await context.reply(
      'An error occurred while storing your subscription choice. Please try again later.'
    );
  }
}

export async function handleDatabaseUnsubscribe(
  context: HandlerContext,
  client: XmtpClient<any>,
  event: number // Assuming `event` is the event identifier you want to unsubscribe from
) {
  const walletAddress = context.message.senderAddress;

  try {
    await sql`
      DELETE FROM subscriptions
      WHERE wallet_address = ${walletAddress} AND subscribed_event = ${event}
    `;

    await context.reply(
      'You have been unsubscribed successfully from the selected event.'
    );
  } catch (error) {
    console.error('Error unsubscribing:', error);
    await context.reply(
      'An error occurred while unsubscribing. Please try again later.'
    );
  }
}

async function createSubscriptionTable() {
  return await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(42) NOT NULL,
      subscribed_event INTEGER NOT NULL
    )
  `;
}
