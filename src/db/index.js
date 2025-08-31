import Database from 'better-sqlite3';
import { env } from '../config/env.js';
import { migrations } from './migrations.js';
import fs from 'fs';
import path from 'path';

let dbInstance;

export function getDatabase() {
  if (dbInstance) return dbInstance;
  const dbDir = path.dirname(env.databasePath);
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  } catch (e) {
    // Si falla crear el directorio, lanzamos un error claro
    throw new Error(`Cannot create database directory '${dbDir}': ${e.message}`);
  }
  dbInstance = new Database(env.databasePath);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  // Migrations table
  dbInstance
    .prepare(
      `CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    )
    .run();

  const applied = new Set(
    dbInstance.prepare('SELECT id FROM migrations').all().map((m) => m.id)
  );

  const run = dbInstance.transaction(() => {
    for (const m of migrations) {
      if (applied.has(m.id)) continue;
      dbInstance.exec(m.up);
      dbInstance
        .prepare('INSERT INTO migrations (id, name) VALUES (?, ?)')
        .run(m.id, m.name);
    }
  });

  run();

  return dbInstance;
}

export function withDatabase(fn) {
  const db = getDatabase();
  return fn(db);
}
