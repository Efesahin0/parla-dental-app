import express from 'express';
import { config } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getCachedJson, setCachedJson } from '../redisClient.js';

const router = express.Router();

const CACHE_KEY = 'parla:google-reviews:v1';
const MEMORY_CACHE_TTL_MS = config.googleReviewsCacheTtlSeconds * 1000;
let cachedPayload = null;
let cachedAt = 0;

function normalizeReview(review) {
  return {
    authorName: review.author_name || 'Google kullanıcısı',
    rating: Number(review.rating || 5),
    text: review.text || '',
    relativePublishTimeDescription: review.relative_time_description || '',
    timeDescription: review.time ? new Date(review.time * 1000).toLocaleDateString('tr-TR') : '',
    profilePhotoUrl: review.profile_photo_url || '',
    authorUrl: review.author_url || ''
  };
}

function buildConfigurationRequiredPayload() {
  return {
    source: 'configuration_required',
    placeName: 'Parla Dental',
    rating: null,
    userRatingCount: null,
    googleMapsUri: config.googleMapsUrl,
    reviews: [],
    message: 'GOOGLE_PLACES_API_KEY eklenmediği için gerçek Google yorumları canlı çekilemiyor.'
  };
}

async function findPlaceId() {
  if (config.googlePlaceId) return config.googlePlaceId;

  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
  url.searchParams.set('input', config.googlePlaceSearchQuery);
  url.searchParams.set('inputtype', 'textquery');
  url.searchParams.set('fields', 'place_id,name,formatted_address');
  url.searchParams.set('language', config.googleReviewsLanguage);
  url.searchParams.set('key', config.googlePlacesApiKey);

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || !data.candidates?.length) {
    throw new Error(`Google place search failed: ${data.status || 'UNKNOWN'} ${data.error_message || ''}`.trim());
  }

  return data.candidates[0].place_id;
}

async function fetchPlaceReviews() {
  const placeId = await findPlaceId();

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews,url,formatted_address');
  url.searchParams.set('language', config.googleReviewsLanguage);
  url.searchParams.set('key', config.googlePlacesApiKey);

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Google place details failed: ${data.status || 'UNKNOWN'} ${data.error_message || ''}`.trim());
  }

  const place = data.result || {};
  const reviews = (place.reviews || [])
    .map(normalizeReview)
    .filter((review) => review.text)
    .slice(0, config.googleReviewsMax);

  return {
    source: 'google_places_api',
    placeName: place.name || 'Parla Dental',
    formattedAddress: place.formatted_address || '',
    rating: place.rating ? Number(place.rating) : null,
    userRatingCount: place.user_ratings_total ? Number(place.user_ratings_total) : null,
    googleMapsUri: place.url || config.googleMapsUrl,
    reviews
  };
}

function getMemoryCache() {
  const now = Date.now();
  if (cachedPayload && now - cachedAt < MEMORY_CACHE_TTL_MS) {
    return cachedPayload;
  }
  return null;
}

function setMemoryCache(payload) {
  cachedPayload = payload;
  cachedAt = Date.now();
}

router.get('/', asyncHandler(async (req, res) => {
  if (!config.googlePlacesApiKey) {
    return res.json(buildConfigurationRequiredPayload());
  }

  const redisCached = await getCachedJson(CACHE_KEY);
  if (redisCached) {
    return res.json({ ...redisCached, cache: 'redis_hit' });
  }

  const memoryCached = getMemoryCache();
  if (memoryCached) {
    return res.json({ ...memoryCached, cache: 'memory_hit' });
  }

  const payload = await fetchPlaceReviews();
  setMemoryCache(payload);
  await setCachedJson(CACHE_KEY, payload, config.googleReviewsCacheTtlSeconds);

  return res.json({ ...payload, cache: config.redisEnabled ? 'redis_miss' : 'memory_miss' });
}));

export default router;
