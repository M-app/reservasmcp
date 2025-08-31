import dotenv from 'dotenv';

dotenv.config();

function parseCorsOrigins(value) {
  if (!value || value === '*') return '*';
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export const env = {
  port: Number(process.env.PORT || 4000),
  databasePath: process.env.DATABASE_PATH || './data/app.db',
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN || 'http://localhost:9000'),
};
