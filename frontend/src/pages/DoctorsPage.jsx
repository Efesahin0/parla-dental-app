import PublicLayout from '../components/public/PublicLayout.jsx';
import ScrollReveal from '../components/public/ScrollReveal.jsx';
import DoctorCard from '../components/doctors/DoctorCard.jsx';
import { doctors, featuredDoctor } from '../data/doctors.js';

export default function DoctorsPage() {
  return (
    <PublicLayout>
      <section className="page-hero doctors-page-hero">
        <div className="container">
          <ScrollReveal>
            <div className="section-label">Hekimlerimiz</div>
            <h1>Parla Dental Uzman Kadrosu</h1>
            <p className="page-hero-desc">
              Modern, güvenilir ve hasta odaklı klinik anlayışımızla her hastaya kişiye özel tedavi süreci planlıyoruz.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="featured-doctor-section">
        <div className="container">
          <ScrollReveal as="article" className="featured-doctor-card">
            <div className="featured-doctor-image">
              <img src={featuredDoctor.image} alt={featuredDoctor.name} />
            </div>
            <div className="featured-doctor-content">
              <div className="section-label">Kurucu Hekim</div>
              <h2>{featuredDoctor.name}</h2>
              <div className="featured-doctor-title">{featuredDoctor.specialty}</div>
              <div className="featured-doctor-bio">
                {featuredDoctor.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="doctor-tags">
                {featuredDoctor.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="doctors-directory-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-label">Kadromuz</div>
            <h2>Hekimlerimiz</h2>
            <p className="section-desc">
              Farklı uzmanlık alanlarındaki hekim kartları animasyonlu olarak listelenir ve her hekim için branş, açıklama ve odak alanları gösterilir.
            </p>
          </ScrollReveal>
          <div className="doctors-directory-grid">
            {doctors.map((doctor, index) => (
              <DoctorCard key={doctor.name} doctor={doctor} delay={index * 90} />
            ))}
          </div>
        </div>
      </section>

      <section className="doctor-cta-section">
        <div className="container">
          <ScrollReveal className="doctor-cta-card">
            <div>
              <div className="section-label">Online Randevu</div>
              <h2>Size uygun hekim ve saat için randevu oluşturun</h2>
              <p className="section-desc">Randevu talebiniz admin paneline düşer, klinik ekibi sizi arayıp randevuyu onaylar.</p>
            </div>
            <a className="btn-primary" href="/#randevu">Randevu Talep Et</a>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}
