import Header from "@/components/healthcare/Header";
import Hero from "@/components/healthcare/Hero";
import Services from "@/components/healthcare/Services";
import Statistics from "@/components/healthcare/Statistics";
import FeatureCards from "@/components/healthcare/FeatureCards";
import WhyChooseUs from "@/components/healthcare/WhyChooseUs";
import Testimonials from "@/components/healthcare/Testimonials";
import EmergencySupport from "@/components/healthcare/EmergencySupport";
import Blog from "@/components/healthcare/Blog";
import MobileApp from "@/components/healthcare/MobileApp";
import Partners from "@/components/healthcare/Partners";
import Footer from "@/components/healthcare/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <Services />
        <Statistics />
        <FeatureCards />
        <WhyChooseUs />
        <Testimonials />
        <EmergencySupport />
        <Blog />
        <MobileApp />
        <Partners />
      </div>
      <Footer />
    </main>
  );
}
