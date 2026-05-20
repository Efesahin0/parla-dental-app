import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/http.js';
import { clinicLocation } from '../../data/location.js';
import ScrollReveal from './ScrollReveal.jsx';

const fallbackState = {
  placeName: 'Parla Dental',
  rating: null,
  userRatingCount: null,
  reviews: [],
  source: 'loading'
};

function formatReviewDate(review) {
  return review.relativePublishTimeDescription || review.timeDescription || 'Google yorumu';
}

export default function GoogleReviewsSection() {
  const [reviewData, setReviewData] = useState(fallbackState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadGoogleReviews() {
      try {
        const data = await apiRequest('/google-reviews');
        if (alive) setReviewData(data);
      } catch (err) {
        if (alive) {
          setReviewData({
            ...fallbackState,
            source: 'error',
            message: err.message || 'Google yorumları yüklenemedi.'
          });
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadGoogleReviews();

    return () => {
      alive = false;
    };
  }, []);

  const hasReviews = reviewData.reviews && reviewData.reviews.length > 0;

  return (
    <section className="google-reviews-section" id="yorumlar">
      <div className="container">
        <ScrollReveal className="reviews-heading-row">
          <div>
            <div className="section-label">Google Yorumları</div>
            <h2>Hastalarımız Google’da Ne Söylüyor?</h2>
            <p className="section-desc">
              Bu bölüm Google Places API üzerinden kliniğin Google işletme profilindeki gerçek yorumları çekmek için hazırlandı.
            </p>
          </div>

          <div className="google-rating-summary">
            <span className="google-badge">Google</span>
            <strong>{reviewData.rating ? reviewData.rating.toFixed(1) : loading ? '...' : 'API'}</strong>
            <span className="stars">★★★★★</span>
            <small>
              {reviewData.userRatingCount
                ? `${reviewData.userRatingCount} değerlendirme`
                : loading
                  ? 'Yükleniyor'
                  : 'API anahtarı gerekli'}
            </small>
          </div>
        </ScrollReveal>

        {hasReviews ? (
          <div className="google-reviews-grid">
            {reviewData.reviews.map((review, index) => (
              <ScrollReveal as="article" className="google-review-card" key={`${review.authorName}-${index}`} delay={index * 90}>
                <div className="review-card-top">
                  <div className="review-avatar">
                    {review.profilePhotoUrl ? <img src={review.profilePhotoUrl} alt={review.authorName} /> : review.authorName?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <h3>{review.authorName || 'Google kullanıcısı'}</h3>
                    <p>{formatReviewDate(review)}</p>
                  </div>
                </div>
                <div className="testimonial-stars">{'★'.repeat(Math.round(review.rating || 5))}</div>
                <p className="google-review-text">“{review.text}”</p>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal className="google-review-empty" delay={120}>
            <div className="empty-icon">⭐</div>
            <h3>Gerçek Google yorumları için API bağlantısı hazır.</h3>
            <p>
              Google Places API anahtarını ve Place ID değerini <code>.env</code> veya <code>docker-compose.yml</code> içine eklediğinde bu alan otomatik olarak gerçek Google yorumlarını gösterecek.
            </p>
            <a className="btn-primary" href={clinicLocation.mapsUrl} target="_blank" rel="noreferrer">
              Google Profilini Aç
            </a>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
