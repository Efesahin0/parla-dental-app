import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@parladental.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dentist');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link to="/" className="login-logo"><Logo /></Link>
        <p className="section-label">Yetkili Paneli</p>
        <h1>Parla Dental Panel Girişi</h1>
        <p className="login-desc">Admin / Receptionist ve Dentist rolleri için giriş ekranı.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-posta</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </div>

          {error && <div className="alert error">{error}</div>}

          <button className="btn-primary full" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

      </section>
    </main>
  );
}
