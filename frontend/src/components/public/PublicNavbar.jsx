import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';
import { ROUTES } from '../../routes/routePaths.js';

export default function PublicNavbar() {
  return (
    <header className="navbar">
      <div className="container">
        <Link to={ROUTES.HOME} aria-label="Parla Dental anasayfa">
          <Logo />
        </Link>
        <nav>
          <a href="/#home" className="active">Anasayfa</a>
          <a href="/#tedaviler">Tedavilerimiz</a>
          <Link to={ROUTES.DOCTORS}>Hekimlerimiz</Link>
          <a href="/#hakkimizda">Hakkımızda</a>
          <a href="/#konum">Konum</a>
          <a href="/#yorumlar">Yorumlar</a>
          <a href="/#iletisim">İletişim</a>
          <a href="/#randevu" className="btn-appt">Randevu Al</a>
          <Link to={ROUTES.LOGIN}>Panel Girişi</Link>
        </nav>
      </div>
    </header>
  );
}
