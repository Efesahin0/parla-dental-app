import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { query } from '../db.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const result = await query(
      'SELECT id, name, email, role, specialization FROM users WHERE id=$1',
      [payload.sub]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action' });
    }
    next();
  };
}
