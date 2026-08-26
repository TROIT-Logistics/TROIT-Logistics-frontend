import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { envConfig } from '@/app/config/env';

/**
 * Shell landing page to verify environment setup.
 * Interns will replace or extend this with actual role routes.
 */
const EnvironmentLandingShell: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#0f172a', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          🛡️ {envConfig.appName} — Frontend Development Environment
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Port Harcourt Pilot &bull; Frontend Intern Workspace
        </p>
      </header>

      <main style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.75rem' }}>
          Environment Ready for Development
        </h2>
        <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6' }}>
          Welcome to the TROIT Logistics frontend codebase. The developer environment, folder structure, API client foundation, and code quality tools are configured.
        </p>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem', borderLeft: '4px solid #0284c7' }}>
          <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0369a1', marginBottom: '0.25rem' }}>
            Next Steps for Interns:
          </strong>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
            <li>Read <code>README.md</code> for onboarding instructions and coding rules.</li>
            <li>Check your assigned task and PRD requirements.</li>
            <li>Create a feature branch (e.g. <code>feature/seller-kyc</code>) before writing code.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EnvironmentLandingShell />} />
      <Route path="*" element={<EnvironmentLandingShell />} />
    </Routes>
  );
};
