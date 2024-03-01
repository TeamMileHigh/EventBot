import run from '../src/Runner';
import createClient from '../src/Client';
import {
  handleDatabaseInsertion,
  handleSubscription,
} from '../src/homeHandlers';

run(async (context) => {
  const messageBody = context.message.content.trim().toLowerCase();
  const client = await createClient();

  switch (messageBody) {
    case 'subscribe':
      await handleSubscription(context, client);
      break;
    case '1':
      await context.reply('you selected 1');
      await handleDatabaseInsertion(context, client, parseInt(messageBody));
      break;
    default:
      await context.reply(
        `Welcome to the mile high club. \nReply with "Subscribe" to find some magic.`
      );
  }
});
