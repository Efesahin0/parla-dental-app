import { FaClinicMedical, FaRegSmile, FaShieldAlt, FaUserMd } from 'react-icons/fa';
import ScrollReveal from './ScrollReveal.jsx';

export default function AboutSection() {
  return (
    <section className="section about-section" id="hakkimizda">
      <div className="container about-grid">
        <ScrollReveal>
          <div className="about-content">
            <span className="section-label">Hakkımızda</span>

            <h2>
              Parla Dental’de modern, güvenilir ve hasta odaklı diş hekimliği yaklaşımı
            </h2>

            <p>
              Parla Dental, ağız ve diş sağlığı hizmetlerini modern klinik anlayışıyla
              sunmak amacıyla kurulmuş yeni nesil bir diş kliniğidir. Kliniğimizde
              tedavi süreçleri; hastanın beklentileri, ağız sağlığı ihtiyaçları ve
              uzun dönem başarı hedefi birlikte değerlendirilerek planlanır.
            </p>

            <p>
              Estetik diş hekimliği, implant tedavileri, protetik uygulamalar,
              koruyucu ve restoratif tedaviler gibi farklı alanlarda; hijyen,
              hasta konforu ve güncel tedavi yaklaşımları ön planda tutulur.
              Amacımız, hastalarımıza güven veren, açıklayıcı ve konforlu bir
              klinik deneyimi sunmaktır.
            </p>

            <div className="about-highlights">
              <div className="about-highlight">
                <FaUserMd />
                <div>
                  <strong>Uzman yaklaşım</strong>
                  <span>Kişiye özel muayene ve tedavi planlaması</span>
                </div>
              </div>

              <div className="about-highlight">
                <FaShieldAlt />
                <div>
                  <strong>Hijyen ve güven</strong>
                  <span>Klinik süreçlerde sterilizasyon ve hasta güvenliği</span>
                </div>
              </div>

              <div className="about-highlight">
                <FaRegSmile />
                <div>
                  <strong>Doğal estetik</strong>
                  <span>Fonksiyon ve estetiği birlikte değerlendiren çözümler</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="about-card">
            <div className="about-card-icon">
              <FaClinicMedical />
            </div>

            <h3>Yeni nesil klinik deneyimi</h3>

            <p>
              Parla Dental’de randevu, hasta kayıtları ve tedavi geçmişleri
              düzenli bir sistem üzerinden takip edilir. Bu sayede hem klinik
              işleyişi daha planlı hale gelir hem de hastaların tedavi süreçleri
              daha kontrollü şekilde yönetilir.
            </p>

            <div className="about-values">
              <div>
                <strong>Hasta odaklı</strong>
                <span>Her hasta için anlaşılır ve şeffaf süreç</span>
              </div>

              <div>
                <strong>Modern yaklaşım</strong>
                <span>Güncel tedavi yöntemlerine uyumlu klinik anlayışı</span>
              </div>

              <div>
                <strong>Düzenli takip</strong>
                <span>Randevu ve tedavi geçmişinin merkezi yönetimi</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}