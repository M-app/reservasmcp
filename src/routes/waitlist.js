import express from 'express';
import { z } from 'zod';
import { WaitlistRepo } from '../repositories/waitlist-repo.js';

const router = express.Router();

const waitSchema = z.object({
  customer_name: z.string().min(1),
  phone: z.string().optional().nullable(),
  party_size: z.number().int().min(1),
  requested_time: z.string().optional().nullable(),
  status: z.enum(['waiting', 'seated', 'cancelled']).optional(),
  notes: z.string().optional().nullable(),
});

router.get('/', (req, res) => {
  res.json(WaitlistRepo.list());
});

router.get('/:id', (req, res) => {
  const item = WaitlistRepo.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

router.post('/', (req, res, next) => {
  try {
    const data = waitSchema.parse(req.body);
    const created = WaitlistRepo.create(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const data = waitSchema.parse(req.body);
    const id = Number(req.params.id);
    if (!WaitlistRepo.getById(id)) return res.status(404).json({ error: 'Not Found' });
    const updated = WaitlistRepo.update(id, data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = WaitlistRepo.getById(id);
  if (!found) return res.status(404).json({ error: 'Not Found' });
  WaitlistRepo.remove(id);
  res.status(204).end();
});

export default router;
