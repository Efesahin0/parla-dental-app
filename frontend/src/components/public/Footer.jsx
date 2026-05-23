import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';
import { ROUTES } from '../../routes/routePaths.js';
import { clinicLocation } from '../../data/location.js';

export default function Footer() {
  return (
    <footer id="iletisim">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Logo light />
            <p>Parla Dental, uzman kadrosu ve modern teknolojileriyle ağız ve diş sağlığınız için merkezi çözümler sunar.</p>
            <div className="social-links">
              <a className="social-link" href="#" title="Instagram">📸</a>
              <a className="social-link" href="#" title="Facebook">👥</a>
              <a className="social-link" href="#" title="YouTube">▶</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Tedaviler</h4>
            <a href="/#tedaviler">Koruyucu Tedaviler</a>
            <a href="/#tedaviler">İmplant Tedavileri</a>
            <a href="/#tedaviler">Ortodontik Uygulamalar</a>
            <a href="/#tedaviler">Estetik Diş Hekimliği</a>
          </div>

          <div className="footer-col">
            <h4>Kurumsal</h4>
            <a href="/#hakkimizda">Hakkımızda</a>
            <Link to={ROUTES.DOCTORS}>Hekimlerimiz</Link>
            <a href="/#konum">Konum</a>
            <a href="/#yorumlar">Google Yorumları</a>
            <Link to={ROUTES.LOGIN}>Panel Girişi</Link>
          </div>

          <div className="footer-col">
            <h4>İletişim</h4>
            <a href="tel:+903124567890">📞 {clinicLocation.phone}</a>
            <a href="mailto:info@parladental.com">📧 {clinicLocation.email}</a>
            <a href={clinicLocation.mapsUrl} target="_blank" rel="noreferrer">📍 {clinicLocation.shortAddress}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Parla Dental. Tüm hakları saklıdır.</span>
          <span>Gizlilik Politikası | KVKK | Çerez Politikası</span>
        </div>
      </div>
    </footer>
  );
}
