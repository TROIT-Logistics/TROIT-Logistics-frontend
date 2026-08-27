import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerVerification } from '@/context/SellerVerificationContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Clock, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const SellerVerificationStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const { status, verificationData, setVerificationStatus } = useSellerVerification();

  const handleSimulateApprove = () => {
    setVerificationStatus('VERIFIED');
  };

  const handleSimulatePending = () => {
    setVerificationStatus('UNDER_REVIEW');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {/* Main Status Card */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '24px',
            }}
          >
            {status === 'VERIFIED' ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  marginBottom: '20px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(245, 184, 66, 0.15)',
                  color: '#D97706',
                  marginBottom: '20px',
                }}
              >
                <Clock size={36} />
              </div>
            )}

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              {status === 'VERIFIED' ? 'Seller Account Verified!' : 'Verification Submitted'}
            </h1>

            {/* Status Badge */}
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 184, 66, 0.15)',
                  color: status === 'VERIFIED' ? '#10B981' : '#D97706',
                  border: `1px solid ${status === 'VERIFIED' ? '#10B981' : '#F5B842'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {status === 'VERIFIED' ? <ShieldCheck size={16} /> : <Clock size={16} />} VERIFICATION STATUS: {status.replace('_', ' ')}
              </span>
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
              {status === 'VERIFIED'
                ? 'Your seller account has been approved by TROIT. You now have full access to list verified inventory.'
                : 'Your seller verification information has been submitted and is being reviewed. You will be able to start listing products once your account is approved.'}
            </p>

            {/* Submitted Info Preview */}
            {verificationData && (
              <div
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'left',
                  marginBottom: '28px',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '10px' }}>
                  Submitted Verification Details:
                </div>
                <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <strong>Store Name:</strong> {verificationData.business_name}
                </div>
                <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <strong>Address:</strong> {verificationData.business_address}
                </div>
                <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <strong>ID Document:</strong> {verificationData.id_type} ({verificationData.id_number})
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>
                  <strong>Physical Inspection Consent:</strong> {verificationData.physical_verification_consent ? 'Confirmed' : 'Pending'}
                </div>
              </div>
            )}

            {status === 'VERIFIED' ? (
              <button onClick={() => navigate('/seller')} className="btn btn-orange" style={{ width: '100%', justifyContent: 'center' }}>
                Go to Seller Dashboard <ArrowRight size={18} />
              </button>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(245, 184, 66, 0.1)',
                  border: '1px solid var(--color-yellow-accent)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-main)',
                }}
              >
                <AlertCircle size={20} style={{ color: '#D97706', margin: '0 auto 8px', display: 'block' }} />
                Product listing is restricted while your verification application is under review.
              </div>
            )}
          </div>

          {/* Demo Controls Box for Presentation */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-card)',
              border: '1px dashed var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-orange-primary)', marginBottom: '12px' }}>
              <Sparkles size={16} /> DEMO PRESENTATION ADMIN CONTROLS
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Use these buttons during presentation to simulate admin review approval:
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleSimulateApprove} className="btn btn-orange" style={{ fontSize: '0.8rem' }}>
                Simulate Admin Verification Approval (VERIFIED)
              </button>
              <button onClick={handleSimulatePending} className="btn btn-dark" style={{ fontSize: '0.8rem' }}>
                Reset Status to UNDER_REVIEW
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerVerificationStatusPage;
