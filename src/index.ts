import { BotConfig, newBotConfig, run } from "@xmtp/bot-kit-pro"

import echo from "./echo"

const defaultConfig: Partial<BotConfig> = {
  xmtpEnv: "dev",
}

const start = async () => {
  const bots = [
    newBotConfig("echo", defaultConfig, echo)
  ]
  await run(bots)
}

start()