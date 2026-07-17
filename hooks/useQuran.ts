import { useState, useEffect, useCallback } from 'react';
import { fetchSurahWithTranslation, fetchSurah, SurahData, SurahWithTranslation, searchQuran } from '../services/quranService';

export function useSurahList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return { loading, error };
}

export function useSurah(surahNumber: number, translationEdition: string = 'en.sahih') {
  const [data, setData] = useState<SurahWithTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!surahNumber) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSurahWithTranslation(surahNumber, translationEdition);
      setData(result);
    } catch (e) {
      setError('Failed to load Surah. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [surahNumber, translationEdition]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

export function useQuranSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setQuery(q);
    setLoading(true);
    try {
      const found = await searchQuran(q);
      setResults(found);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, query, search };
}
