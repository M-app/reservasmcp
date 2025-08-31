import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { getDatabase } from './db/index.js';

import customersRouter from './routes/customers.js';
import tablesRouter from './routes/tables.js';
import floorPositionsRouter from './routes/floor-positions.js';
import reservationsRouter from './routes/reservations.js';
import calendarRouter from './routes/calendar.js';
import waitlistRouter from './routes/waitlist.js';
import realtimeRouter from './routes/realtime.js';

const app = express();

const corsOrigins = env.corsOrigins;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins === '*' || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Ensure DB initialized
getDatabase();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/customers', customersRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/floor-positions', floorPositionsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/waitlist', waitlistRouter);
app.use('/api/realtime', realtimeRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});
