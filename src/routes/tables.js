import express from 'express';
import { z } from 'zod';
import { TablesRepo } from '../repositories/tables-repo.js';

const router = express.Router();

const tableSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().min(1),
  status: z.enum(['available', 'occupied', 'reserved']).optional(),
});

router.get('/', (req, res) => {
  res.json(TablesRepo.list());
});

router.get('/:id', (req, res) => {
  const item = TablesRepo.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

router.post('/', (req, res, next) => {
  try {
    const data = tableSchema.parse(req.body);
    const created = TablesRepo.create(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const data = tableSchema.parse(req.body);
    const id = Number(req.params.id);
    if (!TablesRepo.getById(id)) return res.status(404).json({ error: 'Not Found' });
    const updated = TablesRepo.update(id, data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = TablesRepo.getById(id);
  if (!found) return res.status(404).json({ error: 'Not Found' });
  TablesRepo.remove(id);
  res.status(204).end();
});

export default router;
