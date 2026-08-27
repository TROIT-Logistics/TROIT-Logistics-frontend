import React from 'react';
import { AlertTriangle, RefreshCw, Cpu, WifiOff } from 'lucide-react';

interface VisualSearchErrorProps {
  error: Error | string | null;
  isEndpointUnavailable?: boolean;
  onRetry: () => void;
}

export const VisualSearchError: React.FC<VisualSearchErrorProps> = ({
  error,
  isEndpointUnavailable = false,
  onRetry,
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred during visual search.';

  if (isEndpointUnavailable) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 77, 0, 0.1)',
            color: 'var(--color-orange-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1px solid rgba(255, 77, 0, 0.2)',
          }}
        >
          <Cpu size={32} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
          AI Visual Search Service Prepared
        </h3>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
          The frontend AI Vision interface is fully built and ready. The Rust backend endpoint (<code style={{ backgroundColor: 'var(--color-surface-card)', padding: '2px 6px', borderRadius: '4px' }}>POST /api/v1/products/visual-search</code>) is currently coming online.
        </p>

        <div
          style={{
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '24px',
            textAlign: 'left',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
            Diagnostic Details:
          </div>
          <div>• Frontend camera & image validation: Active</div>
          <div>• Multipart Form-Data payload encoder: Ready</div>
          <div>• Backend integration status: Endpoint pending deployment in Rust service</div>
        </div>

        <button type="button" onClick={onRetry} className="btn btn-orange">
          <RefreshCw size={16} /> Try Another Image
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '24px 16px' }}>
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
        {errorMessage.includes('Network Error') || errorMessage.includes('connect') ? (
          <WifiOff size={32} />
        ) : (
          <AlertTriangle size={32} />
        )}
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>
        Unable to Complete Visual Search
      </h3>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.5 }}>
        {errorMessage}
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button type="button" onClick={onRetry} className="btn btn-orange">
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
};

export default VisualSearchError;
