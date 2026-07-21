/**
 * AudioPlayerContext — Global persistent Quran audio player state.
 * Manages expo-av Audio, play/pause, surah navigation, repeat modes,
 * and playback speed. Shared across ALL screens.
 */

import React, {
  createContext, useContext, useState, useRef, useCallback,
  useEffect, ReactNode,
} from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { SURAH_LIST, RECITERS } from '../constants/quranData';
import { getAudioUrl } from '../services/quranService';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RepeatMode = 'none' | 'one' | 'all';
export type PlaybackSpeed = 0.75 | 1 | 1.25 | 1.5;

export interface NowPlaying {
  surahNumber: number;
  surahName: string;
  surahArabic: string;
  reciterId: string;
  reciterName: string;
}

interface AudioPlayerContextType {
  nowPlaying: NowPlaying | null;
  isPlaying: boolean;
  isLoading: boolean;
  positionMs: number;
  durationMs: number;
  repeatMode: RepeatMode;
  playbackSpeed: PlaybackSpeed;

  playSurah: (surahNumber: number, reciterId?: string) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stop: () => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrev: () => Promise<void>;
  seekTo: (ms: number) => Promise<void>;
  setRepeatMode: (mode: RepeatMode) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(1);

  const soundRef = useRef<Audio.Sound | null>(null);
  const currentSurahRef = useRef<number>(1);
  const currentReciterRef = useRef<string>('ar.alafasy');
  const repeatModeRef = useRef<RepeatMode>('none');

  // Keep refs in sync
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setPositionMs(status.positionMillis);
    setDurationMs(status.durationMillis || 0);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      const mode = repeatModeRef.current;
      if (mode === 'one') {
        soundRef.current?.replayAsync().catch(() => {});
      } else if (mode === 'all') {
        const next = currentSurahRef.current < 114
          ? currentSurahRef.current + 1
          : 1;
        playSurahInternal(next, currentReciterRef.current);
      } else {
        // mode === 'none': auto-advance to next surah
        if (currentSurahRef.current < 114) {
          playSurahInternal(currentSurahRef.current + 1, currentReciterRef.current);
        } else {
          setIsPlaying(false);
          setNowPlaying(null);
        }
      }
    }
  }, []);

  const playSurahInternal = useCallback(async (
    surahNumber: number,
    reciterId: string,
  ) => {
    try {
      setIsLoading(true);

      // Unload previous
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
      const url = getAudioUrl(surahNumber, reciter.identifier);
      const surahMeta = SURAH_LIST[surahNumber - 1];

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, rate: playbackSpeed, volume: 1.0 },
        onPlaybackStatusUpdate,
      );

      soundRef.current = sound;
      currentSurahRef.current = surahNumber;
      currentReciterRef.current = reciterId;

      setNowPlaying({
        surahNumber,
        surahName: surahMeta?.transliteration || `Surah ${surahNumber}`,
        surahArabic: surahMeta?.arabicName || '',
        reciterId,
        reciterName: reciter.name,
      });
      setIsPlaying(true);
    } catch (e) {
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [onPlaybackStatusUpdate, playbackSpeed]);

  const playSurah = useCallback(async (surahNumber: number, reciterId?: string) => {
    const rid = reciterId || currentReciterRef.current || 'ar.alafasy';
    // If same surah already loaded, just toggle
    if (
      nowPlaying?.surahNumber === surahNumber &&
      nowPlaying?.reciterId === rid &&
      soundRef.current
    ) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
      } else if (status.isLoaded) {
        await soundRef.current.playAsync();
      }
      return;
    }
    await playSurahInternal(surahNumber, rid);
  }, [nowPlaying, playSurahInternal]);

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
    setIsPlaying(false);
    setNowPlaying(null);
    setPositionMs(0);
    setDurationMs(0);
  }, []);

  const skipNext = useCallback(async () => {
    const next = currentSurahRef.current < 114 ? currentSurahRef.current + 1 : 1;
    await playSurahInternal(next, currentReciterRef.current);
  }, [playSurahInternal]);

  const skipPrev = useCallback(async () => {
    // If > 3 seconds in, restart current; else go prev
    if (positionMs > 3000) {
      await soundRef.current?.setPositionAsync(0);
    } else {
      const prev = currentSurahRef.current > 1 ? currentSurahRef.current - 1 : 114;
      await playSurahInternal(prev, currentReciterRef.current);
    }
  }, [positionMs, playSurahInternal]);

  const seekTo = useCallback(async (ms: number) => {
    await soundRef.current?.setPositionAsync(ms);
  }, []);

  const setPlaybackSpeed = useCallback(async (speed: PlaybackSpeed) => {
    setPlaybackSpeedState(speed);
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        await soundRef.current.setRateAsync(speed, true);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      nowPlaying,
      isPlaying,
      isLoading,
      positionMs,
      durationMs,
      repeatMode,
      playbackSpeed,
      playSurah,
      togglePlayPause,
      stop,
      skipNext,
      skipPrev,
      seekTo,
      setRepeatMode,
      setPlaybackSpeed,
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
