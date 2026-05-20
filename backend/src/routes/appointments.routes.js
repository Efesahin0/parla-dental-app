import express from 'express';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('ADMIN', 'DENTIST'), asyncHandler(async (req, res) => {
  const params = [];
  let where = '';

  if (req.user.role === 'DENTIST') {
    where = 'WHERE a.dentist_id = $1';
    params.push(req.user.id);
  }

  const result = await query(
    `SELECT
       a.*,
       p.first_name || ' ' || p.last_name AS patient_name,
       p.phone AS patient_phone,
       u.name AS dentist_name
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN users u ON u.id = a.dentist_id
     ${where}
     ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
    params
  );

  res.json({ appointments: result.rows });
}));

router.get('/dentists', authenticate, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, email, specialization
     FROM users
     WHERE role='DENTIST'
     ORDER BY name ASC`
  );
  res.json({ dentists: result.rows });
}));

router.post('/', requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const {
    patientId,
    dentistId,
    appointmentDate,
    appointmentTime,
    service,
    notes
  } = req.body;

  if (!patientId || !dentistId || !appointmentDate || !appointmentTime || !service) {
    return res.status(400).json({ message: 'patientId, dentistId, appointmentDate, appointmentTime and service are required' });
  }

  const result = await query(
    `INSERT INTO appointments
     (patient_id, dentist_id, appointment_date, appointment_time, service, notes)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [patientId, dentistId, appointmentDate, appointmentTime, service, notes || null]
  );

  res.status(201).json({ appointment: result.rows[0] });
}));

router.patch('/:id/status', requireRole('ADMIN', 'DENTIST'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['SCHEDULED', 'COMPLETED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid appointment status' });
  }

  const params = [status, req.params.id];
  let dentistCheck = '';

  if (req.user.role === 'DENTIST') {
    params.push(req.user.id);
    dentistCheck = 'AND dentist_id = $3';
  }

  const result = await query(
    `UPDATE appointments
     SET status=$1, updated_at=NOW()
     WHERE id=$2 ${dentistCheck}
     RETURNING *`,
    params
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Appointment not found or not allowed' });
  }

  res.json({ appointment: result.rows[0] });
}));

export default router;
