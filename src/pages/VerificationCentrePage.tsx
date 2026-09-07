import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  UserCheck,
  Store,
  SearchCheck,
  Clock,
  History,
  Award,
  ArrowRight,
} from 'lucide-react';

export const VerificationCentrePage: React.FC = () => {
  const STAGES = [
    {
      step: 1,
      title: '1. KYC & Identity Verification',
      icon: UserCheck,
      summary: 'We verify the identity of sellers entering the TROIT marketplace.',
      description:
        'Sellers register and submit government identity documentation to ensure accountability and prevent fraud across our regional logistics hubs.',
    },
    {
      step: 2,
      title: '2. Store & Business Verification',
      icon: Store,
      summary: 'We verify the seller and their operating information.',
      description:
        'Physical store location, business registration, and contact details are vetted by local hub managers before listing approval.',
    },
    {
      step: 3,
      title: '3. Physical Product Inspection',
      icon: SearchCheck,
      summary: 'Products can be inspected before entering verified inventory.',
      description:
        'Authorized field agents conduct hands-on hardware testing, authenticity verification, and serial number logging prior to dispatch.',
    },
    {
      step: 4,
      title: '4. Seller Probation Period',
      icon: Clock,
      summary: 'New suppliers build trust through their early activity on TROIT.',
      description:
        'Initial listings undergo mandatory hub inspections and restricted transaction limits while building early marketplace reliability.',
    },
    {
      step: 5,
      title: '5. Transaction History Track Record',
      icon: History,
      summary: 'Successful transactions help establish a supplier’s track record.',
      description:
        'Every completed order with zero disputes contributes directly to seller fulfillment scores and trust progression.',
    },
    {
      step: 6,
      title: '6. Trust Level & Grade Advancement',
      icon: Award,
      summary: 'A supplier’s trust level reflects the history they have built with TROIT.',
      description:
        'Sellers advance from LV1 to LV5 and progress through Grades C, B, and A based on automated backend trust metrics.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div
            className="pill-badge"
            style={{
              marginBottom: '12px',
              background: 'rgba(255,77,0,0.1)',
              color: 'var(--color-orange-primary)',
              border: '1px solid rgba(255,77,0,0.2)',
            }}
          >
            <ShieldCheck size={16} /> TROIT TRUST ENGINE ARCHITECTURE
          </div>
          <h1 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '12px' }}>
            The TROIT Verification & Trust Centre
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Learn how TROIT guarantees marketplace authenticity and buyer escrow protection through our 6-stage verification framework.
          </p>
        </div>

        {/* 6 Stages Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {STAGES.map((stage) => {
            const Icon = stage.icon;

            return (
              <div
                key={stage.step}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 107, 0, 0.12)',
                      color: 'var(--color-orange-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
                    {stage.title}
                  </h3>

                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--color-orange-primary)',
                      marginBottom: '12px',
                      lineHeight: 1.4,
                    }}
                  >
                    "{stage.summary}"
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Action Box */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          <Award size={36} style={{ color: 'var(--color-orange-primary)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
            Want to understand Seller Grades?
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            Discover how Seller Grades C, B, and A represent supplier trust built with TROIT rather than physical product condition.
          </p>
          <Link to="/grade-explanation" className="btn btn-orange" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
            Learn About Seller Grades <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerificationCentrePage;
