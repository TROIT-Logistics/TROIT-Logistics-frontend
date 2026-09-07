import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchSellerVerification, submitSellerVerification as submitVerificationApi } from '@/lib/api/seller';

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
  submitVerification: (data: SellerVerificationData) => Promise<void>;
  refreshVerification: () => Promise<void>;
  resetVerification: () => void;
}

const SellerVerificationContext = createContext<SellerVerificationContextType | undefined>(undefined);

const STORAGE_PREFIX = 'troit_seller_verification_';

export const SellerVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('NOT_STARTED');
  const [verificationData, setVerificationData] = useState<SellerVerificationData | null>(null);

  const refreshVerification = useCallback(async () => {
    if (!user) {
      setStatus('NOT_STARTED');
      setVerificationData(null);
      return;
    }

    if (user.role === 'seller' || user.role === 'admin') {
      try {
        const res = await fetchSellerVerification();
        const apiStatus = (res.verification_status as VerificationStatus) || 'PENDING';
        setStatus(apiStatus);

        const stored = localStorage.getItem(`${STORAGE_PREFIX}${user.id}`);
        let localMeta: Partial<SellerVerificationData> = {};
        if (stored) {
          try {
            localMeta = JSON.parse(stored).data || {};
          } catch {
            // ignore
          }
        }

        if (res.store_name || res.store_address || localMeta.business_name) {
          setVerificationData({
            id_type: localMeta.id_type || 'NIN National Identity Number',
            id_number: localMeta.id_number || 'Submitted ID',
            business_name: res.store_name || localMeta.business_name || '',
            business_address: res.store_address || localMeta.business_address || '',
            product_category: localMeta.product_category || 'Consumer Electronics',
            physical_verification_consent: localMeta.physical_verification_consent ?? true,
            submitted_at: localMeta.submitted_at,
          });
        }
      } catch {
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
          setStatus('PENDING');
        }
      }
    }
  }, [user]);

  useEffect(() => {
    refreshVerification();
  }, [refreshVerification]);

  const submitVerification = async (data: SellerVerificationData) => {
    if (!user) return;
    const now = new Date().toISOString();
    const updatedData = { ...data, submitted_at: now };

    const res = await submitVerificationApi({
      store_name: data.business_name,
      store_address: data.business_address,
      id_type: data.id_type,
      id_number: data.id_number,
    });

    const newStatus = (res.verification_status as VerificationStatus) || 'UNDER_REVIEW';
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
        refreshVerification,
        resetVerification,
      }}
    >
      {children}
    </SellerVerificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSellerVerification = (): SellerVerificationContextType => {
  const context = useContext(SellerVerificationContext);
  if (!context) {
    throw new Error('useSellerVerification must be used within a SellerVerificationProvider');
  }
  return context;
};
