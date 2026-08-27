import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Col 1: Brand & Bio */}
          <div className="footer-brand-col">
            <h3 className="footer-logo">TROIT logistics</h3>
            <p className="footer-bio">
              Fast, reliable, and trackable delivery service, powered by technology to elevate your business.
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links">
              <li><a href="#services">Freight Forwarding</a></li>
              <li><a href="#services">Warehousing</a></li>
              <li><a href="#services">Last Mile Delivery</a></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Col 4: Cities */}
          <div className="footer-col">
            <h4 className="footer-col-title">Cities</h4>
            <ul className="footer-links">
              <li><a href="#cities">Calabar</a></li>
              <li><a href="#cities">Lagos</a></li>
              <li><a href="#cities">Kano</a></li>
              <li><a href="#cities">Port Harcourt</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Links */}
        <div className="footer-bottom">
          <a href="#privacy" className="footer-legal-link">Privacy Policy</a>
          <a href="#terms" className="footer-legal-link">Terms of Service</a>
        </div>
      </div>

      <style>{`
        .footer-container {
          background-color: #0A0D14;
          color: #FFFFFF;
          padding: 5rem 0 3rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 4rem;
          padding-bottom: 4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #FFFFFF;
          margin-bottom: 1.25rem;
        }

        .footer-bio {
          font-size: 0.875rem;
          color: #9CA3AF;
          line-height: 1.6;
          max-width: 320px;
        }

        .footer-col-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1.5rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .footer-links a {
          font-size: 0.875rem;
          color: #9CA3AF;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: #FFFFFF;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          padding-top: 2.5rem;
        }

        .footer-legal-link {
          font-size: 0.825rem;
          color: #9CA3AF;
          transition: color 0.2s ease;
        }

        .footer-legal-link:hover {
          color: #FFFFFF;
        }

        @media (max-width: 868px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
