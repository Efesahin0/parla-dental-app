import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { query } from '../db.js';
import { config } from '../config.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

router.get('/dentists', asyncHandler(async (req, res) => {
  const result = await query(
    `
    SELECT id, name, email, specialization, created_at
    FROM users
    WHERE role = 'DENTIST'
    ORDER BY name ASC
    `
  );

  res.json({
    dentists: result.rows
  });
}));

router.post('/dentists', requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    specialization
  } = req.body;

  if (!name || !email || !specialization) {
    return res.status(400).json({
      message: 'Ad, e-posta ve uzmanlık alanı zorunludur.'
    });
  }

  const existing = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existing.rowCount > 0) {
    return res.status(409).json({
      message: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.'
    });
  }

  const plainPassword = password || config.dentistPassword;
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const result = await query(
    `
    INSERT INTO users (name, email, password_hash, role, specialization)
    VALUES ($1, $2, $3, 'DENTIST', $4)
    RETURNING id, name, email, specialization, created_at
    `,
    [name, email, passwordHash, specialization]
  );

  res.status(201).json({
    message: 'Diş hekimi başarıyla eklendi.',
    dentist: result.rows[0]
  });
}));

export default router;