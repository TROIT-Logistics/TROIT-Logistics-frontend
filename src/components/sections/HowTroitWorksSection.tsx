import React from 'react';
import { ShieldCheck, PackageCheck, Umbrella, Headphones } from 'lucide-react';

export const HowTroitWorksSection: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={28} />,
      title: 'Safety & Quality',
      subtitle: 'Guarantee',
      highlight: false,
    },
    {
      icon: <PackageCheck size={28} />,
      title: 'Online delivery',
      subtitle: '',
      highlight: true,
    },
    {
      icon: <Umbrella size={28} />,
      title: 'Insurance coverage',
      subtitle: '',
      highlight: false,
    },
    {
      icon: <Headphones size={28} />,
      title: '24/7 Customer support',
      subtitle: '',
      highlight: false,
    },
  ];

  return (
    <section className="troit-works-section">
      <div className="container">
        <h2 className="section-title troit-works-title">
          How Troit works
        </h2>

        <div className="troit-works-grid">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`troit-works-card ${item.highlight ? 'highlight-orange' : ''}`}
            >
              <div className="troit-works-icon">{item.icon}</div>
              <div className="troit-works-card-text">
                <h4 className="card-title-text">{item.title}</h4>
                {item.subtitle && <span className="card-sub-text">{item.subtitle}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .troit-works-section {
          padding: 5rem 0 3rem 0;
          background-color: var(--color-bg-page);
          transition: background-color 0.3s ease;
        }

        .troit-works-title {
          text-align: center;
          margin-bottom: 3.5rem;
          font-size: 2.25rem;
          color: var(--color-text-main);
        }

        .troit-works-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          align-items: stretch;
        }

        .troit-works-card {
          background-color: var(--color-surface-card);
          border: 1px solid var(--color-border-light);
          border-radius: 16px;
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 1.5rem;
          min-height: 190px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, border-color 0.3s ease;
        }

        .troit-works-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        }

        .troit-works-card.highlight-orange {
          background-color: #FF4D00;
          border-color: #FF4D00;
          color: #FFFFFF;
          box-shadow: 0 12px 28px rgba(255, 77, 0, 0.3);
        }

        .troit-works-icon {
          color: var(--color-text-main);
        }

        .highlight-orange .troit-works-icon {
          color: #FFFFFF;
        }

        .troit-works-card-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-title-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1.3;
        }

        .highlight-orange .card-title-text {
          color: #FFFFFF;
        }

        .card-sub-text {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 968px) {
          .troit-works-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 540px) {
          .troit-works-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default HowTroitWorksSection;
