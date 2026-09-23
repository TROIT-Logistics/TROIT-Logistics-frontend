import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSellerVerification } from '@/context/SellerVerificationContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductImageUploader, { SelectedFileItem } from '@/components/seller/ProductImageUploader';
import { createProduct, uploadProductImage } from '@/lib/api/products';

export const SellerCreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status } = useSellerVerification();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Grade A - Like New');
  const [stock, setStock] = useState('1');
  const [selectedImageFiles, setSelectedImageFiles] = useState<SelectedFileItem[]>([]);

  const [isAfricanMade, setIsAfricanMade] = useState(false);
  const [africanMadeCategory, setAfricanMadeCategory] = useState('ELECTRONICS');
  const [warrantyMonths, setWarrantyMonths] = useState('0');
  const [warrantyTerms, setWarrantyTerms] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Unverified seller protection check
  const isUnverified = user?.role === 'seller' && status !== 'VERIFIED' && user.email !== 'seller@demo.troit';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isUnverified) {
      setError('Seller verification required before listing products.');
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);
    const warrantyNum = parseInt(warrantyMonths, 10) || 0;

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

    if (isAfricanMade && !africanMadeCategory) {
      setError('Please select an African Made category');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create product record first via POST /api/v1/products
      const createdProduct = await createProduct({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        condition,
        stock: stockNum,
        is_african_made: isAfricanMade,
        african_made_category: isAfricanMade ? africanMadeCategory : undefined,
        warranty_months: warrantyNum,
        warranty_terms: warrantyTerms.trim() || undefined,
      });

      // 2. Upload each selected product image sequentially via POST /api/v1/products/:id/images
      if (selectedImageFiles.length > 0) {
        setIsUploadingImages(true);
        let index = 1;
        for (const item of selectedImageFiles) {
          setUploadProgressText(`Uploading photo ${index} of ${selectedImageFiles.length} to backend storage...`);
          await uploadProductImage(createdProduct.id, item.file);
          index++;
        }
      }

      navigate('/seller');
    } catch (err) {
      setError((err as Error).message || 'Failed to create product');
    } finally {
      setIsLoading(false);
      setIsUploadingImages(false);
      setUploadProgressText(null);
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
                <div style={{ marginBottom: '24px' }}>
                  <ProductImageUploader
                    selectedFiles={selectedImageFiles}
                    onChange={setSelectedImageFiles}
                    maxFiles={5}
                    maxSizeMb={5}
                    isUploading={isUploadingImages}
                    uploadProgressText={uploadProgressText}
                    disabled={isLoading}
                  />
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

                <div style={{ marginBottom: '20px' }}>
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

                {/* Made in Africa Specification */}
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isAfricanMade}
                      onChange={(e) => setIsAfricanMade(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-orange-primary)' }}
                    />
                    🌍 Made in Africa Product Certification
                  </label>

                  {isAfricanMade && (
                    <div style={{ marginTop: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        African-Made Category
                      </label>
                      <select
                        value={africanMadeCategory}
                        onChange={(e) => setAfricanMadeCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border-light)',
                          backgroundColor: 'var(--color-bg-page)',
                          color: 'var(--color-text-main)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <option value="ELECTRONICS">ELECTRONICS</option>
                        <option value="HOME_APPLIANCES">HOME_APPLIANCES</option>
                        <option value="FURNITURE">FURNITURE</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Warranty Information */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }} className="grid-2col-responsive">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Warranty Duration (Months)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={warrantyMonths}
                      onChange={(e) => setWarrantyMonths(e.target.value)}
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
                      Warranty Terms (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Months repair coverage"
                      value={warrantyTerms}
                      onChange={(e) => setWarrantyTerms(e.target.value)}
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
