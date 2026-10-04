import { useState, useCallback } from 'react';
import { getOfflineHadiths, searchOfflineHadiths, OfflineHadith } from '../constants/offlineHadithDb';
import { fetchHadithPage, getCollectionTotal } from '../services/hadithService';

export function useHadith(collectionId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offlineHadiths = getOfflineHadiths(collectionId);
  const totalKnown = getCollectionTotal(collectionId) || offlineHadiths.length;

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchHadithPage(collectionId, page);
      if (!items?.length) setError('Hadith data is unavailable. Check your connection and retry.');
      return items;
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch hadiths');
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  return {
    offlineHadiths,
    totalKnown,
    loading,
    error,
    fetchPage,
  };
}

export function useHadithSearch() {
  const [results, setResults] = useState<OfflineHadith[]>([]);
  const [query, setQuery] = useState('');

  const search = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setResults(searchOfflineHadiths(q));
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { results, query, search, clear };
}
