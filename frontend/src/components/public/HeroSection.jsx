import ScrollReveal from './ScrollReveal.jsx';
import { MdDateRange } from "react-icons/md";

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="container hero-container">
        <ScrollReveal className="hero-copy">
          <div className="hero-badge">Ankara'nın Güvenilir Diş Kliniği</div>
          <h1>Sağlıklı ve <span>Işıltılı</span><br />Gülüşler İçin<br />Buradayız</h1>
          <p className="hero-desc">
            Parla Dental olarak modern teknoloji ve uzman ekibimizle ağız ve diş sağlığınız için kapsamlı tedavi hizmetleri sunuyoruz.
          </p>
          <div className="hero-btns">
            <a className="btn-primary" href="#randevu">📅 Randevu Al</a>
            <a className="btn-outline" href="#tedaviler">Tedavilerimiz</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item"><div className="num">15+</div><div className="label">Yıllık Deneyim</div></div>
            <div className="stat-item"><div className="num">8.500+</div><div className="label">Mutlu Hasta</div></div>
            <div className="stat-item"><div className="num">98%</div><div className="label">Memnuniyet</div></div>
            <div className="stat-item"><div className="num">12</div><div className="label">Uzman Hekim</div></div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="hero-img" delay={120}>
          <div className="hero-card floating-card one">
            <div className="hero-card-icon">🦷</div>
            <div className="hero-card-text">
              <div className="title">Modern Tedavi Ekipmanları</div>
              <div className="sub">3D Dijital Tomografi & Lazer Tedavi</div>
            </div>
          </div>
          <div className="hero-card floating-card two">
            <div className="hero-card-icon">🏥</div>
            <div className="hero-card-text">
              <div className="title">Steril & Güvenli Ortam</div>
              <div className="sub">ISO standartları ile sterilizasyon</div>
            </div>
          </div>
          <div className="hero-card floating-card three">
            <div className="hero-card-icon">💳</div>
            <div className="hero-card-text">
              <div className="title">Kolay Ödeme Seçenekleri</div>
              <div className="sub">12 aya varan taksit imkânı</div>
            </div>
          </div>
          <div className="hero-badge-float"><span className="stars">★★★★★</span><span>Google'da 4.9/5</span></div>
        </ScrollReveal>
      </div>
    </section>
  );
}
