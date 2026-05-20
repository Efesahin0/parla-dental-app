import express from 'express';
import { query } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get('/patient/:patientId', requireRole('ADMIN', 'DENTIST'), asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT
       tr.*,
       u.name AS dentist_name,
       p.first_name || ' ' || p.last_name AS patient_name
     FROM treatment_records tr
     JOIN users u ON u.id = tr.dentist_id
     JOIN patients p ON p.id = tr.patient_id
     WHERE tr.patient_id=$1
     ORDER BY tr.treatment_date DESC, tr.created_at DESC`,
    [req.params.patientId]
  );

  res.json({ treatments: result.rows });
}));

router.post('/', requireRole('ADMIN', 'DENTIST'), asyncHandler(async (req, res) => {
  const {
    patientId,
    appointmentId,
    dentistId,
    diagnosis,
    procedure,
    notes,
    treatmentDate
  } = req.body;

  if (!patientId || !diagnosis || !procedure) {
    return res.status(400).json({ message: 'patientId, diagnosis and procedure are required' });
  }

  const finalDentistId = req.user.role === 'DENTIST' ? req.user.id : dentistId;

  if (!finalDentistId) {
    return res.status(400).json({ message: 'dentistId is required for admin users' });
  }

  const result = await query(
    `INSERT INTO treatment_records
     (patient_id, appointment_id, dentist_id, diagnosis, procedure, notes, treatment_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [
      patientId,
      appointmentId || null,
      finalDentistId,
      diagnosis,
      procedure,
      notes || null,
      treatmentDate || new Date().toISOString().slice(0, 10)
    ]
  );

  res.status(201).json({ treatment: result.rows[0] });
}));

export default router;
