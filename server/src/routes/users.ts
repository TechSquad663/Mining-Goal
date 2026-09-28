import { Router } from 'express';
import { db } from '../database/store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    users: db.users
  });
});

export default router;
