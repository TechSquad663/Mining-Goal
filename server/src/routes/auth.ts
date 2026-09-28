import { Router } from 'express';
import { db } from '../database/store.js';

const router = Router();

// Current active session user
router.get('/me', (req, res) => {
  res.json({ success: true, user: db.currentUser });
});

// Mock login / switch user role
router.post('/login', (req, res) => {
  const { role, email } = req.body;
  let targetUser = db.users.find(u => (email && u.email === email) || (role && u.role === role));
  if (!targetUser) {
    targetUser = db.users[0];
  }
  db.currentUser = targetUser;
  res.json({
    success: true,
    token: `jwt_token_${targetUser.id}_session`,
    user: targetUser
  });
});

export default router;
