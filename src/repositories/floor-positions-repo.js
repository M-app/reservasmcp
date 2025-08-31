import { withDatabase } from '../db/index.js';

export const FloorPositionsRepo = {
  list() {
    return withDatabase((db) =>
      db
        .prepare(
          'SELECT fp.*, t.name as table_name, t.capacity as table_capacity FROM floor_positions fp JOIN tables t ON t.id = fp.table_id ORDER BY t.id ASC'
        )
        .all()
    );
  },
  getByTable(tableId) {
    return withDatabase((db) => db.prepare('SELECT * FROM floor_positions WHERE table_id = ?').get(tableId));
  },
  upsert(data) {
    return withDatabase((db) => {
      const existing = db.prepare('SELECT id FROM floor_positions WHERE table_id = ?').get(data.table_id);
      if (existing) {
        db.prepare(
          `UPDATE floor_positions SET x=@x, y=@y, rotation=@rotation, meta=@meta WHERE table_id=@table_id`
        ).run({
          table_id: data.table_id,
          x: data.x,
          y: data.y,
          rotation: data.rotation || 0,
          meta: data.meta ? JSON.stringify(data.meta) : null,
        });
        return this.getByTable(data.table_id);
      } else {
        const info = db.prepare(
          `INSERT INTO floor_positions (table_id, x, y, rotation, meta) VALUES (@table_id, @x, @y, @rotation, @meta)`
        ).run({
          table_id: data.table_id,
          x: data.x,
          y: data.y,
          rotation: data.rotation || 0,
          meta: data.meta ? JSON.stringify(data.meta) : null,
        });
        return db.prepare('SELECT * FROM floor_positions WHERE id = ?').get(info.lastInsertRowid);
      }
    });
  },
  removeByTable(tableId) {
    return withDatabase((db) => db.prepare('DELETE FROM floor_positions WHERE table_id = ?').run(tableId));
  },
};
