import ScrollReveal from './ScrollReveal.jsx';
import TreatmentIcon from './TreatmentIcon.jsx';
import { treatments, treatmentsNote } from '../../data/treatments.js';

export default function TreatmentsSection() {
  return (
    <section className="treatments-section" id="tedaviler">
      <div className="container">
        <ScrollReveal className="treatments-heading">
          <div className="section-label">Tedavilerimiz</div>
          <h2>Parla Dental Tedavi Alanları</h2>
          <p className="section-desc">
            Estetik, implant, protetik, restoratif, cerrahi, ortodontik ve çocuk diş hekimliği alanlarında
            kapsamlı ağız ve diş sağlığı çözümleri sunuyoruz.
          </p>
        </ScrollReveal>

        <div className="treatments-grid">
          {treatments.map((treatment, index) => (
            <ScrollReveal
              as="article"
              className="treatment-card"
              key={treatment.title}
              delay={index * 70}
            >
              <div className="treatment-card-top">
                <TreatmentIcon name={treatment.icon} />
                <span className="treatment-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{treatment.title}</h3>
              <p>{treatment.description}</p>
              <ul>
                {treatment.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="treatments-note" delay={120}>
          <div className="note-icon">✦</div>
          <p>{treatmentsNote}</p>
          <a className="btn-primary" href="#randevu">Tedavi İçin Randevu Al</a>
        </ScrollReveal>
      </div>
    </section>
  );
}
