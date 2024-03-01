import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/webhooks/quickalerts', (req: Request, res: Response) => {
  const data = req.body;
  console.log('Received alert:', data);
  // Process the alert here / send XMTP message
  res.status(200).send('Alert received');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
