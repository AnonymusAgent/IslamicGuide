import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { fetchPrayerTimesByCoords, getNextPrayer, formatPrayerTime } from '../../services/prayerService';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const DAILY_AYAHS = [
  { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship will be ease.', reference: 'Surah Ash-Sharh 94:6' },
  { arabic: 'وَبَشِّرِ الصَّابِرِينَ', translation: 'And give good tidings to the patient.', reference: 'Al-Baqarah 2:155' },
  { arabic: 'وَاللَّهُ خَيْرُ الرَّازِقِينَ', translation: 'And Allah is the best of providers.', reference: 'Al-Jumuah 62:11' },
  { arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translation: 'Allah is sufficient for us.', reference: 'Al-Imran 3:173' },
  { arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', translation: 'Indeed, Allah is with the patient.', reference: 'Al-Baqarah 2:153' },
];

const QUICK_ACTIONS = [
  { id: 'quran', title: 'Quran', subtitle: '114 Surahs', icon: 'menu-book', color: '#2D6B57', route: '/quran' },
  { id: 'hadith', title: 'Hadith', subtitle: '8 Collections', icon: 'library-books', color: '#2D4A6B', route: '/hadith' },
  { id: 'duas', title: 'Duas', subtitle: 'Daily Azkar', icon: 'favorite', color: '#6B2D4A', route: '/duas' },
  { id: 'ai-guide', title: 'AI Guide', subtitle: 'Ask Islam', icon: 'smart-toy', color: '#2D6B5A', route: '/ai-guide' },
  { id: 'qibla', title: 'Qibla', subtitle: 'Compass', icon: 'explore', color: '#4A6B2D', route: '/qibla' },
  { id: 'tasbeeh', title: 'Tasbeeh', subtitle: 'Counter', icon: 'loop', color: '#6B4A2D', route: '/tasbeeh' },
  { id: 'calendar', title: 'Calendar', subtitle: 'Hijri', icon: 'calendar-today', color: '#6B2D6B', route: '/hijri-calendar' },
  { id: 'prayer-guide', title: 'Prayer', subtitle: 'Guide', icon: 'mosque', color: '#2D2D6B', route: '/prayer-guide' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lastRead, settings, colors: C } = useApp();
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesLeft: number } | null>(null);
  const [hijriDate, setHijriDate] = useState('');
  const [greeting, setGreeting] = useState('');

  const dailyAyah = DAILY_AYAHS[new Date().getDate() % DAILY_AYAHS.length];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Assalamu Alaikum');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    loadPrayer();
    loadHijriDate();
  }, []);

  const loadPrayer = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const coords = status === 'granted'
        ? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })).coords
        : { latitude: 21.4225, longitude: 39.8262 };
      const data = await fetchPrayerTimesByCoords(coords.latitude, coords.longitude, settings.prayerCalculationMethod);
      setNextPrayer(getNextPrayer(data.timings));
    } catch { /* silent fail */ }
  };

  const loadHijriDate = async () => {
    try {
      const now = new Date();
      const response = await fetch(`https://api.aladhan.com/v1/gToH/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
      const data = await response.json();
      if (data.data?.hijri) {
        const h = data.data.hijri;
        setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
      }
    } catch { /* silent */ }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/home-bg.png')}
            style={styles.headerBg}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', C.background]}
            style={styles.headerGradient}
          />
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
              <Text style={[styles.greetingEn, { color: C.textSecondary }]}>{greeting}</Text>
              {hijriDate ? <Text style={[styles.hijriDate, { color: C.textMuted }]}>{hijriDate}</Text> : null}
            </View>
            <View style={styles.headerActions}>
              <Pressable onPress={() => router.push('/hijri-calendar')} style={[styles.headerBtn, { backgroundColor: `${C.gold}20` }]}>
                <MaterialIcons name="calendar-today" size={18} color={C.gold} />
              </Pressable>
              <Pressable onPress={() => router.push('/settings')} style={[styles.headerBtn, { backgroundColor: `${C.gold}20` }]}>
                <MaterialIcons name="settings" size={18} color={C.gold} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Next Prayer Card */}
        {nextPrayer && (
          <Pressable onPress={() => router.push('/prayer')} style={[styles.prayerCard, { overflow: 'hidden' }]}>
            <LinearGradient
              colors={[C.primaryDark, C.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.prayerGradient}
            >
              <View>
                <Text style={styles.prayerLabel}>Next Prayer</Text>
                <Text style={styles.prayerName}>{nextPrayer.name}</Text>
                <Text style={styles.prayerTime}>{formatPrayerTime(nextPrayer.time)}</Text>
              </View>
              <View style={styles.prayerRight}>
                <MaterialIcons name="mosque" size={40} color={`${C.gold}60`} />
                <Text style={styles.prayerCountdown}>
                  {nextPrayer.minutesLeft < 60
                    ? `${nextPrayer.minutesLeft} min`
                    : `${Math.floor(nextPrayer.minutesLeft / 60)}h ${nextPrayer.minutesLeft % 60}m`}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {/* Daily Ayah */}
        <Pressable onPress={() => router.push('/quran')} style={[styles.ayahCard, { backgroundColor: C.card, borderColor: `${C.gold}30` }]}>
          <View style={styles.ayahHeader}>
            <MaterialIcons name="format-quote" size={18} color={C.gold} />
            <Text style={[styles.ayahLabel, { color: C.gold }]}>Verse of the Day</Text>
          </View>
          <Text style={[styles.ayahArabic, { color: C.textArabic }]}>{dailyAyah.arabic}</Text>
          <Text style={[styles.ayahTranslation, { color: C.textPrimary }]}>{dailyAyah.translation}</Text>
          <Text style={[styles.ayahRef, { color: C.gold }]}>{dailyAyah.reference}</Text>
        </Pressable>

        {/* Continue Reading */}
        {lastRead && (
          <Pressable
            onPress={() => router.push(`/quran/${lastRead.surahNumber}`)}
            style={[styles.continueCard, { backgroundColor: C.surfaceElevated, borderColor: C.cardBorder }]}
          >
            <View>
              <Text style={[styles.continueLabel, { color: C.textMuted }]}>Continue Reading</Text>
              <Text style={[styles.continueSurah, { color: C.textPrimary }]}>Surah {lastRead.surahNumber}</Text>
              <Text style={[styles.continueVerse, { color: C.textSecondary }]}>Verse {lastRead.ayahNumber}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={C.gold} />
          </Pressable>
        )}

        {/* Quick Access Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Islamic Library</Text>
          <View style={styles.grid}>
            {QUICK_ACTIONS.map(action => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [styles.gridItem, { backgroundColor: C.card, borderColor: C.cardBorder }, pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.gridIcon, { backgroundColor: `${action.color}30` }]}>
                  <MaterialIcons name={action.icon as any} size={24} color={action.color + 'CC'} />
                </View>
                <Text style={[styles.gridTitle, { color: C.textPrimary }]}>{action.title}</Text>
                <Text style={[styles.gridSubtitle, { color: C.textMuted }]}>{action.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* AI Guide Promo */}
        <Pressable
          style={[styles.aiCard, { backgroundColor: C.card, borderColor: `${C.success}30` }]}
          onPress={() => router.push('/ai-guide')}
        >
          <View style={[styles.aiIcon, { backgroundColor: `${C.success}20` }]}>
            <MaterialIcons name="smart-toy" size={28} color={C.success} />
          </View>
          <View style={styles.aiInfo}>
            <Text style={[styles.aiTitle, { color: C.textPrimary }]}>AI Islamic Guide</Text>
            <Text style={[styles.aiDesc, { color: C.textSecondary }]}>
              Ask Islamic questions and get answers with authentic Quran & Hadith citations.
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={C.textMuted} />
        </Pressable>

        {/* Hadith of the Day */}
        <Pressable onPress={() => router.push('/hadith')} style={[styles.hadithCard, { backgroundColor: C.card, borderColor: `${C.primaryLight}40` }]}>
          <View style={styles.hadithHeader}>
            <MaterialIcons name="library-books" size={16} color={C.gold} />
            <Text style={[styles.hadithLabel, { color: C.gold }]}>Hadith of the Day</Text>
          </View>
          <Text style={[styles.hadithArabic, { color: C.textArabic }]}>إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ</Text>
          <Text style={[styles.hadithText, { color: C.textPrimary }]}>
            "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."
          </Text>
          <Text style={[styles.hadithRef, { color: C.textMuted }]}>— Sahih al-Bukhari 1 | Narrated by Umar ibn al-Khattab (RA)</Text>
        </Pressable>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 200,
    position: 'relative',
    marginBottom: Spacing.md,
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  headerGradient: { ...StyleSheet.absoluteFillObject },
  headerContent: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  greeting: { fontSize: 18, color: '#C9A84C', fontWeight: '600', textAlign: 'right' },
  greetingEn: { fontSize: 14, marginTop: 2 },
  hijriDate: { fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
  },
  prayerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingVertical: 20,
    borderRadius: Radius.lg,
  },
  prayerLabel: { fontSize: 12, color: 'rgba(245,240,232,0.7)', fontWeight: '500' },
  prayerName: { fontSize: 24, color: '#F5F0E8', fontWeight: '700', marginTop: 2 },
  prayerTime: { fontSize: 18, color: '#C9A84C', fontWeight: '600', marginTop: 4 },
  prayerRight: { alignItems: 'center' },
  prayerCountdown: { fontSize: 14, color: '#C9A84C', fontWeight: '600', marginTop: 4 },
  ayahCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  ayahHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  ayahLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  ayahArabic: { fontSize: 26, fontWeight: '400', textAlign: 'right', lineHeight: 44, marginBottom: Spacing.sm },
  ayahTranslation: { fontSize: 15, lineHeight: 24, fontStyle: 'italic', marginBottom: Spacing.xs },
  ayahRef: { fontSize: 12, fontWeight: '500' },
  continueCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  continueLabel: { fontSize: 11, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8 },
  continueSurah: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  continueVerse: { fontSize: 13 },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: {
    width: (width - Spacing.md * 2 - 36) / 4,
    alignItems: 'center',
    borderRadius: Radius.md,
    padding: 10,
    borderWidth: 1,
  },
  gridIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  gridTitle: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  gridSubtitle: { fontSize: 9, textAlign: 'center', marginTop: 1 },
  aiCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
  },
  aiIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  aiInfo: { flex: 1 },
  aiTitle: { fontSize: 16, fontWeight: '700' },
  aiDesc: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  hadithCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  hadithHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  hadithLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  hadithArabic: { fontSize: 22, textAlign: 'right', lineHeight: 38, marginBottom: Spacing.sm },
  hadithText: { fontSize: 14, lineHeight: 22, fontStyle: 'italic', marginBottom: Spacing.xs },
  hadithRef: { fontSize: 11, fontWeight: '500' },
});
