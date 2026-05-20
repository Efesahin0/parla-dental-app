export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(JSON.stringify({
    level: 'error',
    event: 'api.error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  }));

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
