import { newBotConfig, run } from '@xmtp/bot-kit-pro';
import echo from './echo.js';

const defaultConfig = {
  xmtpEnv: 'dev',
};

const start = async () => {
  const bots = [newBotConfig('echo', defaultConfig, echo)];
  await run(bots);
};

start();
