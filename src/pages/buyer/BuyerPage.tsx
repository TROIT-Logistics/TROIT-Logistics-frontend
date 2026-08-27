import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '@/lib/api/products';
import { seedDemoData } from '@/lib/api/seed';
import { Product } from '@/lib/api/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Search, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export const BuyerPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts('VERIFIED');
      setProducts(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load verified products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await loadProducts();
    } catch (err) {
      setError((err as Error).message || 'Failed to seed demo data');
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        {/* Marketplace Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div
            className="pill-badge"
            style={{ marginBottom: '12px', background: 'rgba(255,77,0,0.1)', color: 'var(--color-orange-primary)', border: '1px solid rgba(255,77,0,0.2)' }}
          >
            <ShieldCheck size={16} /> TROIT VERIFIED MARKETPLACE — PORT HARCOURT
          </div>
          <h1 className="section-title">Inspected & Verified Products</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
            Every listed item is physically inspected by a TROIT field agent prior to buyer purchase.
          </p>
        </div>

        {/* Action Controls & Search */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            backgroundColor: 'var(--color-surface-card)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '480px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            <input
              type="text"
              placeholder="Search verified smartphones, laptops, electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-bg-page)',
                color: 'var(--color-text-main)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="btn btn-dark"
              style={{ fontSize: '0.85rem' }}
            >
              <Sparkles size={16} /> {isSeeding ? 'Seeding...' : 'Seed Demo Products'}
            </button>
            <Link to="/buyer/orders" className="btn btn-orange" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
              <ShoppingBag size={16} /> My Orders
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '8px',
              padding: '14px 18px',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading verified inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'var(--color-surface)',
              border: '1px dashed var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <ShieldCheck size={48} style={{ color: 'var(--color-orange-primary)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Verified Products Found</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Click below to instantly populate demo verified products for Port Harcourt.
            </p>
            <button onClick={handleSeed} disabled={isSeeding} className="btn btn-orange">
              <Sparkles size={18} /> {isSeeding ? 'Seeding Demo Products...' : 'Seed Verified Products'}
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10B981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <ShieldCheck size={14} /> VERIFIED
                    </span>

                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      Stock: {product.stock}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-main)' }}>
                    {product.name}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-border-light)', padding: '4px 10px', borderRadius: '6px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {product.condition}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-orange-primary)', marginBottom: '16px' }}>
                    ₦{product.price.toLocaleString()}
                  </div>

                  <Link
                    to={`/buyer/products/${product.id}`}
                    className="btn btn-orange"
                    style={{ width: '100%', borderRadius: '8px', fontSize: '0.9rem', justifyContent: 'center' }}
                  >
                    View Details & Order <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BuyerPage;
