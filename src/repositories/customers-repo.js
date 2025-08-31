import { withDatabase } from '../db/index.js';

export const CustomersRepo = {
  list() {
    return withDatabase((db) => db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all());
  },
  getById(id) {
    return withDatabase((db) => db.prepare('SELECT * FROM customers WHERE id = ?').get(id));
  },
  create(data) {
    return withDatabase((db) => {
      const stmt = db.prepare(
        `INSERT INTO customers (name, phone, email, notes) VALUES (@name, @phone, @email, @notes)`
      );
      const info = stmt.run({
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        notes: data.notes || null,
      });
      return this.getById(info.lastInsertRowid);
    });
  },
  update(id, data) {
    return withDatabase((db) => {
      const stmt = db.prepare(
        `UPDATE customers SET name=@name, phone=@phone, email=@email, notes=@notes WHERE id=@id`
      );
      stmt.run({ id, name: data.name, phone: data.phone || null, email: data.email || null, notes: data.notes || null });
      return this.getById(id);
    });
  },
  remove(id) {
    return withDatabase((db) => db.prepare('DELETE FROM customers WHERE id = ?').run(id));
  },
};
