import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, RefreshCw, SearchX, CheckCircle } from 'lucide-react';
import { VisualSearchResponse } from '@/lib/api/types';
import { getProductImage } from '@/lib/utils/productImages';

interface VisualSearchResultsProps {
  response: VisualSearchResponse;
  onSearchAgain: () => void;
  onCloseModal: () => void;
}

export const VisualSearchResults: React.FC<VisualSearchResultsProps> = ({
  response,
  onSearchAgain,
  onCloseModal,
}) => {
  const { query, matches } = response;

  // Filter valid verified available items
  const validMatches = matches.filter(
    (item) => item.verification_status === 'VERIFIED' && item.stock > 0
  );

  const highestScore = validMatches.reduce((max, item) => Math.max(max, item.match_score || 0), 0);
  const confidence = query?.confidence || highestScore || 0;

  const isExactMatch = confidence >= 0.85 || highestScore >= 0.85;

  // STATE 3: No results found
  if (validMatches.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <SearchX size={32} />
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-main)' }}>
          We couldn't find a matching product on TROIT
        </h3>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
          Try taking a clearer photo from another angle, ensuring good lighting, or searching by product name in the marketplace search bar.
        </p>

        <button type="button" onClick={onSearchAgain} className="btn btn-orange">
          <RefreshCw size={16} /> Search Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* AI Detection Banner */}
      <div
        style={{
          backgroundColor: isExactMatch ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 77, 0, 0.08)',
          border: `1px solid ${isExactMatch ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 77, 0, 0.3)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isExactMatch ? '#10B981' : 'var(--color-orange-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '4px',
              }}
            >
              {isExactMatch ? <CheckCircle size={14} /> : <Sparkles size={14} />}
              {isExactMatch ? 'Exact / High-Confidence Match' : 'Similar Products Found'}
            </span>

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              {query?.brand && query?.model
                ? `${query.brand} ${query.model}`
                : query?.description || 'Detected Marketplace Item'}
            </h4>

            {query?.category && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                {query.category} {query.brand ? `· ${query.brand}` : ''}
              </span>
            )}
          </div>

          {confidence > 0 && (
            <div
              style={{
                backgroundColor: isExactMatch ? '#10B981' : 'var(--color-orange-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                fontSize: '0.825rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {Math.round(confidence * 100)}% confidence
            </div>
          )}
        </div>
      </div>

      {/* Results Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
            Verified matches on TROIT ({validMatches.length})
          </h4>

          <button
            type="button"
            onClick={onSearchAgain}
            className="btn btn-dark"
            style={{ padding: '6px 12px', fontSize: '0.775rem' }}
          >
            <RefreshCw size={14} /> New Search
          </button>
        </div>

        {/* Product Cards List / Grid matching Marketplace styling */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            maxHeight: '440px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {validMatches.map((product) => {
            const prodImg = product.image_url || getProductImage(product.name);
            const matchScore = product.match_score ? Math.round(product.match_score * 100) : null;

            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Product Image Container */}
                <div
                  style={{
                    height: '180px',
                    backgroundColor: 'var(--color-surface-card)',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--color-border-light)',
                  }}
                >
                  <img
                    src={prodImg}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'rgba(16, 185, 129, 0.95)',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-pill)',
                      padding: '3px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    <ShieldCheck size={12} /> VERIFIED
                  </div>

                  {matchScore !== null && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'var(--color-orange-primary)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius-pill)',
                        padding: '3px 10px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                      }}
                    >
                      {matchScore}% Match
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h5
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        marginBottom: '6px',
                        color: 'var(--color-text-main)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.name}
                    </h5>

                    {product.description && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-muted)',
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--color-surface-card)',
                          border: '1px solid var(--color-border-light)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          color: 'var(--color-text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        {product.condition}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--color-surface-card)',
                          border: '1px solid var(--color-border-light)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: 'var(--color-orange-primary)',
                        marginBottom: '12px',
                      }}
                    >
                      ₦{product.price.toLocaleString()}
                    </div>

                    <Link
                      to={`/buyer/products/${product.id}`}
                      onClick={onCloseModal}
                      className="btn btn-orange"
                      style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem', padding: '8px 12px', justifyContent: 'center' }}
                    >
                      View Details & Order <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisualSearchResults;
