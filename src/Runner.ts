import createClient from './Client.js';
import HandlerContext from './HandlerContext.js';

type Handler = (message: HandlerContext) => Promise<void>;

export default async function run(handler: Handler) {
  const client = await createClient();

  console.log(`Listening on ${client.address}`);

  for await (const message of await client.conversations.streamAllMessages()) {
    console.log(`Got a message`, message);

    try {
      if (message.senderAddress === client.address) {
        continue;
      }

      const context = new HandlerContext(message);

      await handler(context);

      // Call the API to validate the address
      const harpieResult = await isAddressMalicious(message.senderAddress);
      if (harpieResult.isMaliciousAddress || harpieResult.tags.BOT) {
        return context.reply(`You are blocked from accessing this chatbot`);
      }
    } catch (e) {
      console.log(`error`, e, message);
    }
  }
}

async function isAddressMalicious(address: string) {
  const apiKey = process.env.HARPIE_API_KEY;

  try {
    const response = await fetch('https://api.harpie.io/v2/validateAddress', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey,
        address,
      }),
    });

    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error calling Harpie API:', e);
  }
}
