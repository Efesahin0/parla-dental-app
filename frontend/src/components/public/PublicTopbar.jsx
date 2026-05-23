import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function PublicTopbar() {
  const { t } = useLanguage();

  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-left">
          <span className="topbar-item"><span className="line-icon icon-phone" aria-hidden="true" /> <span>0312 456 78 90</span></span>
          <span className="topbar-item"><span className="line-icon icon-mail" aria-hidden="true" /> <span>info@parladental.com</span></span>
          <span className="topbar-item"><span className="line-icon icon-pin" aria-hidden="true" /> <span>Çankaya, Ankara</span></span>
        </div>
        <span className="topbar-item emergency">{t('emergencyLine')}: 0530 123 45 67</span>
      </div>
    </div>
  );
}
