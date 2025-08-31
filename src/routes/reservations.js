import express from 'express';
import { z } from 'zod';
import { ReservationsRepo } from '../repositories/reservations-repo.js';

const router = express.Router();

const reservationSchema = z.object({
  customer_id: z.number().int().min(1),
  table_id: z.number().int().min(1),
  start_time: z.string(),
  end_time: z.string(),
  size: z.number().int().min(1),
  status: z.enum(['booked', 'seated', 'cancelled']).optional(),
  notes: z.string().optional().nullable(),
});

router.get('/', (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start and end are required' });
  res.json(ReservationsRepo.listByRange(String(start), String(end)));
});

router.get('/:id', (req, res) => {
  const item = ReservationsRepo.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

router.post('/', (req, res, next) => {
  try {
    const data = reservationSchema.parse(req.body);
    const created = ReservationsRepo.create(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const data = reservationSchema.parse(req.body);
    const id = Number(req.params.id);
    if (!ReservationsRepo.getById(id)) return res.status(404).json({ error: 'Not Found' });
    const updated = ReservationsRepo.update(id, data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = ReservationsRepo.getById(id);
  if (!found) return res.status(404).json({ error: 'Not Found' });
  ReservationsRepo.remove(id);
  res.status(204).end();
});

export default router;
