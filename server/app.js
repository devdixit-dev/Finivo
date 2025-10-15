import express from 'express';
import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import connectDatabase from './configs/database.config.js';
import Log from './models/log.model.js';

const app = express();
const port = process.env.PORT || 3030;

await connectDatabase();

app.use(express.json());
app.use(compression());
app.use(cookieParser());

app.use(async (req, _, next) => {
  const log = await Log.create({
    userId: req.cookies.authToken,
    method: req.method,
    url: req.url
  });
  next();
});

app.get('/', (req, res) => {
  res.send('Home route working');
});

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});