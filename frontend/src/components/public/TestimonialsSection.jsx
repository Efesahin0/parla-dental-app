import ScrollReveal from './ScrollReveal.jsx';
import TreatmentIcon from './TreatmentIcon.jsx';
import { treatments } from '../../data/treatments.js';

export default function TreatmentsSection() {
  return (
    <section className="section treatments-section" id="tedaviler">
      <div className="container">
        <ScrollReveal>
          <div className="section-heading centered">
            <span className="section-label">Tedavilerimiz</span>
            <h2>Parla Dental’de sunulan tedavi hizmetleri</h2>
            <p>
              Kliniğimizde tüm tedavi süreçleri; hasta konforu, hijyen,
              estetik beklenti ve uzun dönem ağız sağlığı ön planda tutularak
              planlanmaktadır.
            </p>
          </div>
        </ScrollReveal>

        <div className="treatments-grid">
          {treatments.map((treatment, index) => (
            <ScrollReveal key={treatment.title} delay={index * 80}>
              <article className="treatment-card">
                <TreatmentIcon title={treatment.title} />

                <h3>{treatment.title}</h3>

                <ul>
                  {treatment.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}