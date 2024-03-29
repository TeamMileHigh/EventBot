import HandlerContext from 'src/HandlerContext';
import { Client as XmtpClient } from '@xmtp/xmtp-js';
import { sql } from '@vercel/postgres';
import { createDestination, createNotification } from './QuickAlertsSetup.js';
import { fetchLensProfile } from './AirstackSetup.js';
import {
  getTotalSupply,
  registerOnStory,
  safeMintNft,
  transferNft,
} from './StoryProtocolSetup.js';
import { Attachment } from '@xmtp/content-type-remote-attachment';

const subscribeOptions = [
  'Receive alerts on new followers from my lens profile',
  'Get the top 3 Uniswap pools with the highest total volume in USD',
  'Register an image as an Intellectual Property Asset on Story Protocol',
  'Receive incoming tx alerts on your wallet (coming soon)',
  // Add more options as needed
];

export async function handleSubscription(
  context: HandlerContext,
  client: XmtpClient<any>
) {
  let reply = 'What would you like to do:\n';
  subscribeOptions.forEach((option, index) => {
    reply += `${index + 1}. ${option}\n`;
  });

  reply += '\nReply with a number or "unsubscribe" to cancel.';
  await context.reply(reply);
}

export async function handleSubscriptionMsg(
  context: HandlerContext,
  client: XmtpClient<any>
) {
  // @dev store subscription consent on XMTP
  await client.contacts.refreshConsentList();
  let state = await client.contacts.consentState(context.message.senderAddress);

  // if (state === 'unknown' || state === 'denied') {
    await client.contacts.allow([context.message.senderAddress]);
    await context.reply(
      'You are now subscribed to receive messages from the bot.'
    );
  // } else {
  //   await context.reply('Error: Missing consent.');
  // }
}

export async function handleDatabaseSubscribe(
  context: HandlerContext,
  client: XmtpClient<any>,
  event: number
) {
  const walletAddress = context.message.senderAddress;

  try {
    const res = await sql`
      INSERT INTO subscriptions (wallet_address, subscribed_event)
      VALUES (${walletAddress}, ${event})
    `;

    console.log(res, 'res');

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

export async function handleUnsubscriptionMsg(
  context: HandlerContext,
  client: XmtpClient<any>
) {
  // @dev store subscription consent on XMTP
  await client.contacts.refreshConsentList();

  await client.contacts.deny([context.message.senderAddress]);
  await context.reply(
    'You are now unsubscribed from receiving messages from the bot.'
  );
}

export async function sendMessageToSubscribers(
  message: string,
  eventType: number,
  client: XmtpClient<any>
) {
  // Fetch subscribers from the database
  const result = await sql`
    SELECT wallet_address FROM subscriptions WHERE subscribed_event = ${eventType}
  `;

  for (const subscriber of result.rows) {
    try {
      const conversation = await client.conversations.newConversation(
        subscriber.wallet_address
      );
      await conversation.send(message);
    } catch (error) {
      console.error(
        `Failed to send message to ${subscriber.wallet_address}:`,
        error
      );
    }
  }
}

export async function handleSetupQuickAlerts(context: HandlerContext) {
  const address = context.message.senderAddress;
  try {
    const destination = await createDestination();
    const profileId = await fetchLensProfile(address);
    if (!profileId) {
      context.reply('You do not have a Lens Profile');
    }
    // for demo purposes we need a profileId that's not my own https://buttrfly.app/profile/jamesfinnerty
    await createNotification(destination.id, '105878');
    console.log('QuickAlerts setup completed successfully.');
  } catch (error) {
    console.error('Failed to set up QuickAlerts:', error);
  }
}

export async function handleStoryProtocolSubmission(
  ipfsUri: string,
  senderAddress: string,
  clientAddress: string,
  attachment: Attachment
) {
  /** TODO
   * 1. get ipfs hash
   * 2. get totalSupply of minted nfts
   * 3. mint nft with ipfs hash with totalSupply + 1 as tokenId
   * 4. register to Root IPA */

  try {
    let currentTokenIdIndex = await getTotalSupply();
    const nextIndex = (currentTokenIdIndex += 1n);

    await safeMintNft(senderAddress, nextIndex, ipfsUri);
    await registerOnStory(nextIndex, ipfsUri, attachment.filename);
    return await transferNft(clientAddress, senderAddress, nextIndex);
  } catch (e) {
    console.error('Failed to set up Story Protocol:', e);
  }
}
