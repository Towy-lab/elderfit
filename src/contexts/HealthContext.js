// src/contexts/HealthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSubscription } from './SubscriptionContext';
import { getHealthData } from '../services/api';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const { user } = useAuth();
  const { hasAccess } = useSubscription();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!user || !hasAccess('elite')) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getHealthData();
        setHealthData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching health data:', err);
        setError('Failed to load health data');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [user, hasAccess]);

  const value = {
    healthData,
    loading,
    error,
    refreshHealthData: async () => {
      if (!user || !hasAccess('elite')) return;
      
      try {
        setLoading(true);
        const data = await getHealthData();
        setHealthData(data);
        setError(null);
      } catch (err) {
        console.error('Error refreshing health data:', err);
        setError('Failed to refresh health data');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export default HealthContext; 