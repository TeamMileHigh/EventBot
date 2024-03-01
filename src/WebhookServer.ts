import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Client as XmtpClient } from '@xmtp/xmtp-js';
import createClient from './Client.js';
import { sendMessageToSubscribers } from './homeHandlers.js';

const app = express();
app.use(bodyParser.json());

app.post('/webhooks/quickalerts', (req: Request, res: Response) => {
  const data = req.body;
  console.log('Received alert:', data);
  
  const message = 'You have a new follower on your Lens profile.';

  (async () => {
    let client = await createClient();
    try {
      await sendMessageToSubscribers(message, 1, client);
      res.status(200).send('Alert processed and messages sent');
    } catch (error) {
      console.error('Error processing alert:', error);
      res.status(500).send('Internal Server Error');
    }
  })();

  res.status(200).send('Alert received');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
