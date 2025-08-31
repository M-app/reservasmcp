import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

function parseCorsOrigins(value) {
  if (!value || value === '*') return '*';
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function resolveDatabasePath() {
  if (process.env.DATABASE_PATH && process.env.DATABASE_PATH.trim().length > 0) {
    return process.env.DATABASE_PATH;
  }
  try {
    if (fs.existsSync('/data')) return '/data/app.db';
  } catch {
    // ignore
  }
  return './data/app.db';
}

export const env = {
  port: Number(process.env.PORT || 4000),
  databasePath: resolveDatabasePath(),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN || '*'),
};
