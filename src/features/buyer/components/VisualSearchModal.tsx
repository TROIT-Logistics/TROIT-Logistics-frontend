import React, { useState, useEffect } from 'react';
import { X, Camera, ShieldCheck } from 'lucide-react';
import ImageCapture from './ImageCapture';
import VisualSearchLoading from './VisualSearchLoading';
import VisualSearchResults from './VisualSearchResults';
import VisualSearchError from './VisualSearchError';
import { visualSearch } from '@/services/visualSearch';
import { VisualSearchResponse } from '@/lib/api/types';
import { VisualSearchApiError } from '@/lib/api/visualSearch';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStage = 'CAPTURE' | 'ANALYZING' | 'RESULTS' | 'ERROR';

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState<ModalStage>('CAPTURE');
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<VisualSearchResponse | null>(null);
  const [errorObj, setErrorObj] = useState<Error | string | null>(null);
  const [isEndpointUnavailable, setIsEndpointUnavailable] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset internal state when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setStage('CAPTURE');
      setSelectedFile(null);
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return null;
      });
      setSearchResponse(null);
      setErrorObj(null);
      setIsEndpointUnavailable(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageSelected = (file: File | Blob, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setErrorObj(null);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setStage('CAPTURE');
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setStage('ANALYZING');
    setErrorObj(null);
    setIsEndpointUnavailable(false);

    try {
      const result = await visualSearch(selectedFile);
      setSearchResponse(result);
      setStage('RESULTS');
    } catch (err: unknown) {
      console.error('Visual Search Analysis Error:', err);
      if (err instanceof VisualSearchApiError) {
        setIsEndpointUnavailable(err.isEndpointUnavailable);
        setErrorObj(err);
      } else if (err instanceof Error) {
        setErrorObj(err);
      } else {
        setErrorObj(String(err));
      }
      setStage('ERROR');
    }
  };

  const handleRetry = () => {
    setStage('CAPTURE');
    setErrorObj(null);
    setIsEndpointUnavailable(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visual-search-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 77, 0, 0.1)',
                color: 'var(--color-orange-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h2
                id="visual-search-modal-title"
                style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}
              >
                Search with Camera
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Powered by TROIT AI Product Vision
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close visual search modal"
            style={{
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-border-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {stage === 'CAPTURE' && (
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', marginBottom: '20px' }}>
                Take a photo of a product and TROIT will find matching or similar verified items in the marketplace.
              </p>
              <ImageCapture
                onImageSelected={handleImageSelected}
                onStartAnalysis={handleStartAnalysis}
                selectedPreviewUrl={previewUrl}
                onClearImage={handleClearImage}
              />
            </div>
          )}

          {stage === 'ANALYZING' && <VisualSearchLoading />}

          {stage === 'RESULTS' && searchResponse && (
            <VisualSearchResults
              response={searchResponse}
              onSearchAgain={handleRetry}
              onCloseModal={onClose}
            />
          )}

          {stage === 'ERROR' && (
            <VisualSearchError
              error={errorObj}
              isEndpointUnavailable={isEndpointUnavailable}
              onRetry={handleRetry}
            />
          )}
        </div>

        {/* Modal Footer Banner */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--color-surface-card)',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.775rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <ShieldCheck size={14} style={{ color: '#10B981' }} />
          <span>TROIT Physical Inspection Guarantee · Port Harcourt Verified Inventory</span>
        </div>
      </div>
    </div>
  );
};

export default VisualSearchModal;
