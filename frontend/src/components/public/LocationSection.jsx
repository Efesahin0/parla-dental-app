import { clinicLocation, getMapsEmbedUrl } from '../../data/location.js';
import ScrollReveal from './ScrollReveal.jsx';

export default function LocationSection() {
  return (
    <section className="location-section" id="konum">
      <div className="container location-grid">
        <ScrollReveal className="location-content">
          <div className="section-label">Konum & Adres</div>
          <h2>Kliniğimize Kolayca Ulaşın</h2>
          <p className="section-desc">
            Parla Dental’e ulaşım bilgileri, çalışma saatleri ve harita bağlantısı aşağıda yer alır.
          </p>

          <div className="location-info-list">
            <div className="location-info-card">
              <span className="location-info-icon">📍</span>
              <div>
                <strong>Adres</strong>
                <p>{clinicLocation.address}</p>
              </div>
            </div>

            <div className="location-info-card">
              <span className="location-info-icon">📞</span>
              <div>
                <strong>Telefon</strong>
                <p>{clinicLocation.phone}</p>
              </div>
            </div>

            <div className="location-info-card">
              <span className="location-info-icon">✉️</span>
              <div>
                <strong>E-posta</strong>
                <p>{clinicLocation.email}</p>
              </div>
            </div>
          </div>

          <div className="location-hours-card">
            <h3>Çalışma Saatleri</h3>
            {clinicLocation.workingHours.map((item) => (
              <div className="location-hour-row" key={item.day}>
                <span>{item.day}</span>
                <strong>{item.time}</strong>
              </div>
            ))}
          </div>

          <div className="location-actions">
            <a className="btn-primary" href={clinicLocation.mapsUrl} target="_blank" rel="noreferrer">
              Google Maps’te Aç
            </a>
            <a className="btn-outline" href="#randevu">Randevu Al</a>
          </div>
        </ScrollReveal>

        <ScrollReveal className="map-card" delay={130}>
          <iframe
            title="Parla Dental Google Maps Konumu"
            src={getMapsEmbedUrl()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
