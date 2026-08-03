import { useState, useEffect, useCallback } from 'react';
import {
  fetchSurahWithTranslation, fetchSurah,
  SurahData, SurahWithTranslation, searchQuran, isSurahCached,
} from '../services/quranService';

export function useSurahList() {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  return { loading, error };
}

export function useSurah(surahNumber: number, translationEdition: string = 'en.sahih') {
  const [data, setData] = useState<SurahWithTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineCached, setIsOfflineCached] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const load = useCallback(async () => {
    if (!surahNumber || surahNumber < 1 || surahNumber > 114) return;
    setLoading(true);
    setError(null);

    // Check if already cached for UI indicator
    const cached = await isSurahCached(surahNumber, translationEdition);
    setIsOfflineCached(cached);

    const MAX_ATTEMPTS = 3;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await fetchSurahWithTranslation(surahNumber, translationEdition);
        if (!result?.arabic?.ayahs?.length) {
          throw new Error('Empty surah data received');
        }
        setData(result);
        setError(null);
        setIsOfflineCached(true);
        setLoading(false);
        return;
      } catch (e: any) {
        lastError = attempt < MAX_ATTEMPTS
          ? `Loading… (attempt ${attempt}/${MAX_ATTEMPTS})`
          : 'Could not load Surah. Tap retry or check your connection.';

        if (attempt < MAX_ATTEMPTS) {
          // Wait before retry: 1s, 2s
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    }

    setError(lastError);
    setLoading(false);
  }, [surahNumber, translationEdition, retryCount]);

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => {
    setRetryCount(c => c + 1);
  }, []);

  return { data, loading, error, reload, isOfflineCached };
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
