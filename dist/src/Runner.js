import createClient from "./Client";
import HandlerContext from "./HandlerContext";
export default async function run(handler) {
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
        }
        catch (e) {
            console.log(`error`, e, message);
        }
    }
}
//# sourceMappingURL=Runner.js.map