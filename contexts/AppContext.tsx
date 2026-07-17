import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors } from '../constants/theme';

export interface Bookmark {
  id: string;
  type: 'quran' | 'hadith' | 'dua';
  reference: string;
  title: string;
  subtitle?: string;
  arabic?: string;
  timestamp: number;
}

export interface Note {
  id: string;
  type: 'quran' | 'hadith' | 'dua';
  reference: string;
  content: string;
  timestamp: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface FastingDay {
  date: string; // YYYY-MM-DD
  fasted: boolean;
  note?: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  arabicFontSize: number;
  translationFontSize: number;
  selectedTranslation: string;
  selectedReciter: string;
  showTransliteration: boolean;
  showTranslation: boolean;
  showWordByWord: boolean;
  prayerCalculationMethod: number;
  madhab: number;
  language: string;
  autoPlayNext: boolean;
  repeatMode: 'none' | 'ayah' | 'surah';
  quranViewMode: 'surah' | 'juz' | 'page';
  readingProgress: Record<string, number>; // surahNumber -> lastAyah
}

interface AppContextType {
  // Theme
  colors: ReturnType<typeof getColors>;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (reference: string) => boolean;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'timestamp'>) => void;
  removeNote: (id: string) => void;

  // Reading
  lastRead: { surahNumber: number; ayahNumber: number } | null;
  setLastRead: (data: { surahNumber: number; ayahNumber: number }) => void;
  updateReadingProgress: (surahNumber: number, ayahNumber: number, totalAyahs: number) => void;

  // Tasbeeh
  tasbeehCount: number;
  setTasbeehCount: (count: number) => void;
  dailyTasbeehHistory: { date: string; count: number }[];

  // Duas
  favoritedDuas: string[];
  toggleFavoriteDua: (duaId: string) => void;

