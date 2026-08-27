import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerVerification } from '@/context/SellerVerificationContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, CheckCircle2, UserCheck, Store, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

export const SellerVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitVerification } = useSellerVerification();

  const [currentStep, setCurrentStep] = useState<number>(2); // Step 1 Account is completed

  // Form State
  const [idType, setIdType] = useState('NIN National Identity Number');
  const [idNumber, setIdNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [productCategory, setProductCategory] = useState('Smartphones & Consumer Electronics');
  const [physicalConsent, setPhysicalConsent] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setError(null);
    if (currentStep === 2) {
      if (!idNumber.trim()) {
        setError('Please enter your government ID or document number.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!businessName.trim() || !businessAddress.trim()) {
        setError('Please enter your store/business name and Port Harcourt address.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrev = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(2, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!physicalConsent) {
      setError('Please acknowledge physical verification to submit your seller application.');
      return;
    }

    submitVerification({
      id_type: idType,
      id_number: idNumber.trim() || 'NIN-1092837192',
      business_name: businessName.trim() || 'Port Harcourt Tech & Logistics Store',
      business_address: businessAddress.trim() || 'GRA Phase 2, Port Harcourt',
      product_category: productCategory,
      physical_verification_consent: physicalConsent,
    });

    navigate('/seller');
  };

  const stepsList = [
    { num: 1, label: 'Account', done: true },
    { num: 2, label: 'Identity', done: currentStep > 2 },
    { num: 3, label: 'Business', done: currentStep > 3 },
    { num: 4, label: 'Physical Inspection', done: currentStep > 4 },
    { num: 5, label: 'Review & Submit', done: false },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            className="pill-badge"
            style={{ marginBottom: '12px', background: 'rgba(255,77,0,0.1)', color: 'var(--color-orange-primary)', border: '1px solid rgba(255,77,0,0.2)' }}
          >
            <ShieldCheck size={16} /> SELLER ONBOARDING VERIFICATION
          </div>
          <h1 className="section-title">Verify Your Seller Account</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', maxWidth: '580px', margin: '8px auto 0' }}>
            Complete your verification details to start listing trusted inventory on TROIT.
          </p>
        </div>

        {/* Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Progress Sidebar & Trust Box */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                Verification Stages
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stepsList.map((st) => {
                  const isCurrent = currentStep === st.num;
                  return (
                    <div
                      key={st.num}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isCurrent ? 'rgba(255, 77, 0, 0.1)' : 'transparent',
                        border: isCurrent ? '1px solid var(--color-orange-primary)' : '1px solid transparent',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: st.done
                            ? '#10B981'
                            : isCurrent
                            ? 'var(--color-orange-primary)'
                            : 'var(--color-text-light)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                        }}
                      >
                        {st.done ? <CheckCircle2 size={16} /> : st.num}
                      </div>

                      <div style={{ fontSize: '0.9rem', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                        {st.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Messaging Box */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-orange-primary)', marginBottom: '8px' }}>
                Trust starts with knowing who you're dealing with.
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Seller verification helps TROIT create a safer marketplace for buyers and sellers across Port Harcourt.
              </p>
            </div>
          </div>

          {/* Right Column: Multi-Step Form Container */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Step 2: Identity Verification */}
            {currentStep === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <UserCheck size={24} style={{ color: 'var(--color-orange-primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 2: Identity Verification</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Provide government-issued identity details to verify seller ownership
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Government ID Document Type
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="NIN National Identity Number">NIN National Identity Number</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="International Passport">International Passport</option>
                    <option value="INEC Permanent Voter's Card">INEC Permanent Voter's Card</option>
                  </select>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Identity / Document Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIN-8923019201"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={handleNext} className="btn btn-orange">
                    Next: Business Info <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Business Information */}
            {currentStep === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Store size={24} style={{ color: 'var(--color-orange-primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 3: Business & Inventory Info</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Tell us about your store location and primary inventory categories
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Business / Store Trade Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Port Harcourt Mobile Hub Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Port Harcourt Store / Inventory Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop 12, Aba Road Plaza, Garrison, Port Harcourt"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Primary Product Category
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="Smartphones & Consumer Electronics">Smartphones & Consumer Electronics</option>
                    <option value="Laptops & Computing">Laptops & Computing</option>
                    <option value="Mobile Accessories & Audio">Mobile Accessories & Audio</option>
                    <option value="General Consumer Goods">General Consumer Goods</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={handlePrev} className="btn btn-dark">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="button" onClick={handleNext} className="btn btn-orange">
                    Next: Physical Verification <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Physical Verification */}
            {currentStep === 4 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <MapPin size={24} style={{ color: 'var(--color-orange-primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 4: Physical Verification Notice</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Physical location inspection requirement prior to seller approval
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 77, 0, 0.08)',
                    border: '1px solid rgba(255, 77, 0, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-orange-primary)', marginBottom: '8px' }}>
                    Physical Location Inspection
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    A TROIT representative may verify your business or inventory location before your seller account is approved.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={physicalConsent}
                      onChange={(e) => setPhysicalConsent(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                      I confirm that my store or inventory location in Port Harcourt is available for physical verification by a TROIT field agent.
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={handlePrev} className="btn btn-dark">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="button" onClick={handleNext} className="btn btn-orange">
                    Next: Review Application <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <ShieldCheck size={24} style={{ color: 'var(--color-orange-primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 5: Review & Submit Verification</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Review your submitted information before final review
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Government ID Type:</span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{idType} ({idNumber})</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Business Name:</span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{businessName}</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Store Address:</span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{businessAddress}</div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Inventory Category:</span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{productCategory}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={handlePrev} className="btn btn-dark">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" className="btn btn-orange" style={{ padding: '12px 28px' }}>
                    Submit Verification Info <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerVerificationPage;
