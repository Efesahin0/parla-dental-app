import dotenv from 'dotenv';

dotenv.config();

function boolFromEnv(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
}

function requiredEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === null || value === '') {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

export const config = {
  serviceName: process.env.SERVICE_NAME || 'parla-dental-backend',
  buildVersion: process.env.BUILD_VERSION || 'local',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUrl: requiredEnv('DATABASE_URL'),
  jwtSecret: requiredEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  adminPassword: requiredEnv('ADMIN_PASSWORD'),
  dentistPassword: requiredEnv('DENTIST_PASSWORD'),
  autoMigrate: boolFromEnv(process.env.AUTO_MIGRATE, true),
  logSql: boolFromEnv(process.env.LOG_SQL, false),
  googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
  googlePlaceId: process.env.GOOGLE_PLACE_ID || '',
  googlePlaceSearchQuery: process.env.GOOGLE_PLACE_SEARCH_QUERY || 'Mutludent Ağız ve Diş Sağlığı Polikliniği, Çağlayan, Tıp Fakültesi Cd. 254/a, 06630 Mamak/Ankara',
  googleReviewsLanguage: process.env.GOOGLE_REVIEWS_LANGUAGE || 'tr',
  googleReviewsMax: Number(process.env.GOOGLE_REVIEWS_MAX || 3),
  googleMapsUrl: process.env.GOOGLE_MAPS_URL || 'https://maps.app.goo.gl/tEccPQAjQFgCWiNW9?g_st=iw',
  redisEnabled: boolFromEnv(process.env.REDIS_ENABLED, false),
  redisUrl: process.env.REDIS_URL || '',
  googleReviewsCacheTtlSeconds: Number(process.env.GOOGLE_REVIEWS_CACHE_TTL_SECONDS || 1800)
};
