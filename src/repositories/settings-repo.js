import { withDatabase } from '../db/index.js';

export const SettingsRepo = {
  list() {
    return withDatabase((db) => db.prepare('SELECT key, value FROM settings ORDER BY key ASC').all());
  },
  get(key) {
    return withDatabase((db) => db.prepare('SELECT key, value FROM settings WHERE key = ?').get(key));
  },
  upsert(key, value) {
    return withDatabase((db) => {
      const exists = db.prepare('SELECT key FROM settings WHERE key = ?').get(key);
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
      if (exists) {
        db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(valueStr, key);
      } else {
        db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, valueStr);
      }
      return this.get(key);
    });
  },
};


