import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Circle } from 'lucide-react';

export const VisualSearchLoading: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = [
    { label: 'Image received', description: 'Pre-flight check and optimization complete' },
    { label: 'Identifying product', description: 'Running AI vision classification model' },
    { label: 'Searching TROIT marketplace', description: 'Filtering Port Harcourt verified inventory' },
    { label: 'Finding closest matches', description: 'Ranking items by confidence match score' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStepIndex(1), 600);
    const timer2 = setTimeout(() => setActiveStepIndex(2), 1400);
    const timer3 = setTimeout(() => setActiveStepIndex(3), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '24px 12px' }}>
      {/* Header Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'rgba(255,77,0,0.1)',
          color: 'var(--color-orange-primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '16px',
        }}
      >
        <Sparkles size={16} /> TROIT AI VISION ENGINE
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '6px' }}>
        Analyzing your product
      </h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
        TROIT AI is identifying the item and searching verified marketplace listings.
      </p>

      {/* Progress Steps Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-light)',
          padding: '20px',
          maxWidth: '440px',
          margin: '0 auto',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step, idx) => {
            const isDone = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div
                key={step.label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  opacity: idx > activeStepIndex ? 0.4 : 1,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {isDone ? (
                    <CheckCircle2 size={20} style={{ color: '#10B981' }} />
                  ) : isCurrent ? (
                    <Loader2 size={20} className="spin-animation" style={{ color: 'var(--color-orange-primary)' }} />
                  ) : (
                    <Circle size={20} style={{ color: 'var(--color-text-light)' }} />
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.925rem',
                      fontWeight: isCurrent ? 700 : 600,
                      color: isCurrent ? 'var(--color-orange-primary)' : 'var(--color-text-main)',
                    }}
                  >
                    {isDone ? `✓ ${step.label}` : isCurrent ? `• ${step.label}` : `• ${step.label}`}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VisualSearchLoading;
