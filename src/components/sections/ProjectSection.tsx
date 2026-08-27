import React from 'react';
import { ShieldCheck, ShoppingCart, Search, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export const ProjectSection: React.FC = () => {
  const stages = [
    {
      step: '01',
      title: 'VERIFY',
      description: 'Products are reviewed and physically verified as trusted inventory.',
      icon: ShieldCheck,
    },
    {
      step: '02',
      title: 'ORDER',
      description: 'Buyer places order with funds held in protected transaction status.',
      icon: ShoppingCart,
    },
    {
      step: '03',
      title: 'INSPECT',
      description: 'Rider physically inspects item condition & packaging at pickup.',
      icon: Search,
    },
    {
      step: '04',
      title: 'DELIVER',
      description: 'Controlled last-mile dispatch to the buyer’s delivery destination.',
      icon: Truck,
    },
    {
      step: '05',
      title: 'CONFIRM',
      description: 'Buyer inspects package and confirms receipt to release payment.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="project" style={{ padding: '90px 0', backgroundColor: 'var(--color-bg-page)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '720px', marginBottom: '56px' }}>
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
            THE PROJECT
          </div>

          <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2 }}>
            Building Trust Into Every Delivery
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            TROIT Logistics is building a trusted commerce and logistics infrastructure where verification, transactions and delivery work together in one connected experience.
          </p>
        </div>

        {/* Lifecycle Connected Process Flow */}
        <div className="project-flow-container">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isLast = idx === stages.length - 1;

            return (
              <React.Fragment key={stage.step}>
                <div className="project-stage-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 900,
                        color: 'var(--color-orange-primary)',
                        backgroundColor: 'rgba(255, 77, 0, 0.12)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid rgba(255, 77, 0, 0.25)',
                      }}
                    >
                      [{stage.step}]
                    </span>
                    <div style={{ color: 'var(--color-text-muted)' }}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    {stage.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {stage.description}
                  </p>
                </div>

                {!isLast && (
                  <div className="stage-arrow-connector">
                    <ArrowRight size={20} style={{ color: 'var(--color-orange-primary)' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Supporting Statement Footer */}
        <div
          style={{
            marginTop: '48px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 32px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
            "From verified inventory to confirmed delivery, TROIT connects the critical steps of a transaction into one trusted workflow."
          </p>
        </div>
      </div>

      <style>{`
        .project-flow-container {
          display: flex;
          align-items: stretch;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 12px;
        }

        .project-stage-card {
          flex: 1 1 200px;
          min-width: 190px;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-lg);
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .project-stage-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-orange-primary);
        }

        .stage-arrow-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 992px) {
          .project-flow-container {
            flex-direction: column;
          }
          .stage-arrow-connector {
            transform: rotate(90deg);
            padding: 8px 0;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectSection;
