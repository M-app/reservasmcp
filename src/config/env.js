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
  belliataApiUrl: process.env.BELLIATA_API_URL || 'https://api.belliata.com/api/v1/b2b/appointments/store',
  belliataApiKey: process.env.BELLIATA_API_KEY || '',
  belliataAuthScheme: (process.env.BELLIATA_AUTH_SCHEME || 'bearer').toLowerCase(), // 'bearer' | 'x-api-key' | 'basic'
  belliataBasicUser: process.env.BELLIATA_BASIC_USER || '',
  belliataBasicPass: process.env.BELLIATA_BASIC_PASS || '',
  belliataLoginUrl: process.env.BELLIATA_LOGIN_URL || 'https://api.belliata.com/api/v1/b2b/login',
  belliataLoginEmail: process.env.BELLIATA_LOGIN_EMAIL || '',
  belliataLoginPassword: process.env.BELLIATA_LOGIN_PASSWORD || '',
};
