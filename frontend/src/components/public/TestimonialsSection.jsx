import { testimonials } from '../../data/testimonials.js';
import ScrollReveal from './ScrollReveal.jsx';

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="container">
        <ScrollReveal>
          <div className="section-label">Hasta Yorumları</div>
          <h2>Hastalarımız Anlatıyor</h2>
          <p className="section-desc">8.500'den fazla mutlu hastamızın deneyimlerine göz atın.</p>
        </ScrollReveal>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <ScrollReveal as="article" className="testimonial-card" key={item.name} delay={index * 100}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&quot;{item.text}&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">😊</div>
                <div><div className="author-name">{item.name}</div><div className="author-date">{item.date}</div></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
