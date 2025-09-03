export const migrations = [
  {
    id: 1,
    name: 'init_schema',
    up: `
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

      CREATE TABLE IF NOT EXISTS tables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_tables_name ON tables(name);

      CREATE TABLE IF NOT EXISTS floor_positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_id INTEGER NOT NULL UNIQUE,
        x REAL NOT NULL DEFAULT 0,
        y REAL NOT NULL DEFAULT 0,
        rotation REAL NOT NULL DEFAULT 0,
        meta TEXT,
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        table_id INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        size INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'booked',
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_reservations_table_time ON reservations(table_id, start_time, end_time);
      CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customer_id);

      CREATE TABLE IF NOT EXISTS waitlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT,
        party_size INTEGER NOT NULL,
        requested_time TEXT,
        status TEXT NOT NULL DEFAULT 'waiting',
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      -- triggers updated_at
      CREATE TRIGGER IF NOT EXISTS trg_customers_updated_at
      AFTER UPDATE ON customers
      FOR EACH ROW
      BEGIN
        UPDATE customers SET updated_at = datetime('now') WHERE id = OLD.id;
      END;

      CREATE TRIGGER IF NOT EXISTS trg_tables_updated_at
      AFTER UPDATE ON tables
      FOR EACH ROW
      BEGIN
        UPDATE tables SET updated_at = datetime('now') WHERE id = OLD.id;
      END;

      CREATE TRIGGER IF NOT EXISTS trg_reservations_updated_at
      AFTER UPDATE ON reservations
      FOR EACH ROW
      BEGIN
        UPDATE reservations SET updated_at = datetime('now') WHERE id = OLD.id;
      END;
    `,
  },
  {
    id: 2,
    name: 'add_floor_boxes',
    up: `
      CREATE TABLE IF NOT EXISTS floor_boxes (
        id TEXT PRIMARY KEY,
        x REAL NOT NULL DEFAULT 0,
        y REAL NOT NULL DEFAULT 0,
        width REAL NOT NULL DEFAULT 100,
        height REAL NOT NULL DEFAULT 60,
        label TEXT,
        color TEXT,
        meta TEXT
      );
    `,
  },
  {
    id: 3,
    name: 'add_settings_kv',
    up: `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `,
  },
];
