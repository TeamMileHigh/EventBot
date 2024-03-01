import run from "../src/Runner";
run(async (context) => {
    const messageBody = context.message.content;
    await context.reply(`Welcome to the mile high club: ${messageBody}`);
});
//# sourceMappingURL=echo.js.map