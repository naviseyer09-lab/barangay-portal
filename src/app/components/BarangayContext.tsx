import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getBarangayInfo } from '../../lib/api';

interface BarangayInfo {
  name: string;
  captain: string;
  address: string;
  contactNumber: string;
  email: string;
  mission: string;
  vision: string;
  barangayHours: string;
  establishedYear: string;
  population: string;
  totalArea: string;
}

interface BarangayContextType {
  barangayInfo: BarangayInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const BarangayContext = createContext<BarangayContextType | undefined>(undefined);

export const useBarangay = () => {
  const context = useContext(BarangayContext);
  if (context === undefined) {
    throw new Error('useBarangay must be used within a BarangayProvider');
  }
  return context;
};

interface BarangayProviderProps {
  children: ReactNode;
}

export const BarangayProvider: React.FC<BarangayProviderProps> = ({ children }) => {
  const [barangayInfo, setBarangayInfo] = useState<BarangayInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarangayInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBarangayInfo();
      setBarangayInfo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load barangay information');
      console.error('Error fetching barangay info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarangayInfo();
  }, []);

  const refetch = async () => {
    await fetchBarangayInfo();
  };

  const value: BarangayContextType = {
    barangayInfo,
    loading,
    error,
    refetch,
  };

  return (
    <BarangayContext.Provider value={value}>
      {children}
    </BarangayContext.Provider>
  );
};