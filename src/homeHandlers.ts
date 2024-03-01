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
  // @dev store subscription consent on XMTP
  await client.contacts.refreshConsentList();
  let state = await client.contacts.consentState(context.message.senderAddress);

  if (state === 'unknown' || state === 'denied') {
    await client.contacts.allow([context.message.senderAddress]);
    await context.reply(
      'You are now subscribed to receive messages from the bot.'
    );

    let reply = 'What events would you like to subscribe to:\n';
    subscribeOptions.forEach((option, index) => {
      reply += `${index + 1}. ${option}\n`;
    });

    reply += '\nReply with a number';
    await context.reply(reply);
  } else {
    await context.reply('Error: Missing consent.');
  }
}

export async function handleDatabaseInsertion(
  context: HandlerContext,
  client: XmtpClient<any>,
  messageBody: number
) {
  const walletAddress = context.message.senderAddress;

  try {
    createSubscriptionTable();

    // Insert the subscription data into the database
    await sql`
      INSERT INTO subscriptions (wallet_address, subscribed_event)
      VALUES (${walletAddress}, ${messageBody})
    `;

    // Reply to the user confirming the subscription
    await context.reply(
      'Your subscription choice has been stored successfully.'
    );
  } catch (error) {
    // Handle any errors that occur during database insertion
    console.error('Error storing subscription choice:', error);
    await context.reply(
      'An error occurred while storing your subscription choice. Please try again later.'
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
