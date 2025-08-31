import express from 'express';
import { z } from 'zod';
import { CustomersRepo } from '../repositories/customers-repo.js';

const router = express.Router();

const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  notes: z.string().optional().nullable(),
});

router.get('/', (req, res) => {
  res.json(CustomersRepo.list());
});

router.get('/:id', (req, res) => {
  const item = CustomersRepo.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

router.post('/', (req, res, next) => {
  try {
    const data = customerSchema.parse(req.body);
    const created = CustomersRepo.create(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const data = customerSchema.parse(req.body);
    const id = Number(req.params.id);
    if (!CustomersRepo.getById(id)) return res.status(404).json({ error: 'Not Found' });
    const updated = CustomersRepo.update(id, data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = CustomersRepo.getById(id);
  if (!found) return res.status(404).json({ error: 'Not Found' });
  CustomersRepo.remove(id);
  res.status(204).end();
});

export default router;
