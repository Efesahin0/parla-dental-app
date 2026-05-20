import ScrollReveal from './ScrollReveal.jsx';

export default function AboutSection() {
  return (
    <section id="hakkimizda">
      <div className="container why-grid">
        <ScrollReveal className="why-img-block">
          <div className="why-stat">
            <div><div className="why-stat-num">2009</div><div className="why-stat-text">yılından bu yana hizmetinizdeyiz</div></div>
          </div>
          <div className="why-stat">
            <div><div className="why-stat-num">3D</div><div className="why-stat-text">Dijital Tomografi & Smile Design</div></div>
          </div>
          <div className="why-stat">
            <div><div className="why-stat-num">SGK</div><div className="why-stat-text">Anlaşmalı kurum süreç takibi</div></div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="section-label">Neden Parla Dental?</div>
          <h2>Güven Veren, Modern Diş Hekimliği</h2>
          <p className="section-desc">15 yılı aşkın tecrübemizle Ankara'da diş sağlığı alanında fark yaratıyoruz.</p>

          <div className="why-features">
            <div className="why-feature">
              <div className="why-feature-icon">🏆</div>
              <div className="why-feature-text">
                <div className="title">Uzman Kadro</div>
                <div className="desc">Tüm branşlarda uzman diş hekimleri ve yardımcı sağlık personeli.</div>
              </div>
            </div>
            <div className="why-feature">
              <div className="why-feature-icon">🔬</div>
              <div className="why-feature-text">
                <div className="title">İleri Teknoloji</div>
                <div className="desc">Dijital röntgen, 3D tomografi, CAD/CAM sistem ve lazer teknolojileri.</div>
              </div>
            </div>
            <div className="why-feature">
              <div className="why-feature-icon">📱</div>
              <div className="why-feature-text">
                <div className="title">Kolay Randevu & Takip</div>
                <div className="desc">Online randevu ve tedavi takip sistemi ile merkezi yönetim.</div>
              </div>
            </div>
          </div>

          <a className="btn-primary" href="#randevu">Ücretsiz Konsültasyon Al</a>
        </ScrollReveal>
      </div>
    </section>
  );
}
