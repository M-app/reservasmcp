import express from 'express';
import { z } from 'zod';
import { SettingsRepo } from '../repositories/settings-repo.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(SettingsRepo.list());
});

router.get('/:key', (req, res) => {
  const item = SettingsRepo.get(req.params.key);
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

const upsertSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
});

router.post('/', (req, res, next) => {
  try {
    const { key, value } = upsertSchema.parse(req.body);
    const saved = SettingsRepo.upsert(key, value);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

export default router;


