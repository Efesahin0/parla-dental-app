import ScrollReveal from '../public/ScrollReveal.jsx';

export default function DoctorCard({ doctor, delay = 0 }) {
  return (
    <ScrollReveal as="article" className="doctor-card enhanced-doctor-card" delay={delay}>
      <div className="doctor-photo-wrap">
        <img src={doctor.image} alt={doctor.name} className="doctor-photo" />
        <div className="doctor-exp-badge">{doctor.experience}</div>
      </div>
      <div className="doctor-info">
        <div className="name">{doctor.name}</div>
        <div className="spec">{doctor.specialty}</div>
        <div className="desc">{doctor.description}</div>
        <div className="doctor-tags">
          {doctor.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
    </ScrollReveal>
  );
}
