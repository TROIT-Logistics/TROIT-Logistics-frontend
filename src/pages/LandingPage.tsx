import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import DeliveringEfficiencySection from '@/components/sections/DeliveringEfficiencySection';
import LastMileServicesSection from '@/components/sections/LastMileServicesSection';
import CityMovementSection from '@/components/sections/CityMovementSection';
import HowTroitWorksSection from '@/components/sections/HowTroitWorksSection';
import StatsSection from '@/components/sections/StatsSection';
import Footer from '@/components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <HeroSection />
        <DeliveringEfficiencySection />
        <LastMileServicesSection />
        <CityMovementSection />
        <HowTroitWorksSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
