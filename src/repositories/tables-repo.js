import { withDatabase } from '../db/index.js';

export const TablesRepo = {
  list() {
    return withDatabase((db) => db.prepare('SELECT * FROM tables ORDER BY id ASC').all());
  },
  getById(id) {
    return withDatabase((db) => db.prepare('SELECT * FROM tables WHERE id = ?').get(id));
  },
  create(data) {
    return withDatabase((db) => {
      const stmt = db.prepare(
        `INSERT INTO tables (name, capacity, status) VALUES (@name, @capacity, @status)`
      );
      const info = stmt.run({ name: data.name, capacity: data.capacity, status: data.status || 'available' });
      return this.getById(info.lastInsertRowid);
    });
  },
  update(id, data) {
    return withDatabase((db) => {
      const stmt = db.prepare(
        `UPDATE tables SET name=@name, capacity=@capacity, status=@status WHERE id=@id`
      );
      stmt.run({ id, name: data.name, capacity: data.capacity, status: data.status || 'available' });
      return this.getById(id);
    });
  },
  remove(id) {
    return withDatabase((db) => db.prepare('DELETE FROM tables WHERE id = ?').run(id));
  },
};
