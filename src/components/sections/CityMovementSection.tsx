import React from 'react';
import step1Img from '@/assets/images/people_reviewing_tablet.png';
import step2Img from '@/assets/images/truck_driver_smile.png';
import step3Img from '@/assets/images/motorbike_courier.png';
import step4Img from '@/assets/images/smiling_courier.png';

export const CityMovementSection: React.FC = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Order Placement',
      desc: 'Customer places an order and provides delivery details.',
      img: step1Img,
    },
    {
      step: 'Step 2',
      title: 'Product verification',
      desc: 'Driver verifies the product details, condition, and documents before pickup.',
      img: step2Img,
    },
    {
      step: 'Step 3',
      title: 'Tracked Delivery',
      desc: 'System generates a tracking ID and the product is delivered safely and on time.',
      img: step3Img,
    },
    {
      step: 'Step 4',
      title: 'Delivery & Confirmation',
      desc: 'Customer receives the package and confirms via OTP.',
      img: step4Img,
    },
  ];

  return (
    <section className="city-section">
      <div className="container">
        <div className="city-dark-box">
          <h2 className="city-title">
            How we move your order across the cities
          </h2>

          <div className="steps-grid">
            {steps.map((item, idx) => (
              <div key={idx} className="step-card">
                <div className="step-img-container">
                  <img src={item.img} alt={item.title} className="step-img" />
                </div>
                <div className="step-content">
                  <span className="pill-badge-step">{item.step}</span>
                  <h3 className="step-heading">{item.title}</h3>
                  <p className="step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .city-section {
          padding: 4rem 0;
          background-color: var(--color-bg-page);
          transition: background-color 0.3s ease;
        }

        .city-dark-box {
          background-color: var(--city-box-bg);
          border-radius: 28px;
          padding: 3.5rem 3rem;
          color: var(--city-box-text);
          transition: background-color 0.3s ease;
        }

        .city-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 3rem;
          max-width: 380px;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem 2.5rem;
        }

        .step-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .step-img-container {
          width: 100%;
          height: 180px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1.25rem;
        }

        .step-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .step-heading {
          font-size: 1.35rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .step-desc {
          font-size: 0.875rem;
          color: #9CA3AF;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .city-dark-box {
            padding: 2rem 1.5rem;
          }
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .city-title {
            font-size: 1.85rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CityMovementSection;
