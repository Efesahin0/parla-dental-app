import { Link } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaRegSmileBeam,
  FaShieldAlt,
  FaTooth,
  FaUserMd
} from 'react-icons/fa';

export default function HeroSection() {
  return (
    <section className="hero-section" id="anasayfa">
      <div className="hero-bg-shape hero-bg-shape-one" />
      <div className="hero-bg-shape hero-bg-shape-two" />

      <div className="container hero-grid">
        <div className="hero-content">
          <span className="section-label">
            <FaTooth className="inline-section-icon" />
            Parla Dental
          </span>

          <h1>
            Sağlıklı, doğal ve estetik gülüşler için modern diş kliniği deneyimi.
          </h1>

          <p>
            Parla Dental’de muayene, randevu, hasta kayıtları ve tedavi süreçleri
            modern teknolojilerle düzenli, güvenli ve hasta odaklı şekilde yönetilir.
          </p>

          <div className="hero-actions">
            <a href="#randevu" className="btn-primary">
              <FaCalendarCheck />
              Randevu Al
            </a>

            <Link to="/hekimlerimiz" className="btn-outline">
              <FaUserMd />
              Hekimlerimiz
            </Link>
          </div>

          <div className="hero-features">
            <div>
              <FaRegSmileBeam />
              <span>Estetik Gülüş Tasarımı</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Hijyenik ve Güvenli Klinik</span>
            </div>

            <div>
              <FaTooth />
              <span>Kişiye Özel Tedavi Planı</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card hero-card-main">
            <div className="hero-card-icon">
              <FaTooth />
            </div>

            <h3>Parla Dental</h3>
            <p>
              Hasta kayıtları, randevular ve tedavi geçmişleri tek merkezden
              yönetilir.
            </p>
          </div>

          <div className="hero-floating-card hero-floating-card-top">
            <FaRegSmileBeam />
            <div>
              <strong>Doğal Gülüş</strong>
              <span>Estetik ve fonksiyon birlikte</span>
            </div>
          </div>

          <div className="hero-floating-card hero-floating-card-bottom">
            <FaCalendarCheck />
            <div>
              <strong>Kolay Randevu</strong>
              <span>Hızlı başvuru ve takip</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}