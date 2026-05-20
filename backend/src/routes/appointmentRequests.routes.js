import express from 'express';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    email,
    service,
    preferredDate,
    preferredTime,
    message
  } = req.body;

  if (!fullName || !phone || !service) {
    return res.status(400).json({ message: 'Full name, phone and service are required' });
  }

  const result = await query(
    `INSERT INTO appointment_requests
     (full_name, phone, email, service, preferred_date, preferred_time, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [fullName, phone, email || null, service, preferredDate || null, preferredTime || null, message || null]
  );

  console.log(JSON.stringify({
    level: 'info',
    event: 'appointment_request.created',
    requestId: result.rows[0].id
  }));

  res.status(201).json({ request: result.rows[0] });
}));

router.get('/', authenticate, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT *
     FROM appointment_requests
     ORDER BY created_at DESC`
  );

  res.json({ requests: result.rows });
}));

router.patch('/:id/status', authenticate, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid request status' });
  }

  const result = await query(
    `UPDATE appointment_requests
     SET status=$1
     WHERE id=$2
     RETURNING *`,
    [status, req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Appointment request not found' });
  }

  res.json({ request: result.rows[0] });
}));

export default router;
