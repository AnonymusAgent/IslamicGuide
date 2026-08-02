import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '../contexts/AppContext';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import FloatingPlayer from '../components/FloatingPlayer';

function AppContent() {
  const { settings } = useApp();
  return (
    <>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="quran/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="hadith/index" options={{ headerShown: false }} />
        <Stack.Screen name="hadith/[collection]" options={{ headerShown: false }} />
        <Stack.Screen name="duas/index" options={{ headerShown: false }} />
        <Stack.Screen name="duas/[category]" options={{ headerShown: false }} />
        <Stack.Screen name="tasbeeh" options={{ headerShown: false }} />
        <Stack.Screen name="qibla" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="bookmarks" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="prayer-guide/index" options={{ headerShown: false }} />
        <Stack.Screen name="ai-guide" options={{ headerShown: false }} />
        <Stack.Screen name="hijri-calendar" options={{ headerShown: false }} />
        <Stack.Screen name="asma-ul-husna" options={{ headerShown: false }} />
        <Stack.Screen name="islamic-names" options={{ headerShown: false }} />
        <Stack.Screen name="ramadan" options={{ headerShown: false }} />
        <Stack.Screen name="reading-stats" options={{ headerShown: false }} />
        <Stack.Screen name="hajj-guide" options={{ headerShown: false }} />
        <Stack.Screen name="audio-manager" options={{ headerShown: false }} />
        <Stack.Screen name="tafsir/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="mosque-finder" options={{ headerShown: false }} />
        <Stack.Screen name="quran-comparison" options={{ headerShown: false }} />
        <Stack.Screen name="hifz" options={{ headerShown: false }} />
        <Stack.Screen name="quran-search" options={{ headerShown: false }} />
        <Stack.Screen name="salah-tracker" options={{ headerShown: false }} />
        <Stack.Screen name="notes-library" options={{ headerShown: false }} />
      </Stack>
      <FloatingPlayer />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AudioPlayerProvider>
          <AppContent />
        </AudioPlayerProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
