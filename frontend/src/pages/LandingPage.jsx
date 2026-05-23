import PublicLayout from '../components/public/PublicLayout.jsx';
import HeroSection from '../components/public/HeroSection.jsx';
import TreatmentsSection from '../components/public/TreatmentsSection.jsx';
import AboutSection from '../components/public/AboutSection.jsx';
import DoctorsPreviewSection from '../components/public/DoctorsPreviewSection.jsx';
import AppointmentSection from '../components/public/AppointmentSection.jsx';
import LocationSection from '../components/public/LocationSection.jsx';
import GoogleReviewsSection from '../components/public/GoogleReviewsSection.jsx';

export default function LandingPage() {
  return (
    <PublicLayout>
      <HeroSection />
      <TreatmentsSection />
      <AboutSection />
      <DoctorsPreviewSection />
      <AppointmentSection />
      <LocationSection />
      <GoogleReviewsSection />
    </PublicLayout>
  );
}
