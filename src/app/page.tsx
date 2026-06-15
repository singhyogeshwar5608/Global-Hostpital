import Header from "@/components/healthcare/Header";
import Hero from "@/components/healthcare/Hero";
import StatsBar from "@/components/healthcare/StatsBar";
import DoctorsSection from "@/components/healthcare/DoctorsSection";
import Services from "@/components/healthcare/Services";
import HealthcareServicesMarquee from "@/components/healthcare/HealthcareServicesMarquee";
import AppointmentCTA from "@/components/healthcare/AppointmentCTA";
import FeatureCards from "@/components/healthcare/FeatureCards";
import CombinedSection from "@/components/healthcare/CombinedSection";
import VideoReelsSection from "@/components/healthcare/VideoReelsSection";
import Blog from "@/components/healthcare/Blog";
import MobileApp from "@/components/healthcare/MobileApp";
import Partners from "@/components/healthcare/Partners";
import Footer from "@/components/healthcare/Footer";
import AppointmentModal from "@/components/healthcare/AppointmentModal";
import AdminPanel from "@/components/healthcare/AdminPanel";
import MedicineShop from "@/components/healthcare/MedicineShop";
import PackageShop from "@/components/healthcare/PackageShop";
import LabPanel from "@/components/healthcare/LabPanel";
import DoctorPortalPanel from "@/components/healthcare/DoctorPortalPanel";
import MultiRoleLogin from "@/components/healthcare/MultiRoleLogin";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <StatsBar />
        <DoctorsSection />
        <Services />
        <VideoReelsSection />
        <HealthcareServicesMarquee />
        <AppointmentCTA />
        <FeatureCards />
        <CombinedSection />
        <Blog />
        <MobileApp />
        <Partners />
      </div>
      <Footer />
      <AppointmentModal />
      <MultiRoleLogin />
      <AdminPanel />
      <MedicineShop />
      <PackageShop />
      <LabPanel />
      <DoctorPortalPanel />
    </main>
  );
}
