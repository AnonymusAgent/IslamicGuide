import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { getColors, ThemeColors } from '../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
}

export interface FastingDay {
  date: string; // YYYY-MM-DD
  fasted: boolean;
  note?: string;
}

export interface NotificationSettings {
  fajrReminder: boolean;
  dhuhrReminder: boolean;
  asrReminder: boolean;
  maghribReminder: boolean;
  ishaReminder: boolean;
  dailyAyah: boolean;
  dailyHadith: boolean;
  morningAzkar: boolean;
  eveningAzkar: boolean;
  fridayReminder: boolean;
  tahajjudReminder: boolean;
  fastingReminder: boolean;
  reminderMinutesBefore: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  arabicFontSize: number;
  translationFontSize: number;
  selectedTranslation: string;
  selectedReciter: string;
  showTransliteration: boolean;
  showTranslation: boolean;
  showWordByWord: boolean;
  showTajweed: boolean;
  prayerCalculationMethod: number;
  madhab: number;
  language: string;
  autoPlayNext: boolean;
  repeatMode: 'none' | 'ayah' | 'surah';
  quranViewMode: 'surah' | 'juz' | 'page';
  readingProgress: Record<string, number>; // surahNumber -> lastAyah
  notifications: NotificationSettings;
  hapticFeedback: boolean;
  highContrastMode: boolean;
  textScaling: number; // 0.8 – 1.4
}

// ─── Context Interface ─────────────────────────────────────────────────────────

interface AppContextType {
  colors: ThemeColors;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;

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
  aiConversations: AIConversation[];
  createConversation: (title?: string) => string;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Fasting Tracker
  fastingDays: FastingDay[];
  toggleFastingDay: (date: string) => void;

  // Asma-ul-Husna Favorites
  asmaFavorites: number[];
  toggleAsmaFavorite: (num: number) => void;

  // Islamic Names Favorites
  nameFavorites: string[];
  toggleNameFavorite: (id: string) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultNotifications: NotificationSettings = {
  fajrReminder: false,
  dhuhrReminder: false,
  asrReminder: false,
  maghribReminder: false,
  ishaReminder: false,
  dailyAyah: false,
  dailyHadith: false,
  morningAzkar: false,
  eveningAzkar: false,
  fridayReminder: false,
  tahajjudReminder: false,
  fastingReminder: false,
  reminderMinutesBefore: 10,
};

const defaultSettings: AppSettings = {
  theme: 'dark',
  arabicFontSize: 26,
  translationFontSize: 16,
  selectedTranslation: 'en.sahih',
  selectedReciter: 'ar.alafasy',
  showTransliteration: true,
  showTranslation: true,
  showWordByWord: false,
  showTajweed: false,
  prayerCalculationMethod: 3,
  madhab: 0,
  language: 'en',
  autoPlayNext: true,
  repeatMode: 'none',
  quranViewMode: 'surah',
  readingProgress: {},
  notifications: defaultNotifications,
  hapticFeedback: true,
  highContrastMode: false,
  textScaling: 1.0,
};

// ─── Context & Provider ────────────────────────────────────────────────────────

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
  const [aiConversations, setAIConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [fastingDays, setFastingDays] = useState<FastingDay[]>([]);
  const [asmaFavorites, setAsmaFavorites] = useState<number[]>([]);
  const [nameFavorites, setNameFavorites] = useState<string[]>([]);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  // Resolve effective theme
  const effectiveTheme = settings.theme === 'system'
    ? (systemColorScheme === 'light' ? 'light' : 'dark')
    : settings.theme;

  const colors = getColors(effectiveTheme as 'dark' | 'light');

  // Listen to system theme changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  // Load all persisted data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const keys = [
        'app_settings_v2', 'bookmarks', 'notes', 'last_read',
        'tasbeeh_history', 'favorite_duas', 'ai_messages', 'ai_conversations',
        'fasting_days', 'asma_favorites', 'name_favorites',
      ];
      const results = await AsyncStorage.multiGet(keys);
      const map = Object.fromEntries(results.map(([k, v]) => [k, v]));

