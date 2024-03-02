import run from './Runner.js';
import createClient from './Client.js';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {
  handleDatabaseSubscribe,
  handleSubscription,
  handleDatabaseUnsubscribe,
  handleSubscriptionMsg,
  handleSetupQuickAlerts,
  sendMessageToSubscribers,
} from './homeHandlers.js';
import { isAddressMalicious, ClientType } from './Utils.js';
import { queryGraph } from './TheGraphSetup.js';

run(async (context) => {
  const messageBody = context.message.content.trim().toLowerCase();
  const client = await createClient(ClientType.XMTP);

  switch (messageBody) {
    case 'subscribe':    
      // @dev check if sender is malicious or a bot
      const harpieResult = await isAddressMalicious(context.message.senderAddress);
      if (harpieResult.isMaliciousAddress || harpieResult.tags.BOT) {
        await client.contacts.deny([context.message.senderAddress]);
        context.reply(`Sorry, you've been flagged as malicious you're blocked from accessing this chatbot`);
      } else {
        await handleSubscription(context, client);
      }
      break;
    case 'unsubscribe':
      await handleDatabaseUnsubscribe(context, client, parseInt(messageBody));
      break;
    case '1':
      await context.reply('you selected 1');
      await handleDatabaseSubscribe(context, client, parseInt(messageBody));
      await handleSubscriptionMsg(context, client);
      await handleSetupQuickAlerts(context);
      break;
    case '2':
      const message = await queryGraph();
      context.reply(message);
      break;
    default:
      await context.reply(
        `Welcome to the mile high club. \nReply with "Subscribe" for some magic.`
      );
  }
});

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (res: Response) => {
  res.status(200).send({ message: 'Mile high server is live' });
});

app.post('/webhooks/quickalerts', async (req: Request, res: Response) => {
  const data = req.body;
  console.log('Received alert:', data);

  const message = 'You have a new follower on your Lens profile.';
  let client;

  try {
    client = await createClient(ClientType.XMTP);
    await sendMessageToSubscribers(message, 1, client);
    res.status(200).send('Alert processed and messages sent');
  } catch (error) {
    console.error('Error processing alert:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
