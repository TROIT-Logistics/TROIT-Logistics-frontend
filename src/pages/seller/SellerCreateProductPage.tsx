import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '@/lib/api/products';
import { useSellerVerification } from '@/context/SellerVerificationContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, PlusCircle, ShieldAlert, UploadCloud, X, Sparkles } from 'lucide-react';
import iphoneImg from '@/assets/images/product_iphone14pro.png';
import samsungImg from '@/assets/images/product_samsung23ultra.png';
import hpSpectreImg from '@/assets/images/product_hpspectre.png';

export const SellerCreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status } = useSellerVerification();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Grade A - Like New');
  const [stock, setStock] = useState('1');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unverified seller protection check
  const isUnverified = user?.role === 'seller' && status !== 'VERIFIED' && user.email !== 'seller@demo.troit';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const handleAddCustomUrl = () => {
    if (customUrlInput.trim()) {
      setImageUrls((prev) => [...prev, customUrlInput.trim()]);
      setCustomUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPresetImage = (url: string) => {
    if (!imageUrls.includes(url)) {
      setImageUrls((prev) => [...prev, url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isUnverified) {
      setError('Seller verification required before listing products.');
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (!name.trim()) {
      setError('Product name cannot be empty');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price greater than zero');
      return;
    }
    if (isNaN(stockNum) || stockNum < 1) {
      setError('Stock quantity must be at least 1');
      return;
    }

    setIsLoading(true);

    try {
      await createProduct({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        condition,
        stock: stockNum,
      });

      navigate('/seller');
    } catch (err) {
      setError((err as Error).message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <Link
          to="/seller"
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
          <ArrowLeft size={18} /> Back to Seller Dashboard
        </Link>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {isUnverified ? (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  marginBottom: '16px',
                }}
              >
                <ShieldAlert size={32} />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                Verification Required
              </h2>

              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                You must complete your seller onboarding verification before you can list items on TROIT.
              </p>

              <Link to="/seller/verification" className="btn btn-orange" style={{ padding: '12px 28px', fontSize: '1rem', width: '100%', justifyContent: 'center' }}>
                Complete Seller Verification
              </Link>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                boxShadow: 'var(--shadow-md)',
              }}
              className="mobile-card-padding"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 77, 0, 0.1)',
                    color: 'var(--color-orange-primary)',
                  }}
                >
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>List New Product</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    Product will be submitted for TROIT agent physical inspection
                  </p>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #EF4444',
                    color: '#EF4444',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    fontSize: '0.85rem',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Product Photos Upload Box */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                    Product Photos & Inspection Images
                  </label>

                  {/* Dropzone Upload Area */}
                  <div
                    style={{
                      border: '2px dashed var(--color-orange-primary)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 77, 0, 0.04)',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      marginBottom: '12px',
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <UploadCloud size={32} style={{ color: 'var(--color-orange-primary)', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      Click or Drag Product Photos Here
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      PNG, JPG, WEBP up to 10MB per photo
                    </div>
                  </div>

                  {/* Quick Preset Photos Selection */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                      <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} /> Quick sample photos for demo:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => handleAddPresetImage(iphoneImg)}
                        className="btn btn-dark"
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        + iPhone 14 Pro
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPresetImage(samsungImg)}
                        className="btn btn-dark"
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        + Galaxy S23
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPresetImage(hpSpectreImg)}
                        className="btn btn-dark"
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        + HP Laptop
                      </button>
                    </div>
                  </div>

                  {/* Optional Image URL Input */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="url"
                      placeholder="Or paste photo URL link..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border-light)',
                        backgroundColor: 'var(--color-bg-page)',
                        color: 'var(--color-text-main)',
                        fontSize: '0.85rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="btn btn-dark"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      Add Photo
                    </button>
                  </div>

                  {/* Thumbnail Gallery Preview */}
                  {imageUrls.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginTop: '12px' }}>
                      {imageUrls.map((url, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '80px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border-light)',
                            backgroundColor: '#000000',
                          }}
                        >
                          <img src={url} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              backgroundColor: 'rgba(0, 0, 0, 0.75)',
                              color: '#FFFFFF',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 14 Pro Max 256GB"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    Detailed Description & Accessories
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe physical condition, battery health, included accessories..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="grid-2col-responsive">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="650000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
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

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
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
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Item Condition Grade
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
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
                    <option value="Grade A - Like New">Grade A - Like New</option>
                    <option value="Grade A - Certified">Grade A - Certified</option>
                    <option value="Grade B - Excellent">Grade B - Excellent</option>
                    <option value="Grade C - Good Working Order">Grade C - Good Working Order</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-orange"
                  disabled={isLoading}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', justifyContent: 'center' }}
                >
                  {isLoading ? 'Submitting Product...' : 'List Product for Verification'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerCreateProductPage;
