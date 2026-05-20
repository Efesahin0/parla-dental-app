import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal.jsx';
import DoctorCard from '../doctors/DoctorCard.jsx';
import { doctors } from '../../data/doctors.js';
import { ROUTES } from '../../routes/routePaths.js';

export default function DoctorsPreviewSection() {
  return (
    <section className="doctors-section" id="ekibimiz">
      <div className="container">
        <ScrollReveal>
          <div className="section-label">Hekimlerimiz</div>
          <h2>Uzman Hekimlerimizle Tanışın</h2>
          <p className="section-desc">Alanında uzman, deneyimli hekimlerimiz en iyi tedaviyi sağlamak için burada.</p>
        </ScrollReveal>

        <div className="doctors-grid">
          {doctors.slice(0, 3).map((doctor, index) => (
            <DoctorCard key={doctor.name} doctor={doctor} delay={index * 110} />
          ))}
        </div>

        <ScrollReveal className="section-action" delay={120}>
          <Link className="btn-outline" to={ROUTES.DOCTORS}>Tüm Hekimleri Gör →</Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