  // AI Chat
  aiMessages: AIMessage[];
  addAIMessage: (msg: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  clearAIChat: () => void;

  // Fasting Tracker
  fastingDays: FastingDay[];
  toggleFastingDay: (date: string) => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  arabicFontSize: 24,
  translationFontSize: 16,
  selectedTranslation: 'en.sahih',
  selectedReciter: 'ar.alafasy',
  showTransliteration: true,
  showTranslation: true,
  showWordByWord: false,
  prayerCalculationMethod: 3,
  madhab: 0,
  language: 'en',
  autoPlayNext: true,
  repeatMode: 'none',
  quranViewMode: 'surah',
  readingProgress: {},
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [lastRead, setLastReadState] = useState<{ surahNumber: number; ayahNumber: number } | null>(null);
  const [tasbeehCount, setTasbeehCountState] = useState(0);
  const [dailyTasbeehHistory, setDailyTasbeehHistory] = useState<{ date: string; count: number }[]>([]);
  const [favoritedDuas, setFavoritedDuas] = useState<string[]>([]);
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([]);
  const [fastingDays, setFastingDays] = useState<FastingDay[]>([]);

  const colors = getColors(settings.theme);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const keys = [
        'app_settings', 'bookmarks', 'notes', 'last_read',
        'tasbeeh_history', 'favorite_duas', 'ai_messages', 'fasting_days',
      ];
      const results = await AsyncStorage.multiGet(keys);
      const map = Object.fromEntries(results.map(([k, v]) => [k, v]));

      if (map['app_settings']) setSettings({ ...defaultSettings, ...JSON.parse(map['app_settings']) });
      if (map['bookmarks']) setBookmarks(JSON.parse(map['bookmarks']));
      if (map['notes']) setNotes(JSON.parse(map['notes']));
      if (map['last_read']) setLastReadState(JSON.parse(map['last_read']));
      if (map['tasbeeh_history']) setDailyTasbeehHistory(JSON.parse(map['tasbeeh_history']));
      if (map['favorite_duas']) setFavoritedDuas(JSON.parse(map['favorite_duas']));
      if (map['ai_messages']) setAIMessages(JSON.parse(map['ai_messages']));
      if (map['fasting_days']) setFastingDays(JSON.parse(map['fasting_days']));
    } catch { /* use defaults */ }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
  };

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    const newBookmark: Bookmark = { ...bookmark, id: `${Date.now()}_${Math.random()}`, timestamp: Date.now() };
    const updated = [newBookmark, ...bookmarks];
    setBookmarks(updated);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const removeBookmark = async (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id && b.reference !== id);
    setBookmarks(updated);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const isBookmarked = (reference: string) => bookmarks.some(b => b.reference === reference);

  const addNote = async (note: Omit<Note, 'id' | 'timestamp'>) => {
    const newNote: Note = { ...note, id: `${Date.now()}_${Math.random()}`, timestamp: Date.now() };
    const updated = [newNote, ...notes];
    setNotes(updated);
    await AsyncStorage.setItem('notes', JSON.stringify(updated));
  };

  const removeNote = async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    await AsyncStorage.setItem('notes', JSON.stringify(updated));
  };

  const setLastRead = async (data: { surahNumber: number; ayahNumber: number }) => {
    setLastReadState(data);
    await AsyncStorage.setItem('last_read', JSON.stringify(data));
  };

  const updateReadingProgress = async (surahNumber: number, ayahNumber: number, totalAyahs: number) => {
    const newProgress = { ...settings.readingProgress, [surahNumber]: ayahNumber };
    await updateSettings({ readingProgress: newProgress });
    await setLastRead({ surahNumber, ayahNumber });
  };

  const setTasbeehCount = async (count: number) => {
    setTasbeehCountState(count);
    const today = new Date().toISOString().split('T')[0];
    const updated = [...dailyTasbeehHistory];
    const idx = updated.findIndex(h => h.date === today);
    if (idx >= 0) updated[idx] = { date: today, count };
    else updated.unshift({ date: today, count });
    const trimmed = updated.slice(0, 30);
    setDailyTasbeehHistory(trimmed);
    await AsyncStorage.setItem('tasbeeh_history', JSON.stringify(trimmed));
  };

  const toggleFavoriteDua = async (duaId: string) => {
    const updated = favoritedDuas.includes(duaId)
      ? favoritedDuas.filter(id => id !== duaId)
      : [...favoritedDuas, duaId];
    setFavoritedDuas(updated);
    await AsyncStorage.setItem('favorite_duas', JSON.stringify(updated));
  };

  const addAIMessage = async (msg: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMsg: AIMessage = { ...msg, id: `${Date.now()}_${Math.random()}`, timestamp: Date.now() };
    const updated = [...aiMessages, newMsg];
    setAIMessages(updated);
    // Keep only last 100 messages
    const trimmed = updated.slice(-100);
    await AsyncStorage.setItem('ai_messages', JSON.stringify(trimmed));
  };

  const clearAIChat = async () => {
    setAIMessages([]);
    await AsyncStorage.removeItem('ai_messages');
  };

  const toggleFastingDay = async (date: string) => {
    const existing = fastingDays.find(d => d.date === date);
    let updated: FastingDay[];
    if (existing) {
      updated = fastingDays.map(d => d.date === date ? { ...d, fasted: !d.fasted } : d);
    } else {
      updated = [...fastingDays, { date, fasted: true }];
    }
    setFastingDays(updated);
    await AsyncStorage.setItem('fasting_days', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{
      colors,
      settings,
      updateSettings,
      bookmarks,
      addBookmark,
      removeBookmark,
      isBookmarked,
      notes,
      addNote,
      removeNote,
      lastRead,
      setLastRead,
      updateReadingProgress,
      tasbeehCount,
      setTasbeehCount,
      dailyTasbeehHistory,
      favoritedDuas,
      toggleFavoriteDua,
      aiMessages,
      addAIMessage,
      clearAIChat,
      fastingDays,
      toggleFastingDay,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
