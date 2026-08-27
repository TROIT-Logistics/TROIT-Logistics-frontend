import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import standardImg from '@/assets/images/last_mile_yellow.png';
import expressImg from '@/assets/images/last_mile_van_loading.png';
import contactlessImg from '@/assets/images/people_reviewing_tablet.png';
import scheduledImg from '@/assets/images/people_reviewing_tablet.png';

export const LastMileServicesSection: React.FC = () => {
  return (
    <section className="last-mile-section">
      <div className="container">
        {/* Header */}
        <div className="last-mile-header">
          <div className="pill-badge pill-badge-solid-orange">
            Last mile delivery service
          </div>
          <h2 className="section-title last-mile-title">
            What's our last mile delivery services
          </h2>
        </div>

        {/* Feature 1: Standard Delivery */}
        <div className="service-row">
          <div className="service-content">
            <h3 className="service-heading">Standard Delivery</h3>
            <ul className="service-list">
              <li>Efficient and reliable delivery for items ordering by any device.</li>
              <li>Track your package from dispatch to delivery.</li>
              <li>Direct delivery options to the recipient's address.</li>
            </ul>
            <button className="btn btn-dark service-btn">
              Read more <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="service-image-wrapper">
            <img src={standardImg} alt="Standard Delivery" className="service-img" />
          </div>
        </div>

        {/* Feature 2: Express Delivery */}
        <div className="service-row reverse">
          <div className="service-image-wrapper">
            <img src={expressImg} alt="Express Delivery" className="service-img" />
          </div>
          <div className="service-content">
            <h3 className="service-heading">Express delivery</h3>
            <ul className="service-list">
              <li>Products are delivered with real-time tracking for greater assurance.</li>
              <li>Available for both local and global shipments.</li>
              <li>Packages are given top priority delivery stage entrance.</li>
            </ul>
            <button className="btn btn-dark service-btn">
              Read more <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Feature 3: Contactless Delivery */}
        <div className="service-row">
          <div className="service-content">
            <h3 className="service-heading">Contactless Delivery</h3>
            <ul className="service-list">
              <li>Packages are delivered without physical contact.</li>
              <li>Customers don't need to sign paper to receive their orders.</li>
              <li>Delivery confirmation made via photo on phone.</li>
            </ul>
            <button className="btn btn-dark service-btn">
              Read more <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="service-image-wrapper">
            <img src={contactlessImg} alt="Contactless Delivery" className="service-img" />
          </div>
        </div>

        {/* Feature 4: Scheduled Delivery */}
        <div className="service-row reverse">
          <div className="service-image-wrapper">
            <img src={scheduledImg} alt="Scheduled Delivery" className="service-img" />
          </div>
          <div className="service-content">
            <h3 className="service-heading">Scheduled Delivery</h3>
            <ul className="service-list">
              <li>Choose a delivery time and date that fit your schedule.</li>
              <li>Flexible options if your delivery timing plans change.</li>
              <li>Ensuring your package arrives exactly when required.</li>
            </ul>
            <button className="btn btn-dark service-btn">
              Read more <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .last-mile-section {
          padding: 5rem 0;
          background-color: var(--color-bg-page);
          transition: background-color 0.3s ease;
        }

        .last-mile-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 4rem;
        }

        .last-mile-title {
          margin-top: 1rem;
          max-width: 600px;
          font-size: 2.25rem;
          color: var(--color-text-main);
        }

        .service-row {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 3.5rem;
          align-items: center;
          margin-bottom: 4rem;
        }

        .service-row.reverse {
          grid-template-columns: 1.1fr 1fr;
        }

        .service-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .service-heading {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }

        .service-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .service-list li {
          position: relative;
          padding-left: 1.5rem;
          font-size: 0.925rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .service-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          top: -2px;
          color: var(--color-text-main);
          font-size: 1.4rem;
        }

        .service-btn {
          border-radius: 8px;
          padding: 10px 22px;
        }

        .service-image-wrapper {
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .service-img {
          width: 100%;
          height: 320px;
          object-fit: cover;
        }

        @media (max-width: 868px) {
          .service-row, .service-row.reverse {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .service-row.reverse .service-image-wrapper {
            order: 2;
          }
          .service-row.reverse .service-content {
            order: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default LastMileServicesSection;
