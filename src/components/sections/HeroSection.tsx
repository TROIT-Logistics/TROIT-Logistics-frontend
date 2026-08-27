import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import heroBg from '@/assets/images/hero_warehouse.png';

export const HeroSection: React.FC = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-wrapper">
        <img src={heroBg} alt="TROIT Logistics Warehouse" className="hero-bg-img" />
        <div className="hero-overlay" />
      </div>

      <div className="container hero-content-container">
        <div className="hero-card">
          <h1 className="hero-title">
            The trusted way to shop online
          </h1>
          <p className="hero-subtitle">
            Fast, reliable, and trackable delivery, tailored to all of your search locations.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-orange hero-btn">
              Get started <ArrowUpRight size={18} />
            </Link>
            <a href="#contact" className="btn btn-yellow hero-btn">
              Get quote <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 120px;
          padding-bottom: 80px;
          overflow: hidden;
        }

        .hero-bg-wrapper {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.15) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.25) 100%
          );
        }

        .hero-content-container {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .hero-card {
          max-width: 480px;
          background: rgba(10, 15, 25, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 2.5rem;
          color: #FFFFFF;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .hero-title {
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
          color: #FFFFFF;
        }

        .hero-subtitle {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.88);
          margin-bottom: 2rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 12px 26px;
          border-radius: 9999px;
          font-weight: 600;
        }

        @media (min-width: 1024px) {
          .hero-section {
            min-height: 100vh;
            padding-top: 140px;
            padding-bottom: 100px;
          }
        }

        @media (max-width: 640px) {
          .hero-section {
            min-height: 90vh;
            padding-top: 100px;
            padding-bottom: 60px;
          }
          .hero-card {
            padding: 1.75rem;
          }
          .hero-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
