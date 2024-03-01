import createClient from './Client.js';
import HandlerContext from './HandlerContext.js';
import { ClientType } from './Utils.js';

type Handler = (message: HandlerContext) => Promise<void>;

export default async function run(handler: Handler) {
  const client = await createClient(ClientType.XMTP);

  console.log(`Listening on ${client.address}`);

  for await (const message of await client.conversations.streamAllMessages()) {
    console.log(`Got a message`, message);

    try {
      if (message.senderAddress === client.address) {
        continue;
      }

      const context = new HandlerContext(message);

      await handler(context);
    } catch (e) {
      console.log(`error`, e, message);
    }
  }
}
