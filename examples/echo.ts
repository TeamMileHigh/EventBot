import run from "../src/Runner";
import Client from "../src/Client";
import createClient from "../src/Client";


run(async (context) => {
  const messageBody = context.message.content
  const client = await createClient(); 

  if (messageBody.trim().toLowerCase() === "subscribe") {
    await client.contacts.refreshConsentList();
    
    let state = await client.contacts.consentState(context.message.senderAddress);
    
    if (state === "unknown" || state === "denied") {
      await client.contacts.allow([context.message.senderAddress]);
      await context.reply("You are now subscribed to receive messages from the bot.");
    } else {
      await context.reply("You are already subscribed.");
    }
  } else {
    await context.reply(`Welcome to the mile high club: ${messageBody}`);
  }
})
