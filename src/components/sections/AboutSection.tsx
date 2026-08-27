import React from 'react';
import { CheckCircle, Eye, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const principles = [
    {
      title: 'VERIFICATION',
      quote: "Know what you're buying.",
      icon: CheckCircle,
    },
    {
      title: 'CONTROL',
      quote: 'Know where your order is in the process.',
      icon: Eye,
    },
    {
      title: 'CONFIDENCE',
      quote: 'Know when your transaction is complete.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="about" style={{ padding: '90px 0', backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Left Column */}
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
              ABOUT TROIT
            </div>

            <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2 }}>
              A More Trusted Way to Move Products
            </h2>
          </div>

          {/* Right Column: Overview & Principles */}
          <div>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
              TROIT Logistics is focused on making buying and selling more trustworthy by combining verified products with controlled logistics and transparent order fulfillment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {principles.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    style={{
                      backgroundColor: 'var(--color-surface-card)',
                      border: '1px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-orange-primary)' }}>
                      <Icon size={20} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.05em' }}>{p.title}</span>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      "{p.quote}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
