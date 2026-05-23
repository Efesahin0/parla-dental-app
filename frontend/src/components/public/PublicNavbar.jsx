import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';
import { ROUTES } from '../../routes/routePaths.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="language-switch" aria-label="Language selection">
      <button type="button" className={language === 'tr' ? 'active' : ''} onClick={() => setLanguage('tr')}>TR</button>
      <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
    </div>
  );
}

export default function PublicNavbar() {
  const { t } = useLanguage();

  return (
    <header className="navbar">
      <div className="container">
        <Link to={ROUTES.HOME} aria-label="Parla Dental home">
          <Logo />
        </Link>
        <nav>
          <a href="/#home" className="active">{t('navHome')}</a>
          <a href="/#tedaviler">{t('navTreatments')}</a>
          <Link to={ROUTES.DOCTORS}>{t('navDoctors')}</Link>
          <a href="/#hakkimizda">{t('navAbout')}</a>
          <a href="/#konum">{t('navLocation')}</a>
          <a href="/#yorumlar">{t('navReviews')}</a>
          <a href="/#iletisim">{t('navContact')}</a>
          <a href="/#randevu" className="btn-appt">{t('navAppointment')}</a>
          <Link to={ROUTES.LOGIN}>{t('navPanel')}</Link>
          <LanguageSwitch />
        </nav>
      </div>
    </header>
  );
}
