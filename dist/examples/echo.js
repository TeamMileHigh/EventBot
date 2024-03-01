import run from "../src/Runner";
import createClient from "../src/Client";
run(async (context) => {
    const messageBody = context.message.content.trim().toLowerCase();
    const client = await createClient();
    if (messageBody === "subscribe") {
        await client.contacts.refreshConsentList();
        let state = await client.contacts.consentState(context.message.senderAddress);
        if (state === "unknown" || state === "denied") {
            await client.contacts.allow([context.message.senderAddress]);
            await context.reply("You are now subscribed to receive messages from the bot.");
            setTimeout(async () => {
                const broadcastMessage = "Thank you for subscribing! Stay tuned for updates.";
                const conversation = await client.conversations.newConversation(context.message.senderAddress);
                await conversation.send(broadcastMessage);
                console.log(`Broadcast message sent to ${context.message.senderAddress}`);
            }, 10000);
        }
        else {
            await context.reply("You are already subscribed.");
        }
    }
    else {
        await context.reply(`Welcome to the mile high club: ${messageBody}`);
    }
});
//# sourceMappingURL=echo.js.map