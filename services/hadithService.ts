const HADITH_API_BASE = 'https://api.hadith.gading.dev';

export interface HadithAPIBook {
  id: string;
  name: string;
  available: number;
}

export interface HadithAPIItem {
  number: number;
  arab: string;
  id: string;
}

export interface HadithAPIResponse {
  name: string;
  id: string;
  available: number;
  requested: number;
  hadiths: HadithAPIItem[];
}

const BOOKS = ['abu-dawud', 'ahmad', 'bukhari', 'darimi', 'ibnu-majah', 'malik', 'muslim', 'nasai', 'tirmidzi'];

const hadithCache: Record<string, any> = {};

export async function fetchHadithBooks(): Promise<HadithAPIBook[]> {
  try {
    const response = await fetch(`${HADITH_API_BASE}/books`);
    const data = await response.json();
    return data.data || [];
  } catch {
    // Return fallback data
    return BOOKS.map(id => ({ id, name: id, available: 100 }));
  }
}

export async function fetchHadithsByBook(bookId: string, range: string = '1-20'): Promise<HadithAPIResponse> {
  const cacheKey = `${bookId}_${range}`;
  if (hadithCache[cacheKey]) return hadithCache[cacheKey];
  
  try {
    const response = await fetch(`${HADITH_API_BASE}/books/${bookId}?range=${range}`);
    const data = await response.json();
    hadithCache[cacheKey] = data.data;
    return data.data;
  } catch {
    throw new Error('Failed to fetch hadiths');
  }
}

export async function fetchHadithByNumber(bookId: string, number: number): Promise<HadithAPIItem | null> {
  try {
    const response = await fetch(`${HADITH_API_BASE}/books/${bookId}/${number}`);
    const data = await response.json();
    return data.data || null;
  } catch {
    return null;
  }
}

// Map our collection IDs to API IDs
export const COLLECTION_API_MAP: Record<string, string> = {
  bukhari: 'bukhari',
  muslim: 'muslim',
  abudawood: 'abu-dawud',
  tirmidhi: 'tirmidzi',
  nasai: 'nasai',
  ibnmajah: 'ibnu-majah',
  malik: 'malik',
  ahmad: 'ahmad',
};
