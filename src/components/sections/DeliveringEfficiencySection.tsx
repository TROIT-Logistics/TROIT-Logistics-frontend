import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import driverVan from '@/assets/images/delivery_driver_van.png';
import vanLoading from '@/assets/images/last_mile_van_loading.png';
import workersTeam from '@/assets/images/last_mile_yellow.png';

export const DeliveringEfficiencySection: React.FC = () => {
  return (
    <section className="delivering-section">
      <div className="container delivering-container">
        {/* Left Text Content */}
        <div className="delivering-content">
          <div className="pill-badge pill-badge-solid-orange">
            Delivering service
          </div>

          <h2 className="section-title delivering-heading">
            Delivering your goods efficiently, no matter the distance
          </h2>

          <p className="delivering-desc">
            All of our delivery options are fully customizable for your business needs — with dedicated fleets, door-to-door tracking, and priority customer care across all cities.
          </p>

          <button className="btn btn-dark delivering-btn">
            Read more <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Right Image Collage */}
        <div className="delivering-collage">
          <div className="collage-left">
            <img src={driverVan} alt="Delivery driver with clipboard" className="collage-img tall-img" />
          </div>
          <div className="collage-right">
            <img src={vanLoading} alt="Courier loading van" className="collage-img stacked-img" />
            <img src={workersTeam} alt="Logistics delivery team" className="collage-img stacked-img" />
          </div>
        </div>
      </div>

      <style>{`
        .delivering-section {
          padding: 6rem 0;
          background-color: var(--color-bg-page);
          transition: background-color 0.3s ease;
        }

        .delivering-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .delivering-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .delivering-heading {
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
          font-size: 2.5rem;
          line-height: 1.2;
          color: var(--color-text-main);
        }

        .delivering-desc {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 480px;
        }

        .delivering-btn {
          border-radius: 8px;
          padding: 12px 24px;
        }

        .delivering-collage {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 1rem;
          height: 440px;
        }

        .collage-left, .collage-right {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
        }

        .collage-img {
          width: 100%;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .tall-img {
          height: 100%;
        }

        .stacked-img {
          height: calc(50% - 0.5rem);
        }

        @media (max-width: 968px) {
          .delivering-container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .delivering-collage {
            height: 380px;
          }
        }
      `}</style>
    </section>
  );
};

export default DeliveringEfficiencySection;
