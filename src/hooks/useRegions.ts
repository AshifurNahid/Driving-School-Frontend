import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { Region } from '@/types/region';

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/regions')
      .then(res => {
        setRegions(res.data?.data || []);
        setError(null);
      })
      .catch(err => {
        setError(err?.response?.data?.status?.message || err.message);
        setRegions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { regions, loading, error };
}
