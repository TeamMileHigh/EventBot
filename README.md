#### Development

If you want to contribute to this package, here are the steps to set up the project for development:

Install the necessary packages and build the project:

```bash
yarn install
yarn build
```

Run the file echo under examples

```bash
examples/run echo
```

```typescript
// Call `run` with a handler function. The handler function is called
// with a HandlerContext
run(async (context) => {
  // When someone sends your bot a message, you can get the DecodedMessage
  // from the HandlerContext's `message` field
  const messageBody = context.message.content

  // To reply, just call `reply` on the HandlerContext.
  await context.reply(`ECHO: ${messageBody}`)
})
```
