import { useState, useEffect, useCallback } from 'react';
import { checkHealth, getCrops, analyze } from '../api/agentApi.js';

/**
 * Custom React hook for Agri Microclimate Agent state and API interactions.
 */
export function useAgent() {
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    location: 'Phoenix, AZ',
    latitude: 33.4484,
    longitude: -112.0740,
    crop: '',
    crop_stage: 'flowering',
    question: 'Assess tomato heat risk in Phoenix during flowering.',
  });

  // Results & Analysis State
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // 1. Check API Health & Fetch Dynamic Crops on Mount
  useEffect(() => {
    let isMounted = true;

    async function init() {
      // Health Check
      try {
        const health = await checkHealth();
        if (isMounted) {
          if (health && health.status === 'ok') {
            setApiStatus('connected');
          } else {
            setApiStatus('disconnected');
          }
        }
      } catch (err) {
        if (isMounted) {
          setApiStatus('disconnected');
        }
      }

      // Fetch Crops
      try {
        setLoadingCrops(true);
        const cropList = await getCrops();
        if (isMounted) {
          setCrops(cropList);
          if (cropList.length > 0) {
            setFormData((prev) => ({
              ...prev,
              crop: prev.crop && cropList.includes(prev.crop) ? prev.crop : cropList[0],
            }));
          }
        }
      } catch (err) {
        if (isMounted) {
          // Fallback if crops endpoint fails
          setCrops(['Almond', 'Corn', 'Cotton', 'Grape', 'Tomato']);
          setFormData((prev) => ({ ...prev, crop: prev.crop || 'Tomato' }));
        }
      } finally {
        if (isMounted) {
          setLoadingCrops(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Form field change handler
  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error on input change
    setError(null);
  }, []);

  // Submit /analyze request
  const submitAnalysis = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      if (loading) return;

      setError(null);
      setLoading(true);

      try {
        // Construct precise backend payload
        const payload = {
          location: formData.location ? formData.location.trim() : '',
          crop: formData.crop,
          question: formData.question ? formData.question.trim() : '',
        };

        if (formData.crop_stage && formData.crop_stage.trim()) {
          payload.crop_stage = formData.crop_stage.trim();
        }

        // Forward explicit coordinates if both latitude and longitude are valid numbers
        const hasLat = formData.latitude !== null && formData.latitude !== undefined && !isNaN(Number(formData.latitude));
        const hasLon = formData.longitude !== null && formData.longitude !== undefined && !isNaN(Number(formData.longitude));

        if (hasLat && hasLon) {
          payload.latitude = Number(formData.latitude);
          payload.longitude = Number(formData.longitude);
        }

        const result = await analyze(payload);

        setAnalysisResult(result);

        // Update form coordinates if backend returns geocoded/location info
        if (result && result.location) {
          if (result.location.latitude !== null && result.location.longitude !== null) {
            setFormData((prev) => ({
              ...prev,
              latitude: result.location.latitude,
              longitude: result.location.longitude,
            }));
          }
        }
      } catch (err) {
        // err is normalized by agentApi.js normalizeApiError
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [formData, loading]
  );

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    apiStatus,
    crops,
    loadingCrops,
    formData,
    analysisResult,
    loading,
    error,
    auditModalOpen,
    setAuditModalOpen,
    handleFormChange,
    submitAnalysis,
    dismissError,
  };
}

export default useAgent;
