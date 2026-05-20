import parlaLogo from '../assets/brand/parla-logo-transparent.png';

export default function Logo({ light = false }) {
  return (
    <div className="logo">
      <img
        className={light ? 'logo-img footer-logo-img' : 'logo-img'}
        src={parlaLogo}
        alt="Parla Dental Ağız ve Diş Sağlığı Polikliniği"
      />
    </div>
  );
}
