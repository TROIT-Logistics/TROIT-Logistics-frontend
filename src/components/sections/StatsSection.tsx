import React from 'react';

export const StatsSection: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-wrapper">
          <div className="stats-grid">
            {/* Box 1: Yellow */}
            <div className="stat-card stat-yellow">
              <h2 className="stat-value">50M</h2>
              <p className="stat-label">
                Package delivered successfully across 50+ cities
              </p>
            </div>

            {/* Box 2: White/Surface */}
            <div className="stat-card stat-white">
              <h2 className="stat-value">92%</h2>
              <p className="stat-label">
                First-time delivery rate
              </p>
            </div>

            {/* Box 3: Cyan */}
            <div className="stat-card stat-cyan">
              <h2 className="stat-value">50M</h2>
              <p className="stat-label">
                Packages moved with zero customer loss
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stats-section {
          padding: 3rem 0 6rem 0;
          background-color: var(--color-bg-page);
          transition: background-color 0.3s ease;
        }

        .stats-wrapper {
          background-color: var(--color-surface-card);
          border: 1px solid var(--color-border-light);
          border-radius: 24px;
          padding: 1.25rem;
          transition: background-color 0.3s ease;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .stat-card {
          border-radius: 18px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          min-height: 160px;
          transition: background-color 0.3s ease;
        }

        .stat-yellow {
          background-color: #F5B842;
          color: #111827;
        }

        .stat-white {
          background-color: var(--color-surface);
          color: var(--color-text-main);
          border: 1px solid var(--color-border-light);
        }

        .stat-cyan {
          background-color: #00ECC6;
          color: #111827;
        }

        .stat-value {
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 0.75rem;
        }

        .stat-label {
          font-size: 0.85rem;
          font-weight: 500;
          line-height: 1.4;
          opacity: 0.9;
        }

        @media (max-width: 868px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
