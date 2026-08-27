import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectSection from '@/components/sections/ProjectSection';
import AboutSection from '@/components/sections/AboutSection';
import DeliveringEfficiencySection from '@/components/sections/DeliveringEfficiencySection';
import LastMileServicesSection from '@/components/sections/LastMileServicesSection';
import CityMovementSection from '@/components/sections/CityMovementSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectSection />
        <AboutSection />
        <DeliveringEfficiencySection />
        <LastMileServicesSection />
        <CityMovementSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
