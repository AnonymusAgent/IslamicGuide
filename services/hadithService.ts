/**
 * Hadith Service — Hybrid online/offline with AsyncStorage caching.
 * Primary source: api.hadith.gading.dev (Kutub al-Sittah, Arabic + ID text)
 * Fallback: Offline database (English, curated, always available)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const HADITH_API = 'https://api.hadith.gading.dev';
const CACHE_PREFIX = 'hadith_v2_';
const PAGE_SIZE = 30;
const API_TIMEOUT = 10000;

// ─── Collection mapping ───────────────────────────────────────────────────────
export const COLLECTION_API_MAP: Record<string, string> = {
  bukhari: 'bukhari',
  muslim: 'muslim',
  abudawood: 'abu-dawud',
  tirmidhi: 'tirmidzi',
  nasai: 'nasai',
  ibnmajah: 'ibnu-majah',
  malik: 'malik',
  ahmad: 'ahmad',
  // Collections served fully from offline DB
  nawawi40: '',
  riyadussaliheen: '',
  bulugh: '',
};

// Known total hadith counts per collection (from official sources)
export const COLLECTION_TOTAL: Record<string, number> = {
  bukhari: 7563,
  muslim: 7470,
  abudawood: 5274,
  tirmidhi: 3956,
  nasai: 5758,
  ibnmajah: 4341,
  malik: 1832,
  ahmad: 4305,
  nawawi40: 42,
  riyadussaliheen: 1896,
  bulugh: 1358,
};

export interface HadithAPIItem {
  number: number;
  arab: string;
  id: string;
  collection?: string;
}

export interface HadithAPIResponse {
  name: string;
  id: string;
  available: number;
  requested: number;
  hadiths: HadithAPIItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

function cacheKey(collection: string, page: number): string {
  return `${CACHE_PREFIX}${collection}_p${page}`;
}

async function readCache(key: string): Promise<HadithAPIItem[] | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function writeCache(key: string, data: HadithAPIItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch { /* silent */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch a page of hadiths from the API with persistent caching.
 * Returns null if network is unavailable.
 */
export async function fetchHadithPage(
  collectionId: string,
  page: number
): Promise<HadithAPIItem[] | null> {
  const apiBook = COLLECTION_API_MAP[collectionId];
  if (!apiBook) return null; // Offline-only collection

  const key = cacheKey(collectionId, page);
  const cached = await readCache(key);
  if (cached && cached.length > 0) return cached;

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = start + PAGE_SIZE - 1;

  try {
    const res = await fetchWithTimeout(
      `${HADITH_API}/books/${apiBook}?range=${start}-${end}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const hadiths: HadithAPIItem[] = (json?.data?.hadiths || []).map(
      (h: any) => ({ ...h, collection: collectionId })
    );
    if (hadiths.length > 0) {
      await writeCache(key, hadiths);
    }
    return hadiths;
  } catch {
    return null;
  }
}

export function totalPages(collectionId: string): number {
  const total = COLLECTION_TOTAL[collectionId] || 100;
  return Math.ceil(total / PAGE_SIZE);
}

export async function clearHadithCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const hadithKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(hadithKeys);
  } catch { /* silent */ }
}
