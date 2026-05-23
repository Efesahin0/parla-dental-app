import { Link, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaHome, FaSignOutAlt, FaTooth } from 'react-icons/fa';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardLayout({ title, children, menuItems = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  function handleLogout() {
    logout();
    navigate('/');
  }

  function handleMenuClick(event, targetId) {
    event.preventDefault();

    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo-link">
          <Logo light />
        </Link>

        <div className="dash-user">
          <div className="dash-user-avatar">
            {isAdmin ? <FaClipboardList /> : <FaTooth />}
          </div>

          <div>
            <div className="dash-user-name">
              {user?.name || 'Parla Dental Kullanıcısı'}
            </div>

            <div className="dash-user-role">
              {isAdmin ? 'Yönetici / Resepsiyon' : 'Diş Hekimi'}
            </div>
          </div>
        </div>

        <nav className="dash-nav">
          <div className="dash-nav-title">
            {isAdmin ? 'Yönetim Menüsü' : 'Hekim Menüsü'}
          </div>

          {menuItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => handleMenuClick(event, item.id)}
            >
              {item.label}
            </a>
          ))}

          <Link to="/">
            
            Siteye Dön
          </Link>
        </nav>

        <button className="dash-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          Çıkış Yap
        </button>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div>
            <p className="section-label">Parla Dental Panel</p>
            <h1>{title}</h1>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}