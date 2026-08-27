import React from 'react';
import { ShieldCheck, Lock, Truck, SearchCheck } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" style={{ padding: '90px 0', backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
          {/* Left Column: Heading & Description */}
          <div>
            <div
              className="pill-badge"
              style={{
                marginBottom: '16px',
                background: 'rgba(255, 77, 0, 0.1)',
                color: 'var(--color-orange-primary)',
                border: '1px solid rgba(255, 77, 0, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
              }}
            >
              SERVICES
            </div>

            <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2 }}>
              Trusted Commerce & Logistics
            </h2>

            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: '480px' }}>
              TROIT connects buyers and sellers with verified products and a controlled delivery process designed to make every transaction safer and more transparent.
            </p>
          </div>

          {/* Right Column / Bottom: 2x2 Grid of Service Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {/* Card 1: Product Verification */}
            <div className="service-card">
              <div className="service-icon-box">
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Product Verification</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Products are reviewed and verified before being presented as trusted inventory.
              </p>
            </div>

            {/* Card 2: Secure Transactions */}
            <div className="service-card">
              <div className="service-icon-box">
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Secure Transactions</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Orders move through a protected transaction process, giving buyers and sellers greater confidence.
              </p>
            </div>

            {/* Card 3: Controlled Logistics */}
            <div className="service-card">
              <div className="service-icon-box">
                <Truck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Controlled Logistics</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                TROIT manages the movement of products from pickup to delivery.
              </p>
            </div>

            {/* Card 4: Pickup Inspection */}
            <div className="service-card">
              <div className="service-icon-box">
                <SearchCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Pickup Inspection</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Products can be inspected at pickup before they enter the delivery process.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .service-card {
          background-color: var(--color-surface-card);
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .service-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 77, 0, 0.4);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
        }

        .service-icon-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background-color: rgba(255, 77, 0, 0.1);
          color: var(--color-orange-primary);
          margin-bottom: 20px;
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;
