import { withDatabase } from '../db/index.js';

export const WaitlistRepo = {
  list() {
    return withDatabase((db) => db.prepare('SELECT * FROM waitlist ORDER BY created_at ASC').all());
  },
  getById(id) {
    return withDatabase((db) => db.prepare('SELECT * FROM waitlist WHERE id = ?').get(id));
  },
  create(data) {
    return withDatabase((db) => {
      const info = db
        .prepare(
          `INSERT INTO waitlist (customer_name, phone, party_size, requested_time, status, notes)
           VALUES (@customer_name, @phone, @party_size, @requested_time, @status, @notes)`
        )
        .run({
          customer_name: data.customer_name,
          phone: data.phone || null,
          party_size: data.party_size,
          requested_time: data.requested_time || null,
          status: data.status || 'waiting',
          notes: data.notes || null,
        });
      return this.getById(info.lastInsertRowid);
    });
  },
  update(id, data) {
    return withDatabase((db) => {
      db.prepare(
        `UPDATE waitlist SET customer_name=@customer_name, phone=@phone, party_size=@party_size, requested_time=@requested_time, status=@status, notes=@notes WHERE id=@id`
      ).run({
        id,
        customer_name: data.customer_name,
        phone: data.phone || null,
        party_size: data.party_size,
        requested_time: data.requested_time || null,
        status: data.status || 'waiting',
        notes: data.notes || null,
      });
      return this.getById(id);
    });
  },
  remove(id) {
    return withDatabase((db) => db.prepare('DELETE FROM waitlist WHERE id = ?').run(id));
  },
};
