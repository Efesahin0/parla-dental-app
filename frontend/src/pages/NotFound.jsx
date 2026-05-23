import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="screen-center">
      <h1>Sayfa bulunamadı</h1>
      <Link className="btn-primary" to="/">Anasayfaya dön</Link>
    </main>
  );
}
