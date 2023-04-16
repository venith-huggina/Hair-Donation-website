import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import donationsRouter from './routes/donation-request-routes.js';
import recipientsRouter from './routes/recipient-request-routes.js';
import cookieParser from 'cookie-parser';
import { dirname,join } from 'path';
import { fileURLToPath } from 'url';
import bodyparser from 'body-parser'
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));



const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    credentials: true,
    origin: process.env.URL || 'http://localhost:3000'
};

app.use(cors(corsOptions));
app.use(bodyparser.json());
app.use(cookieParser());

app.use('/', express.static(join(__dirname, 'public')));
app.use('/api/auth',authRouter);
app.use('/api/users', usersRouter);
app.use('/api/donors', donationsRouter);
app.use('/api/recipients', recipientsRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
})
