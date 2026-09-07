import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById } from '@/lib/api/products';
import { fetchProductInspection, fetchProductVerificationSummary } from '@/lib/api/inspections';
import { fetchSellerProfileById } from '@/lib/api/seller';
import { createOrder } from '@/lib/api/orders';
import { Product, InspectionReport, ProductVerificationSummary, SellerProfile } from '@/lib/api/types';
import { getProductImagesList } from '@/lib/utils/productImages';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  Package,
  Lock,
  FileText,
  Award,
  Store,
  Info,
  X,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [verificationSummary, setVerificationSummary] = useState<ProductVerificationSummary | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [inspectionReport, setInspectionReport] = useState<InspectionReport | null>(null);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportFetched, setReportFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchProductById(id)
      .then(async (data) => {
        setProduct(data);
        const images = getProductImagesList(data.name);
        setSelectedImg(images[0] || '');

        // Fetch product verification summary
        try {
          const summary = await fetchProductVerificationSummary(data.id);
          setVerificationSummary(summary);
        } catch {
          // ignore if summary fails
        }

        // Fetch seller profile
        try {
          const seller = await fetchSellerProfileById(data.seller_id);
          setSellerProfile(seller);
        } catch {
          // ignore if seller profile fails
        }
      })
      .catch((err) => setError((err as Error).message || 'Product not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleOpenInspectionReport = async () => {
    setShowReportModal(true);
    if (reportFetched || !product) return;

    setReportLoading(true);
    try {
      const report = await fetchProductInspection(product.id);
      setInspectionReport(report);
    } catch {
      setInspectionReport(null);
    } finally {
      setReportLoading(false);
      setReportFetched(true);
    }
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    setError(null);
    setIsOrdering(true);

    try {
      const order = await createOrder({
        product_id: product.id,
        quantity,
      });
      navigate(`/buyer/orders/${order.id}`);
    } catch (err) {
      setError((err as Error).message || 'Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  const imagesList = product ? getProductImagesList(product.name) : [];

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
          <ArrowLeft size={18} /> Back to Verified Marketplace
        </Link>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading verified product details...
          </div>
        ) : error || !product ? (
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
            {error || 'Product not found'}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Left: Product Images Gallery */}
            <div>
              <div
                style={{
                  height: '380px',
                  backgroundColor: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={selectedImg || imagesList[0]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(imgUrl)}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      border:
                        selectedImg === imgUrl
                          ? '2px solid var(--color-orange-primary)'
                          : '1px solid var(--color-border-light)',
                      overflow: 'hidden',
                      padding: 0,
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Overview, Trust Badges, & Action */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Prominent Verification Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor:
                        product.verification_status === 'VERIFIED'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(245, 158, 11, 0.15)',
                      color: product.verification_status === 'VERIFIED' ? '#10B981' : '#F59E0B',
                      border: `1px solid ${
                        product.verification_status === 'VERIFIED' ? '#10B981' : '#F59E0B'
                      }`,
                      borderRadius: 'var(--radius-pill)',
                      padding: '6px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <ShieldCheck size={18} /> ✓ {product.verification_status} PRODUCT
                  </span>

                  <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                    Authenticity:{' '}
                    <strong style={{ color: 'var(--color-text-main)' }}>
                      {product.authenticity_status || 'UNINSPECTED'}
                    </strong>
                  </span>

                  {product.last_inspected_at && (
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                      Inspected: {new Date(product.last_inspected_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h1
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '12px',
                    color: 'var(--color-text-main)',
                  }}
                >
                  {product.name}
                </h1>

                <div
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: 900,
                    color: 'var(--color-orange-primary)',
                    marginBottom: '20px',
                  }}
                >
                  ₦{product.price.toLocaleString()}
                </div>

                {/* Product Physical Details & Warranty */}
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
                    Physical Item Information
                  </h4>
                  <p
                    style={{
                      fontSize: '0.925rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.6,
                      marginBottom: '14px',
                    }}
                  >
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--color-bg-page)',
                        border: '1px solid var(--color-border-light)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                      }}
                    >
                      Physical Condition: {product.condition}
                    </span>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--color-bg-page)',
                        border: '1px solid var(--color-border-light)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                      }}
                    >
                      Stock Available: {product.stock}
                    </span>
                    {product.warranty_months > 0 && (
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#3B82F6',
                          border: '1px solid #3B82F6',
                          padding: '6px 12px',
                          borderRadius: '6px',
                        }}
                      >
                        Warranty: {product.warranty_months} Months
                      </span>
                    )}
                  </div>

                  {product.warranty_terms && (
                    <div
                      style={{
                        marginTop: '12px',
                        fontSize: '0.825rem',
                        color: 'var(--color-text-muted)',
                        fontStyle: 'italic',
                      }}
                    >
                      Warranty Terms: {product.warranty_terms}
                    </div>
                  )}
                </div>

                {/* Seller Trust Card Section */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 107, 0, 0.05)',
                    border: '1px solid rgba(255, 107, 0, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Store size={20} style={{ color: 'var(--color-orange-primary)' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {sellerProfile?.store_name || `Seller ${product.seller_id.slice(0, 8)}`}
                      </span>
                    </div>

                    <Link
                      to={`/seller/profile/${product.seller_id}`}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-orange-primary)',
                        fontWeight: 700,
                        textDecoration: 'underline',
                      }}
                    >
                      View Seller Profile & History →
                    </Link>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '10px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border-light)',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                        Trust Level
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-orange-primary)' }}>
                        {sellerProfile?.trust_level || verificationSummary?.seller_trust_level || 'LV1'}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '10px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border-light)',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                        Seller Grade
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10B981' }}>
                        {sellerProfile?.seller_grade || verificationSummary?.seller_grade || 'Grade C'}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '10px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border-light)',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                        Successful Tx
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        {sellerProfile ? sellerProfile.successful_transactions : 0}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: '10px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border-light)',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                        Fulfillment Rate
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        {sellerProfile ? `${sellerProfile.fulfillment_rate}%` : '100%'}
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Seller Grade Explanation Banner */}
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      backgroundColor: 'var(--color-surface)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px dashed var(--color-border-light)',
                      fontSize: '0.775rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <span>
                      <Info size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--color-orange-primary)' }} />
                      Grade represents supplier trust built with TROIT, not physical product quality.
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGradeModal(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-orange-primary)',
                        fontWeight: 700,
                        fontSize: '0.775rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Inspection Report Action & Protections */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={handleOpenInspectionReport}
                    className="btn btn-dark"
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: '0.9rem',
                      justifyContent: 'center',
                      borderRadius: '8px',
                    }}
                  >
                    <FileText size={18} /> View Inspection Report
                  </button>

                  <Link
                    to="/verification"
                    className="btn btn-outline"
                    style={{
                      padding: '12px 16px',
                      fontSize: '0.85rem',
                      justifyContent: 'center',
                      borderRadius: '8px',
                    }}
                  >
                    <ShieldCheck size={18} /> Verification Centre
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <CheckCircle size={16} style={{ color: '#10B981' }} /> Hardware & display physically tested by field agent
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <Package size={16} style={{ color: 'var(--color-orange-primary)' }} /> Sealed & tagged in TROIT tamper-evident package
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <Lock size={16} style={{ color: 'var(--color-yellow-accent)' }} /> Payment held in Protected State until buyer delivery confirmation
                  </div>
                </div>
              </div>

              {/* Order Action Box */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                    Select Quantity
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      className="btn btn-dark"
                      style={{ padding: '8px 16px', borderRadius: '6px' }}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, width: '32px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="btn btn-dark"
                      style={{ padding: '8px 16px', borderRadius: '6px' }}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--color-orange-primary)',
                    marginBottom: '16px',
                  }}
                >
                  <span>Total Amount:</span>
                  <span>₦{(product.price * quantity).toLocaleString()}</span>
                </div>

                {user?.role === 'seller' && user.id === product.seller_id ? (
                  <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.85rem' }}>
                    You are the seller of this product.
                  </div>
                ) : (
                  <button
                    onClick={handleOrder}
                    disabled={isOrdering || product.stock <= 0}
                    className="btn btn-orange"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingBag size={20} /> {isOrdering ? 'Processing Order...' : 'Place Order (Protected Escrow)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Real Inspection Report */}
        {showReportModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '32px',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            >
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                }}
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ShieldCheck size={28} style={{ color: 'var(--color-orange-primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Official Product Inspection Report</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    TROIT Field Inspection Record
                  </p>
                </div>
              </div>

              {reportLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                  Loading inspection report data from backend...
                </div>
              ) : inspectionReport ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--color-surface-card)',
                      padding: '14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Authenticity Verification</div>
                      <div style={{ fontWeight: 800, color: inspectionReport.authenticity_verified ? '#10B981' : '#EF4444' }}>
                        {inspectionReport.authenticity_verified ? '✓ VERIFIED AUTHENTIC' : 'FAILED AUTHENTICITY'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Inspection Date</div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                        {new Date(inspectionReport.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Physical Condition</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{inspectionReport.physical_condition}</div>
                  </div>

                  {inspectionReport.serial_number && (
                    <div style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Serial Number / Identifier</div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>{inspectionReport.serial_number}</div>
                    </div>
                  )}

                  {inspectionReport.notes && (
                    <div style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Field Agent Notes</div>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{inspectionReport.notes}</div>
                    </div>
                  )}

                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '8px' }}>
                    Report ID: {inspectionReport.id}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    backgroundColor: 'var(--color-surface-card)',
                    borderRadius: '8px',
                    border: '1px dashed var(--color-border-light)',
                  }}
                >
                  <Info size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Inspection report not available yet.</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    This item has been submitted for physical field inspection. Detailed test results will appear once published by an authorized agent.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Seller Grade Explanation */}
        {showGradeModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '540px',
                width: '100%',
                padding: '32px',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            >
              <button
                type="button"
                onClick={() => setShowGradeModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                }}
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Award size={28} style={{ color: 'var(--color-orange-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Understanding Seller Grades</h3>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 107, 0, 0.08)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  marginBottom: '20px',
                  lineHeight: 1.5,
                }}
              >
                "Grade represents the level of trust the supplier has built with TROIT. It does not represent product quality."
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-card)', borderRadius: '6px' }}>
                  <strong style={{ color: '#10B981' }}>Grade A:</strong> Top tier supplier with extensive verified transaction history and maximum fulfillment accuracy.
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-card)', borderRadius: '6px' }}>
                  <strong style={{ color: '#3B82F6' }}>Grade B:</strong> Established seller with consistent performance record across multiple fulfilled orders.
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-card)', borderRadius: '6px' }}>
                  <strong style={{ color: '#F59E0B' }}>Grade C:</strong> Initial seller grade assigned during probation while building marketplace history.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
