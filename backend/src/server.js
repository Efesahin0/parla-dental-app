import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { runMigrationsAndSeed, closeDatabase } from './migrate.js';
import { checkDatabase } from './db.js';
import { checkRedis, closeRedis } from './redisClient.js';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patients.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import treatmentRoutes from './routes/treatments.routes.js';
import appointmentRequestRoutes from './routes/appointmentRequests.routes.js';
import googleReviewsRoutes from './routes/googleReviews.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const startedAt = Date.now();
const metrics = {
  httpRequestsTotal: 0,
  httpResponsesByStatus: new Map()
};

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(
  config.corsOrigin === '*'
    ? { origin: '*' }
    : {
        origin: config.corsOrigin.split(',').map((origin) => origin.trim()),
        credentials: true
      }
));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.use((req, res, next) => {
  metrics.httpRequestsTotal += 1;
  res.on('finish', () => {
    const key = String(res.statusCode);
    metrics.httpResponsesByStatus.set(key, (metrics.httpResponsesByStatus.get(key) || 0) + 1);
  });
  next();
});

app.get('/', (req, res) => {
  res.json({
    service: config.serviceName,
    version: config.buildVersion,
    message: 'Backend API is running. Frontend: http://localhost:3000, Health: /health, Readiness: /ready, Metrics: /metrics, API base: /api',
    endpoints: {
      health: '/health',
      readiness: '/ready',
      metrics: '/metrics',
      login: '/api/auth/login',
      patients: '/api/patients',
      appointments: '/api/appointments',
      appointmentRequests: '/api/appointment-requests',
      treatments: '/api/treatments',
      googleReviews: '/api/google-reviews'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: config.serviceName,
    version: config.buildVersion,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', async (req, res) => {
  try {
    await checkDatabase();
    const redis = await checkRedis();
    res.json({
      status: 'ready',
      service: config.serviceName,
      database: 'ok',
      redis,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: 'not_ready',
      service: config.serviceName,
      database: 'error',
      message: err.message
    });
  }
});

app.get('/metrics', (req, res) => {
  const lines = [
    '# HELP parla_http_requests_total Total HTTP requests handled by the backend.',
    '# TYPE parla_http_requests_total counter',
    `parla_http_requests_total ${metrics.httpRequestsTotal}`,
    '# HELP parla_http_responses_total Total HTTP responses grouped by status code.',
    '# TYPE parla_http_responses_total counter'
  ];

  for (const [status, count] of metrics.httpResponsesByStatus.entries()) {
    lines.push(`parla_http_responses_total{status="${status}"} ${count}`);
  }

  lines.push('# HELP parla_process_uptime_seconds Backend process uptime in seconds.');
  lines.push('# TYPE parla_process_uptime_seconds gauge');
  lines.push(`parla_process_uptime_seconds ${Math.floor((Date.now() - startedAt) / 1000)}`);

  res.type('text/plain; version=0.0.4').send(`${lines.join('\n')}\n`);
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/appointment-requests', appointmentRequestRoutes);
app.use('/api/google-reviews', googleReviewsRoutes);

app.use(notFound);
app.use(errorHandler);

let server;

async function start() {
  if (config.autoMigrate) {
    await runMigrationsAndSeed();
  } else {
    console.log(JSON.stringify({
      level: 'info',
      event: 'database.auto_migrate_skipped',
      reason: 'AUTO_MIGRATE=false'
    }));
  }

  server = app.listen(config.port, () => {
    console.log(JSON.stringify({
      level: 'info',
      event: 'server.started',
      service: config.serviceName,
      version: config.buildVersion,
      port: config.port,
      env: config.nodeEnv
    }));
  });
}

async function shutdown(signal) {
  console.log(JSON.stringify({
    level: 'info',
    event: 'server.shutdown',
    signal
  }));

  if (server) {
    server.close(async () => {
      await closeRedis();
      await closeDatabase();
      process.exit(0);
    });
  } else {
    await closeRedis();
    await closeDatabase();
    process.exit(0);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start().catch((err) => {
  console.error(JSON.stringify({
    level: 'error',
    event: 'server.start_failed',
    message: err.message,
    stack: err.stack
  }));
  process.exit(1);
});
