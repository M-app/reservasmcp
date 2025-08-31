import express from 'express';
import { ReservationsRepo } from '../repositories/reservations-repo.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start and end are required' });
  const items = ReservationsRepo.listByRange(String(start), String(end));
  res.json({ items });
});

export default router;
