import run from './Runner.js';
import createClient from './Client.js';
import {
  handleDatabaseSubscribe,
  handleSubscription,
  handleDatabaseUnsubscribe,
  handleSubscriptionMsg,
} from './homeHandlers.js';

run(async (context) => {
  const messageBody = context.message.content.trim().toLowerCase();
  const client = await createClient();

  switch (messageBody) {
    case 'subscribe':
      await handleSubscription(context, client);
      break;
    case 'unsubscribe':
      await handleDatabaseUnsubscribe(context, client, parseInt(messageBody));
      break;
    case '1':
      await context.reply('you selected 1');
      await handleDatabaseSubscribe(context, client, parseInt(messageBody));
      await handleSubscriptionMsg(context, client);
      break;
    default:
      await context.reply(
        `Welcome to the mile high club. \nReply with "Subscribe" for some magic.`
      );
  }
});
