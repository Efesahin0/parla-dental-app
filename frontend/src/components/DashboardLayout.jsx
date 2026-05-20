import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo-link">
          <Logo light />
        </Link>

        <div className="dash-user">
          <div className="dash-user-avatar">{user?.role === 'ADMIN' ? '🧾' : '🦷'}</div>
          <div>
            <div className="dash-user-name">{user?.name}</div>
            <div className="dash-user-role">{user?.role === 'ADMIN' ? 'Admin / Receptionist' : 'Dentist'}</div>
          </div>
        </div>

        <nav className="dash-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/">Public Site</Link>
        </nav>

        <button className="dash-logout" onClick={handleLogout}>Çıkış Yap</button>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div>
            <p className="section-label">Parla Dental Panel</p>
            <h1>{title}</h1>
          </div>
          <span className="dash-pill">12-Factor Demo</span>
        </header>

        {children}
      </main>
    </div>
  );
}
