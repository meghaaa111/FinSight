import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

const useHealth = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await checkHealth();
        setIsHealthy(response.status === 'healthy');
      } catch (error) {
        setIsHealthy(false);
      } finally {
        setLoading(false);
      }
    };

    // Check immediately
    checkApiHealth();

    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isHealthy, loading };
};

export default useHealth;
