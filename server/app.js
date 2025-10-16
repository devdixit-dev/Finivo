import express from 'express';
import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import connectDatabase from './configs/database.config.js';
import Log from './models/log.model.js';
import authRouter from './routes/auth.route.js';

const app = express();
const port = process.env.PORT || 3030;

await connectDatabase();

app.use(express.json());
app.use(compression());
app.use(cookieParser());

// app.use((req, _, next) => {
//   console.log(`${req.method} - ${req.url} - ${req.ip}`);

//   setTimeout(async () => {
//     const checkLog = await Log.findOne({ userId: req.cookies.a_token }, { url: req.url });
//     if (!checkLog) {
//       await Log.create({
//         userId: req.cookies.a_token,
//         method: req.method,
//         url: req.url,
//         ip: req.ip
//       });
//     }
//   }, 3000);

//   next();
// });

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Home route working');
});

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});