import { useState, useEffect } from 'react';
import { getCachedData, setCachedData, deduplicatedFetch } from '../cache/swrCache';

export function useSWRData(key, fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Try IndexedDB cache first
      const cached = await getCachedData(key);
      if (cached && isMounted) {
        setData(cached);
        setLoading(false);
      }

      // 2. Fetch fresh data in background using deduplication
      try {
        const fresh = await deduplicatedFetch(key, fetcher);
        if (isMounted) {
          setData(fresh);
          setError(null);
          setLoading(false);
        }
        // Save fresh response to IndexedDB
        await setCachedData(key, fresh);
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { data, loading, error };
}
