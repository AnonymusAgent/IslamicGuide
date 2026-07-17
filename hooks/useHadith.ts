import { useState, useCallback } from 'react';
import { fetchHadithsByBook, fetchHadithByNumber, COLLECTION_API_MAP } from '../services/hadithService';

export function useHadithCollection(collectionId: string) {
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const loadHadiths = useCallback(async (pageNum: number = 1) => {
    const apiId = COLLECTION_API_MAP[collectionId] || collectionId;
    setLoading(true);
    setError(null);
    try {
      const start = (pageNum - 1) * PAGE_SIZE + 1;
      const end = pageNum * PAGE_SIZE;
      const data = await fetchHadithsByBook(apiId, `${start}-${end}`);
      if (pageNum === 1) {
        setHadiths(data.hadiths || []);
      } else {
        setHadiths(prev => [...prev, ...(data.hadiths || [])]);
      }
      setPage(pageNum);
    } catch (e) {
      setError('Failed to load hadiths. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  const loadMore = () => loadHadiths(page + 1);

  return { hadiths, loading, error, loadHadiths, loadMore, page };
}
