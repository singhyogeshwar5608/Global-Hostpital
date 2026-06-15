import { useEffect, useState, createContext, useContext, useCallback } from "react";
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
import PatientPortal from "@/components/healthcare/PatientPortal";
import PatientRegistrationBookingPage from "@/components/healthcare/PatientRegistrationBookingPage";
import { Toaster } from "@/components/ui/toaster";
import { useServicesStore } from "@/store/services-store";
import { useReelsStore } from "@/store/reels-store";
import { useAuthStore } from "@/store/auth-store";
import { usePatientStore } from "@/store/patient-store";

interface PageContextValue {
  showRegistrationPage: boolean;
  setShowRegistrationPage: (show: boolean) => void;
}

const PageContext = createContext<PageContextValue>({
  showRegistrationPage: false,
  setShowRegistrationPage: () => {},
});

export const usePageContext = () => useContext(PageContext);

export default function App() {
  const loadServices = useServicesStore((s) => s.loadServices);
  const loadReels = useReelsStore((s) => s.loadReels);
  const [showRegistrationPage, setShowRegistrationPage] = useState(false);
  const { isAuthenticated, authenticatedRole } = useAuthStore();
  const patientViewingHomepage = usePatientStore((s) => s.patientViewingHomepage);

  useEffect(() => {
    loadServices();
    loadReels();
  }, [loadServices, loadReels]);

  const handleBackToHome = useCallback(() => {
    setShowRegistrationPage(false);
  }, []);

  if (showRegistrationPage) {
    return (
      <main className="min-h-screen flex flex-col">
        <PatientRegistrationBookingPage onBackToHome={handleBackToHome} />
        <Toaster />
      </main>
    );
  }

  const isPatientAccount = isAuthenticated && authenticatedRole === "patient";
  const showPatientDashboard = isPatientAccount && !patientViewingHomepage;

  return (
    <PageContext.Provider value={{ showRegistrationPage, setShowRegistrationPage }}>
      <main className="min-h-screen flex flex-col">
        {!showPatientDashboard && <Header />}
        {showPatientDashboard ? (
          <PatientPortal />
        ) : (
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
        )}
        <Footer />
        <AppointmentModal />
        <MultiRoleLogin />
        {!showPatientDashboard && <AdminPanel />}
        <MedicineShop />
        <PackageShop />
        <LabPanel />
        <DoctorPortalPanel />
        <Toaster />
      </main>
    </PageContext.Provider>
  );
}
