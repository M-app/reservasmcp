import express from 'express';
import { z } from 'zod';
import { FloorBoxesRepo } from '../repositories/floor-boxes-repo.js';

const router = express.Router();

const upsertSchema = z.object({
  id: z.string().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  label: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  meta: z.any().optional(),
});

router.get('/', (req, res) => {
  res.json(FloorBoxesRepo.list());
});

router.get('/:id', (req, res) => {
  const item = FloorBoxesRepo.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

router.post('/', (req, res, next) => {
  try {
    const data = upsertSchema.parse(req.body);
    const saved = FloorBoxesRepo.upsert(data);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  const found = FloorBoxesRepo.get(req.params.id);
  if (!found) return res.status(404).json({ error: 'Not Found' });
  FloorBoxesRepo.remove(req.params.id);
  res.status(204).end();
});

export default router;


