import express from 'express';
import { z } from 'zod';
import { FloorPositionsRepo } from '../repositories/floor-positions-repo.js';

const router = express.Router();

const upsertSchema = z.object({
  table_id: z.number().int().min(1),
  x: z.number(),
  y: z.number(),
  rotation: z.number().optional(),
  meta: z.any().optional(),
});

router.get('/', (req, res) => {
  res.json(FloorPositionsRepo.list());
});

router.get('/:tableId', (req, res) => {
  const item = FloorPositionsRepo.getByTable(Number(req.params.tableId));
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

router.post('/', (req, res, next) => {
  try {
    const data = upsertSchema.parse(req.body);
    const saved = FloorPositionsRepo.upsert(data);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

router.delete('/:tableId', (req, res) => {
  const tableId = Number(req.params.tableId);
  const found = FloorPositionsRepo.getByTable(tableId);
  if (!found) return res.status(404).json({ error: 'Not Found' });
  FloorPositionsRepo.removeByTable(tableId);
  res.status(204).end();
});

export default router;
