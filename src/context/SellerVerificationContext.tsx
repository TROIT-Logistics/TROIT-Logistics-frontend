import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type VerificationStatus = 'NOT_STARTED' | 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface SellerVerificationData {
  id_type: string;
  id_number: string;
  business_name: string;
  business_address: string;
  product_category: string;
  physical_verification_consent: boolean;
  submitted_at?: string;
}

interface SellerVerificationContextType {
  status: VerificationStatus;
  verificationData: SellerVerificationData | null;
  submitVerification: (data: SellerVerificationData) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  resetVerification: () => void;
}

const SellerVerificationContext = createContext<SellerVerificationContextType | undefined>(undefined);

const STORAGE_PREFIX = 'troit_seller_verification_';

export const SellerVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('NOT_STARTED');
  const [verificationData, setVerificationData] = useState<SellerVerificationData | null>(null);

  useEffect(() => {
    if (!user) {
      setStatus('NOT_STARTED');
      setVerificationData(null);
      return;
    }

    // Demo seller account is pre-verified for presentation convenience unless overwritten
    if (user.email === 'seller@demo.troit') {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${user.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStatus(parsed.status || 'VERIFIED');
          setVerificationData(parsed.data || null);
          return;
        } catch {
          // fallback to demo verified
        }
      }
      setStatus('VERIFIED');
      setVerificationData({
        id_type: 'NIN National Identity Number',
        id_number: 'NIN-7823901293',
        business_name: 'Port Harcourt Tech & Mobile Store',
        business_address: 'Plot 14, GRA Phase 2, Port Harcourt',
        product_category: 'Smartphones & Laptops',
        physical_verification_consent: true,
        submitted_at: new Date().toISOString(),
      });
      return;
    }

    // For other seller users, check localStorage
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${user.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStatus(parsed.status || 'PENDING');
        setVerificationData(parsed.data || null);
      } catch {
        setStatus('NOT_STARTED');
      }
    } else {
      setStatus(user.role === 'seller' ? 'PENDING' : 'NOT_STARTED');
    }
  }, [user]);

  const submitVerification = (data: SellerVerificationData) => {
    if (!user) return;
    const now = new Date().toISOString();
    const updatedData = { ...data, submitted_at: now };
    const newStatus: VerificationStatus = 'VERIFIED';

    setVerificationData(updatedData);
    setStatus(newStatus);

    localStorage.setItem(
      `${STORAGE_PREFIX}${user.id}`,
      JSON.stringify({
        status: newStatus,
        data: updatedData,
      })
    );
  };

  const setVerificationStatus = (newStatus: VerificationStatus) => {
    if (!user) return;
    setStatus(newStatus);
    localStorage.setItem(
      `${STORAGE_PREFIX}${user.id}`,
      JSON.stringify({
        status: newStatus,
        data: verificationData,
      })
    );
  };

  const resetVerification = () => {
    if (!user) return;
    setStatus('PENDING');
    setVerificationData(null);
    localStorage.removeItem(`${STORAGE_PREFIX}${user.id}`);
  };

  return (
    <SellerVerificationContext.Provider
      value={{
        status,
        verificationData,
        submitVerification,
        setVerificationStatus,
        resetVerification,
      }}
    >
      {children}
    </SellerVerificationContext.Provider>
  );
};

export const useSellerVerification = (): SellerVerificationContextType => {
  const context = useContext(SellerVerificationContext);
  if (!context) {
    throw new Error('useSellerVerification must be used within a SellerVerificationProvider');
  }
  return context;
};
