export default async function (ctx) {
  ctx.reply(`You sent: ${ctx.message.content}`);
}
