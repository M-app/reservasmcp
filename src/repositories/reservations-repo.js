import { withDatabase } from '../db/index.js';

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export const ReservationsRepo = {
  listByRange(startIso, endIso) {
    return withDatabase((db) =>
      db
        .prepare(
          `SELECT r.*, c.name as customer_name, t.name as table_name FROM reservations r
           JOIN customers c ON c.id = r.customer_id
           JOIN tables t ON t.id = r.table_id
           WHERE r.start_time < @endIso AND r.end_time > @startIso
           ORDER BY r.start_time ASC`
        )
        .all({ startIso, endIso })
    );
  },
  getById(id) {
    return withDatabase((db) => db.prepare('SELECT * FROM reservations WHERE id = ?').get(id));
  },
  hasOverlap(tableId, startIso, endIso, excludeId) {
    return withDatabase((db) => {
      const rows = db
        .prepare(
          `SELECT id, start_time, end_time FROM reservations WHERE table_id=@tableId`
        )
        .all({ tableId });
      return rows
        .filter((r) => (excludeId ? r.id !== excludeId : true))
        .some((r) => overlaps(new Date(r.start_time), new Date(r.end_time), new Date(startIso), new Date(endIso)));
    });
  },
  create(data) {
    return withDatabase((db) => {
      if (this.hasOverlap(data.table_id, data.start_time, data.end_time)) {
        const err = new Error('Reservation overlaps existing one for this table');
        err.status = 409;
        throw err;
      }
      const info = db
        .prepare(
          `INSERT INTO reservations (customer_id, table_id, start_time, end_time, size, status, notes)
           VALUES (@customer_id, @table_id, @start_time, @end_time, @size, @status, @notes)`
        )
        .run({
          customer_id: data.customer_id,
          table_id: data.table_id,
          start_time: data.start_time,
          end_time: data.end_time,
          size: data.size,
          status: data.status || 'booked',
          notes: data.notes || null,
        });
      return this.getById(info.lastInsertRowid);
    });
  },
  update(id, data) {
    return withDatabase((db) => {
      if (this.hasOverlap(data.table_id, data.start_time, data.end_time, id)) {
        const err = new Error('Reservation overlaps existing one for this table');
        err.status = 409;
        throw err;
      }
      db.prepare(
        `UPDATE reservations SET customer_id=@customer_id, table_id=@table_id, start_time=@start_time, end_time=@end_time, size=@size, status=@status, notes=@notes WHERE id=@id`
      ).run({
        id,
        customer_id: data.customer_id,
        table_id: data.table_id,
        start_time: data.start_time,
        end_time: data.end_time,
        size: data.size,
        status: data.status || 'booked',
        notes: data.notes || null,
      });
      return this.getById(id);
    });
  },
  remove(id) {
    return withDatabase((db) => db.prepare('DELETE FROM reservations WHERE id = ?').run(id));
  },
};