      if (map['app_settings_v2']) {
        const saved = JSON.parse(map['app_settings_v2']);
        setSettings({ ...defaultSettings, ...saved, notifications: { ...defaultNotifications, ...saved.notifications } });
      }
      if (map['bookmarks']) setBookmarks(JSON.parse(map['bookmarks']));
      if (map['notes']) setNotes(JSON.parse(map['notes']));
      if (map['last_read']) setLastReadState(JSON.parse(map['last_read']));
      if (map['tasbeeh_history']) setDailyTasbeehHistory(JSON.parse(map['tasbeeh_history']));
      if (map['favorite_duas']) setFavoritedDuas(JSON.parse(map['favorite_duas']));
      if (map['ai_messages']) setAIMessages(JSON.parse(map['ai_messages']));
      if (map['ai_conversations']) {
        const convs = JSON.parse(map['ai_conversations']);
        setAIConversations(convs);
        if (convs.length > 0) setActiveConversationId(convs[0].id);
      }
      if (map['fasting_days']) setFastingDays(JSON.parse(map['fasting_days']));
      if (map['asma_favorites']) setAsmaFavorites(JSON.parse(map['asma_favorites']));
      if (map['name_favorites']) setNameFavorites(JSON.parse(map['name_favorites']));
    } catch { /* use defaults */ }
  };

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await AsyncStorage.setItem('app_settings_v2', JSON.stringify(newSettings));
  }, [settings]);

  // ── Bookmarks ────────────────────────────────────────────────────────────────

  const addBookmark = useCallback(async (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    const newBookmark: Bookmark = { ...bookmark, id: `bm_${Date.now()}`, timestamp: Date.now() };
    const updated = [newBookmark, ...bookmarks];
    setBookmarks(updated);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
  }, [bookmarks]);

  const removeBookmark = useCallback(async (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id && b.reference !== id);
    setBookmarks(updated);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
  }, [bookmarks]);

  const isBookmarked = useCallback((reference: string) =>
    bookmarks.some(b => b.reference === reference), [bookmarks]);

  // ── Notes ────────────────────────────────────────────────────────────────────

  const addNote = useCallback(async (note: Omit<Note, 'id' | 'timestamp'>) => {
    const newNote: Note = { ...note, id: `note_${Date.now()}`, timestamp: Date.now() };
    const updated = [newNote, ...notes];
    setNotes(updated);
    await AsyncStorage.setItem('notes', JSON.stringify(updated));
  }, [notes]);

  const removeNote = useCallback(async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    await AsyncStorage.setItem('notes', JSON.stringify(updated));
  }, [notes]);

  // ── Reading ──────────────────────────────────────────────────────────────────

  const setLastRead = useCallback(async (data: { surahNumber: number; ayahNumber: number }) => {
    setLastReadState(data);
    await AsyncStorage.setItem('last_read', JSON.stringify(data));
  }, []);

  const updateReadingProgress = useCallback(async (surahNumber: number, ayahNumber: number, _totalAyahs: number) => {
    const newProgress = { ...settings.readingProgress, [surahNumber]: ayahNumber };
    await updateSettings({ readingProgress: newProgress });
    await setLastRead({ surahNumber, ayahNumber });
  }, [settings.readingProgress, updateSettings, setLastRead]);

  // ── Tasbeeh ──────────────────────────────────────────────────────────────────

  const setTasbeehCount = useCallback(async (count: number) => {
    setTasbeehCountState(count);
    const today = new Date().toISOString().split('T')[0];
    const updated = [...dailyTasbeehHistory];
    const idx = updated.findIndex(h => h.date === today);
    if (idx >= 0) updated[idx] = { date: today, count };
    else updated.unshift({ date: today, count });
    const trimmed = updated.slice(0, 60);
    setDailyTasbeehHistory(trimmed);
    await AsyncStorage.setItem('tasbeeh_history', JSON.stringify(trimmed));
  }, [dailyTasbeehHistory]);

  // ── Duas ─────────────────────────────────────────────────────────────────────

  const toggleFavoriteDua = useCallback(async (duaId: string) => {
    const updated = favoritedDuas.includes(duaId)
      ? favoritedDuas.filter(id => id !== duaId)
      : [...favoritedDuas, duaId];
    setFavoritedDuas(updated);
    await AsyncStorage.setItem('favorite_duas', JSON.stringify(updated));
  }, [favoritedDuas]);

  // ── AI Chat ──────────────────────────────────────────────────────────────────

  const addAIMessage = useCallback(async (msg: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMsg: AIMessage = { ...msg, id: `ai_${Date.now()}_${Math.random().toString(36).slice(2)}`, timestamp: Date.now() };
    const updated = [...aiMessages, newMsg].slice(-200);
    setAIMessages(updated);
    await AsyncStorage.setItem('ai_messages', JSON.stringify(updated));
  }, [aiMessages]);

  const clearAIChat = useCallback(async () => {
    setAIMessages([]);
    await AsyncStorage.removeItem('ai_messages');
  }, []);

  const createConversation = useCallback((title?: string): string => {
    const id = `conv_${Date.now()}`;
    const now = Date.now();
    const conv: AIConversation = {
      id,
      title: title || `Chat ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    const updated = [conv, ...aiConversations].slice(0, 50);
    setAIConversations(updated);
    setActiveConversationId(id);
    AsyncStorage.setItem('ai_conversations', JSON.stringify(updated));
    return id;
  }, [aiConversations]);

  const updateConversationTitle = useCallback(async (id: string, title: string) => {
    const updated = aiConversations.map(c => c.id === id ? { ...c, title } : c);
    setAIConversations(updated);
    await AsyncStorage.setItem('ai_conversations', JSON.stringify(updated));
  }, [aiConversations]);

  const deleteConversation = useCallback(async (id: string) => {
    const updated = aiConversations.filter(c => c.id !== id);
    setAIConversations(updated);
    if (activeConversationId === id) setActiveConversationId(updated[0]?.id || null);
    await AsyncStorage.setItem('ai_conversations', JSON.stringify(updated));
  }, [aiConversations, activeConversationId]);

  const pinConversation = useCallback(async (id: string) => {
    const updated = aiConversations.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c);
    setAIConversations(updated);
    await AsyncStorage.setItem('ai_conversations', JSON.stringify(updated));
  }, [aiConversations]);

  // ── Fasting ──────────────────────────────────────────────────────────────────

  const toggleFastingDay = useCallback(async (date: string) => {
    const existing = fastingDays.find(d => d.date === date);
    const updated = existing
      ? fastingDays.map(d => d.date === date ? { ...d, fasted: !d.fasted } : d)
      : [...fastingDays, { date, fasted: true }];
    setFastingDays(updated);
    await AsyncStorage.setItem('fasting_days', JSON.stringify(updated));
  }, [fastingDays]);

  // ── Asma / Names Favorites ────────────────────────────────────────────────────

  const toggleAsmaFavorite = useCallback(async (num: number) => {
    const updated = asmaFavorites.includes(num)
      ? asmaFavorites.filter(n => n !== num)
      : [...asmaFavorites, num];
    setAsmaFavorites(updated);
    await AsyncStorage.setItem('asma_favorites', JSON.stringify(updated));
  }, [asmaFavorites]);

  const toggleNameFavorite = useCallback(async (id: string) => {
    const updated = nameFavorites.includes(id)
      ? nameFavorites.filter(n => n !== id)
      : [...nameFavorites, id];
    setNameFavorites(updated);
    await AsyncStorage.setItem('name_favorites', JSON.stringify(updated));
  }, [nameFavorites]);

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
      aiConversations,
      createConversation,
      updateConversationTitle,
      deleteConversation,
      pinConversation,
      activeConversationId,
      setActiveConversationId,
      fastingDays,
      toggleFastingDay,
      asmaFavorites,
      toggleAsmaFavorite,
      nameFavorites,
      toggleNameFavorite,
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
