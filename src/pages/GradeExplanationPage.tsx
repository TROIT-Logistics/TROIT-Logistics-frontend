import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Award, ArrowLeft, Info } from 'lucide-react';

export const GradeExplanationPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <Link
          to="/verification"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={18} /> Back to Verification Centre
        </Link>

        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div
            className="pill-badge"
            style={{
              marginBottom: '12px',
              background: 'rgba(255,77,0,0.1)',
              color: 'var(--color-orange-primary)',
              border: '1px solid rgba(255,77,0,0.2)',
            }}
          >
            <Award size={16} /> TROIT SUPPLIER TRUST METRICS
          </div>
          <h1 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '16px' }}>
            Understanding TROIT Seller Grades
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Seller Grades are assigned by TROIT backend trust evaluation based on historical transaction reliability and fulfillment performance.
          </p>
        </div>

        {/* MANDATORY PROMINENT GRADE NOTICE */}
        <div
          style={{
            backgroundColor: 'rgba(255, 107, 0, 0.08)',
            border: '2px solid var(--color-orange-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 40px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Info size={36} style={{ color: 'var(--color-orange-primary)', marginBottom: '12px' }} />
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: 'var(--color-text-main)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            "Grade does not represent product quality. It represents the level of trust the supplier has built with TROIT."
          </h2>
        </div>

        {/* Breakdown Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '960px',
            margin: '0 auto 48px',
          }}
        >
          {/* Grade C */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                fontWeight: 900,
                fontSize: '1.1rem',
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                marginBottom: '16px',
              }}
            >
              GRADE C
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
              Probation & Entry Level Trust
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Assigned to new sellers during onboarding or early marketplace activity. Every product listed by Grade C sellers undergoes full hub field inspection before buyer delivery.
            </p>
          </div>

          {/* Grade B */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                fontWeight: 900,
                fontSize: '1.1rem',
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                marginBottom: '16px',
              }}
            >
              GRADE B
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
              Established Merchant Trust
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Awarded after completing initial successful transactions with high fulfillment accuracy and zero verified buyer complaints.
            </p>
          </div>

          {/* Grade A */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                fontWeight: 900,
                fontSize: '1.1rem',
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                marginBottom: '16px',
              }}
            >
              GRADE A
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
              Top-Tier Verified Merchant
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Highest seller grade assigned to established merchants with extensive successful transaction history and maximum trust standing.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/buyer" className="btn btn-orange" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
            Return to Marketplace
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GradeExplanationPage;
