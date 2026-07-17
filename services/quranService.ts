const ALQURAN_BASE = 'https://api.alquran.cloud/v1';
const QURANENC_BASE = 'https://quranenc.com/api/v1';

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  transliteration?: string;
  juz: number;
  page: number;
  sajda: boolean;
  hizbQuarter: number;
  ruku?: number;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export interface SurahWithTranslation {
  arabic: SurahData;
  translation: SurahData;
}

const cache: Record<string, any> = {};

async function fetchWithCache(url: string, cacheKey: string) {
  if (cache[cacheKey]) return cache[cacheKey];
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  const data = await response.json();
  cache[cacheKey] = data;
  return data;
}

export async function fetchSurah(surahNumber: number, edition: string = 'quran-uthmani'): Promise<SurahData> {
  const key = `surah_${surahNumber}_${edition}`;
  const data = await fetchWithCache(`${ALQURAN_BASE}/surah/${surahNumber}/${edition}`, key);
  return data.data;
}

export async function fetchSurahWithTranslation(
  surahNumber: number,
  translationEdition: string = 'en.sahih'
): Promise<SurahWithTranslation> {
  const [arabic, translation] = await Promise.all([
    fetchSurah(surahNumber, 'quran-uthmani'),
    fetchSurah(surahNumber, translationEdition),
  ]);
  return { arabic, translation };
}

export async function fetchAyah(surahNumber: number, ayahNumber: number, edition: string = 'quran-uthmani'): Promise<Ayah> {
  const key = `ayah_${surahNumber}_${ayahNumber}_${edition}`;
  const data = await fetchWithCache(`${ALQURAN_BASE}/ayah/${surahNumber}:${ayahNumber}/${edition}`, key);
  return data.data;
}

export async function searchQuran(query: string, language: string = 'en'): Promise<any[]> {
  try {
    const response = await fetch(`${ALQURAN_BASE}/search/${encodeURIComponent(query)}/all/${language}`);
    const data = await response.json();
    return data.data?.matches || [];
  } catch {
    return [];
  }
}

export async function fetchJuz(juzNumber: number, edition: string = 'quran-uthmani'): Promise<Ayah[]> {
  const key = `juz_${juzNumber}_${edition}`;
  const data = await fetchWithCache(`${ALQURAN_BASE}/juz/${juzNumber}/${edition}`, key);
  return data.data?.ayahs || [];
}

export async function fetchPage(pageNumber: number, edition: string = 'quran-uthmani'): Promise<Ayah[]> {
  const key = `page_${pageNumber}_${edition}`;
  const data = await fetchWithCache(`${ALQURAN_BASE}/page/${pageNumber}/${edition}`, key);
  return data.data?.ayahs || [];
}

export function getAudioUrl(surahNumber: number, reciterIdentifier: string = 'Alafasy_128kbps'): string {
  const surahStr = String(surahNumber).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/${reciterIdentifier}/${surahStr}.mp3`;
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterId: string = 'ar.alafasy'): string {
  const verseKey = `${String(surahNumber).padStart(3, '0')}${String(ayahNumber).padStart(3, '0')}`;
  return `https://verses.quran.com/${reciterId}/${verseKey}.mp3`;
}

export async function fetchWordByWord(surahNumber: number, ayahNumber: number): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.qurancdn.com/api/qdc/verses/by_key/${surahNumber}:${ayahNumber}?words=true&word_fields=text_uthmani,text_transliteration,translation`
    );
    const data = await response.json();
    return data.verse?.words || [];
  } catch {
    return [];
  }
}
