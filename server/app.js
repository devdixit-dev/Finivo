import express from 'express';
import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDatabase from './configs/database.config.js';
import authRouter from './routes/auth.route.js';

const app = express();
const port = process.env.PORT || 3030;

await connectDatabase();

app.use(express.json());
app.use(compression());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Home route working');
});

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});