import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSellerProfileById, fetchTrustHistoryById } from '@/lib/api/seller';
import { SellerProfile, TrustHistory } from '@/lib/api/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Store,
  ShieldCheck,
  MapPin,
  Info,
  ArrowLeft,
  Calendar,
  History,
  TrendingUp,
} from 'lucide-react';

export const SellerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [trustHistory, setTrustHistory] = useState<TrustHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    Promise.all([
      fetchSellerProfileById(id),
      fetchTrustHistoryById(id).catch(() => []),
    ])
      .then(([profData, histData]) => {
        setProfile(profData);
        setTrustHistory(histData);
      })
      .catch((err) => setError((err as Error).message || 'Seller profile not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <Link
          to="/buyer"
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
          <ArrowLeft size={18} /> Back to Marketplace
        </Link>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading seller trust profile & transaction history...
          </div>
        ) : error || !profile ? (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            {error || 'Seller profile not found'}
          </div>
        ) : (
          <div>
            {/* Header Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Store size={28} style={{ color: 'var(--color-orange-primary)' }} />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                      {profile.store_name || `Seller ${profile.user_id.slice(0, 8)}`}
                    </h1>
                  </div>

                  {profile.store_address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                      <MapPin size={16} /> {profile.store_address}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: profile.verification_status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: profile.verification_status === 'VERIFIED' ? '#10B981' : '#F59E0B',
                        border: `1px solid ${profile.verification_status === 'VERIFIED' ? '#10B981' : '#F59E0B'}`,
                        borderRadius: 'var(--radius-pill)',
                        padding: '4px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      <ShieldCheck size={16} /> {profile.verification_status} SELLER
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Grade Badge Banner */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 107, 0, 0.08)',
                    border: '1px solid rgba(255, 107, 0, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 24px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>TROIT Supplier Grade</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10B981' }}>{profile.seller_grade}</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginTop: '28px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Trust Level</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-orange-primary)' }}>
                    {profile.trust_level}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Successful Transactions</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{profile.successful_transactions}</div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Fulfillment Rate</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{profile.fulfillment_rate}%</div>
                </div>
              </div>

              {/* Mandatory Grade Notice */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-surface-card)',
                  borderRadius: '6px',
                  border: '1px dashed var(--color-border-light)',
                  fontSize: '0.825rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Info size={16} style={{ color: 'var(--color-orange-primary)' }} />
                <span>
                  <strong>Notice:</strong> Seller Grade represents the level of trust the supplier has built with TROIT. It does not represent product physical quality.
                </span>
              </div>
            </div>

            {/* Trust History Section */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <History size={24} style={{ color: 'var(--color-orange-primary)' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Seller Trust Progression History</h2>
              </div>

              {trustHistory.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: 'var(--color-surface-card)',
                    borderRadius: '8px',
                    border: '1px dashed var(--color-border-light)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <TrendingUp size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>No trust level updates recorded yet.</p>
                  <p style={{ fontSize: '0.85rem' }}>
                    Seller is currently operating at initial trust tier {profile.trust_level}.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {trustHistory.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: 'var(--color-surface-card)',
                        border: '1px solid var(--color-border-light)',
                        borderRadius: '8px',
                        padding: '16px 20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-text-muted)' }}>{item.old_level}</span>
                          <span style={{ fontWeight: 800, color: 'var(--color-orange-primary)' }}>→</span>
                          <span style={{ fontWeight: 800, color: '#10B981', fontSize: '1.1rem' }}>{item.new_level}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                          {item.reason}
                        </div>
                        {item.trigger_transaction_id && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            Transaction ID: {item.trigger_transaction_id}
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SellerProfilePage;
