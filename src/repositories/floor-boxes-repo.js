import { withDatabase } from '../db/index.js';

export const FloorBoxesRepo = {
  list() {
    return withDatabase((db) => db.prepare('SELECT * FROM floor_boxes ORDER BY id ASC').all());
  },
  get(id) {
    return withDatabase((db) => db.prepare('SELECT * FROM floor_boxes WHERE id = ?').get(id));
  },
  upsert(box) {
    return withDatabase((db) => {
      const exists = db.prepare('SELECT id FROM floor_boxes WHERE id = ?').get(box.id);
      const payload = {
        id: box.id,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        label: box.label ?? null,
        color: box.color ?? null,
        meta: box.meta ? JSON.stringify(box.meta) : null,
      };
      if (exists) {
        db.prepare(
          `UPDATE floor_boxes SET x=@x, y=@y, width=@width, height=@height, label=@label, color=@color, meta=@meta WHERE id=@id`
        ).run(payload);
      } else {
        db.prepare(
          `INSERT INTO floor_boxes (id, x, y, width, height, label, color, meta) VALUES (@id, @x, @y, @width, @height, @label, @color, @meta)`
        ).run(payload);
      }
      return this.get(box.id);
    });
  },
  remove(id) {
    return withDatabase((db) => db.prepare('DELETE FROM floor_boxes WHERE id = ?').run(id));
  },
};


