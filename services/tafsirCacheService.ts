/**
 * Tafsir Cache Service — Pre-caches Tafsir Ibn Kathir for top surahs
 * in the background using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchSurah } from './quranService';

const TAFSIR_CACHE_PREFIX = 'tafsir_v2_';
const TAFSIR_PROGRESS_KEY = 'tafsir_precache_progress';

export const TOP_SURAHS_FOR_TAFSIR = [1, 2, 3, 4, 5, 6, 7, 36, 55, 67];
const TAFSIR_EDITIONS = ['en.ibn-katheer', 'en.maarifulquran'];

export interface TafsirCacheStatus {
  surahNumber: number;
  cached: boolean;
  editions: Record<string, boolean>;
}

export async function isTafsirCached(
  surahNumber: number,
  edition: string = 'en.ibn-katheer'
): Promise<boolean> {
  try {
    const key = `${TAFSIR_CACHE_PREFIX}${surahNumber}_${edition}`;
    const val = await AsyncStorage.getItem(key);
    return val !== null;
  } catch {
    return false;
  }
}

export async function getTafsirFromCache(
  surahNumber: number,
  edition: string
): Promise<any[] | null> {
  try {
    const key = `${TAFSIR_CACHE_PREFIX}${surahNumber}_${edition}`;
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveTafsirToCache(
  surahNumber: number,
  edition: string,
  data: any[]
): Promise<void> {
  try {
    const key = `${TAFSIR_CACHE_PREFIX}${surahNumber}_${edition}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch { /* silent */ }
}

export async function getTopSurahCacheStatus(): Promise<TafsirCacheStatus[]> {
  const results: TafsirCacheStatus[] = [];
  for (const surahNumber of TOP_SURAHS_FOR_TAFSIR) {
    const editionStatus: Record<string, boolean> = {};
    let allCached = true;
    for (const edition of TAFSIR_EDITIONS) {
      const cached = await isTafsirCached(surahNumber, edition);
      editionStatus[edition] = cached;
      if (!cached) allCached = false;
    }
    results.push({ surahNumber, cached: allCached, editions: editionStatus });
  }
  return results;
}

type ProgressCallback = (surahNumber: number, progress: number, total: number) => void;

/**
 * Pre-cache Tafsir for top 10 surahs in the background.
 * Pass an optional progress callback to track download status.
 */
export function preCacheTafsirBackground(
  onProgress?: ProgressCallback
): void {
  const total = TOP_SURAHS_FOR_TAFSIR.length * TAFSIR_EDITIONS.length;
  let completed = 0;

  (async () => {
    for (const surahNumber of TOP_SURAHS_FOR_TAFSIR) {
      for (const edition of TAFSIR_EDITIONS) {
        // Skip if already cached
        if (await isTafsirCached(surahNumber, edition)) {
          completed++;
          onProgress?.(surahNumber, completed, total);
          continue;
        }

        try {
          // Fetch both Arabic + tafsir edition together
          const [arabicData, tafsirData] = await Promise.all([
            fetchSurah(surahNumber, 'quran-uthmani'),
            fetchSurah(surahNumber, edition),
          ]);

          const merged = arabicData.ayahs.map((ayah, i) => ({
            numberInSurah: ayah.numberInSurah,
            arabicText: ayah.text,
            tafsirText: tafsirData.ayahs[i]?.text ?? '',
          }));

          await saveTafsirToCache(surahNumber, edition, merged);
        } catch { /* silent — best effort */ }

        completed++;
        onProgress?.(surahNumber, completed, total);

        // Rate limit: 300ms between requests
        await new Promise(r => setTimeout(r, 300));
      }

      // Save progress checkpoint
      await AsyncStorage.setItem(
        TAFSIR_PROGRESS_KEY,
        JSON.stringify({ completed, total, lastSurah: surahNumber, ts: Date.now() })
      );
    }
  })();
}

export async function clearTafsirCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const tafsirKeys = keys.filter(k => k.startsWith(TAFSIR_CACHE_PREFIX));
    await AsyncStorage.multiRemove(tafsirKeys);
    await AsyncStorage.removeItem(TAFSIR_PROGRESS_KEY);
  } catch { /* silent */ }
}
