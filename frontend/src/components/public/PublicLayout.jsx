import PublicTopbar from './PublicTopbar.jsx';
import PublicNavbar from './PublicNavbar.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicTopbar />
      <PublicNavbar />
      {children}
      <Footer />
    </>
  );
}
