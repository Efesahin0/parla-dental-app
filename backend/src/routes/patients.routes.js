import express from 'express';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('ADMIN', 'DENTIST'), asyncHandler(async (req, res) => {
  const q = req.query.q ? `%${req.query.q}%` : null;

  const result = q
    ? await query(
        `SELECT * FROM patients
         WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1
         ORDER BY created_at DESC`,
        [q]
      )
    : await query('SELECT * FROM patients ORDER BY created_at DESC');

  res.json({ patients: result.rows });
}));

router.get('/:id', requireRole('ADMIN', 'DENTIST'), asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM patients WHERE id=$1', [req.params.id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json({ patient: result.rows[0] });
}));

router.post('/', requireRole('ADMIN' , 'DENTIST'), asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    nationalId,
    phone,
    email,
    birthDate,
    gender,
    address,
    notes
  } = req.body;

  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ message: 'First name, last name and phone are required' });
  }

  const result = await query(
    `INSERT INTO patients
     (first_name, last_name, national_id, phone, email, birth_date, gender, address, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [firstName, lastName, nationalId || null, phone, email || null, birthDate || null, gender || null, address || null, notes || null]
  );

  res.status(201).json({ patient: result.rows[0] });
}));

router.put('/:id', requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    nationalId,
    phone,
    email,
    birthDate,
    gender,
    address,
    notes
  } = req.body;

  const result = await query(
    `UPDATE patients
     SET first_name=$1, last_name=$2, national_id=$3, phone=$4, email=$5,
         birth_date=$6, gender=$7, address=$8, notes=$9, updated_at=NOW()
     WHERE id=$10
     RETURNING *`,
    [firstName, lastName, nationalId || null, phone, email || null, birthDate || null, gender || null, address || null, notes || null, req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  res.json({ patient: result.rows[0] });
}));

export default router;
