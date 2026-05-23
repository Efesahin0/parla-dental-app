import { useState } from 'react';
import { apiRequest } from '../../api/http.js';
import { treatments } from '../../data/treatments.js';
import { clinicLocation } from '../../data/location.js';
import ScrollReveal from './ScrollReveal.jsx';
import SuccessModal from './SuccessModal.jsx';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  service: '',
  preferredDate: '',
  preferredTime: 'Sabah (09-12)',
  message: ''
};

export default function AppointmentSection() {
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await apiRequest('/appointment-requests', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      setModalOpen(true);
      setForm(initialForm);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="appt-section" id="randevu">
      <div className="container appt-grid">
        <ScrollReveal>
          <div className="section-label">Online Randevu</div>
          <h2>Hemen Randevunuzu Alın</h2>
          <p className="section-desc">Formu doldurun, kliniğimiz en kısa sürede sizinle iletişime geçsin.</p>

          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div><div className="title">Telefon</div><div className="value">{clinicLocation.phone}</div></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div><div className="title">Adres</div><div className="value">{clinicLocation.address}</div></div>
          </div>

          <div className="working-hours">
            <h4>Çalışma Saatleri</h4>
            {clinicLocation.workingHours.map((item) => (
              <div className="hour-row" key={item.day}><span className="day">{item.day}</span><span className="time">{item.time}</span></div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal as="form" className="appt-form" delay={120} onSubmit={submitForm}>
          <h3>Randevu Formu</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Ad Soyad *</label>
              <input name="fullName" value={form.fullName} onChange={updateField} required placeholder="Ad Soyad" />
            </div>
            <div className="form-group">
              <label>Telefon *</label>
              <input name="phone" value={form.phone} onChange={updateField} required placeholder="05xx xxx xx xx" />
            </div>
          </div>

          <div className="form-group">
            <label>E-posta</label>
            <input type="email" name="email" value={form.email} onChange={updateField} placeholder="ornek@email.com" />
          </div>

          <div className="form-group">
            <label>Tedavi Alanı *</label>
            <select name="service" value={form.service} onChange={updateField} required>
              <option value="">Tedavi Alanı Seçin</option>
              {treatments.map((treatment) => <option key={treatment.title} value={treatment.title}>{treatment.title}</option>)}
              <option value="Genel Muayene">Genel Muayene</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tarih</label>
              <input type="date" name="preferredDate" value={form.preferredDate} onChange={updateField} />
            </div>
            <div className="form-group">
              <label>Saat Tercihi</label>
              <select name="preferredTime" value={form.preferredTime} onChange={updateField}>
                <option>Sabah (09-12)</option>
                <option>Öğleden Sonra (12-16)</option>
                <option>Akşam (16-19)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notunuz</label>
            <textarea name="message" value={form.message} onChange={updateField} placeholder="Şikayetinizi veya özel talebinizi belirtebilirsiniz..." />
          </div>

          <button className="btn-primary full" disabled={submitting}>
            {submitting ? 'Gönderiliyor...' : '📅 Randevu Talep Et'}
          </button>
          <p className="privacy-note">Bilgileriniz gizli tutulur. En geç 2 saat içinde dönüş yapılır.</p>
        </ScrollReveal>
      </div>

      <SuccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
