import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" style={{ padding: '90px 0', backgroundColor: 'var(--color-bg-page)' }}>
      <div className="container">
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '2px solid var(--color-orange-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '56px 36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 77, 0, 0.06)',
              pointerEvents: 'none',
            }}
          />

          <h2
            className="section-title"
            style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', maxWidth: '640px', margin: '0 auto 16px', lineHeight: 1.25 }}
          >
            Let's build a more trusted way to move products.
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              marginBottom: '36px',
              maxWidth: '560px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Whether you're a buyer, seller, logistics partner or potential collaborator, we'd like to hear from you.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-orange" style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: 800 }}>
              Get Started <ArrowRight size={18} />
            </Link>

            <Link to="/buyer" className="btn btn-dark" style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: 700 }}>
              <ShoppingBag size={18} /> Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
