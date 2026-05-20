import { createClient } from 'redis';
import { config } from './config.js';

let client = null;
let connecting = null;

export async function getRedisClient() {
  if (!config.redisEnabled || !config.redisUrl) {
    return null;
  }

  if (client?.isOpen) {
    return client;
  }

  if (connecting) {
    return connecting;
  }

  client = createClient({ url: config.redisUrl });

  client.on('error', (err) => {
    console.error(JSON.stringify({
      level: 'error',
      event: 'redis.error',
      message: err.message
    }));
  });

  connecting = client.connect()
    .then(() => {
      console.log(JSON.stringify({
        level: 'info',
        event: 'redis.connected'
      }));
      return client;
    })
    .catch((err) => {
      console.error(JSON.stringify({
        level: 'error',
        event: 'redis.connect_failed',
        message: err.message
      }));
      client = null;
      return null;
    })
    .finally(() => {
      connecting = null;
    });

  return connecting;
}

export async function getCachedJson(key) {
  const redis = await getRedisClient();
  if (!redis) return null;

  const value = await redis.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function setCachedJson(key, value, ttlSeconds) {
  const redis = await getRedisClient();
  if (!redis) return false;

  await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  return true;
}

export async function checkRedis() {
  if (!config.redisEnabled) {
    return { enabled: false, status: 'disabled' };
  }

  const redis = await getRedisClient();
  if (!redis) {
    throw new Error('Redis is enabled but the client could not connect');
  }

  const pong = await redis.ping();
  return { enabled: true, status: pong === 'PONG' ? 'ok' : 'unknown' };
}

export async function closeRedis() {
  if (client?.isOpen) {
    await client.quit();
  }
}
