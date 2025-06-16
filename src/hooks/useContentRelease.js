import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';

export const useContentRelease = () => {
  const { user } = useAuth();
  const [availableContent, setAvailableContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all available content
  const fetchAvailableContent = useCallback(async () => {
    if (!user) {
      setAvailableContent([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/content/available');
      setAvailableContent(response.data.content);
    } catch (err) {
      console.error('Error fetching available content:', err);
      setError('Failed to load available content');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if specific content is available
  const checkContentAvailability = useCallback(async (contentId) => {
    if (!user) return false;

    try {
      const response = await axios.get(`/api/content/check/${contentId}`);
      return response.data.isAvailable;
    } catch (err) {
      console.error('Error checking content availability:', err);
      return false;
    }
  }, [user]);

  // Fetch available content when user changes
  useEffect(() => {
    fetchAvailableContent();
  }, [user, fetchAvailableContent]);

  return {
    availableContent,
    loading,
    error,
    checkContentAvailability,
    refreshContent: fetchAvailableContent
  };
}; 