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

const SCREEN_WIDTH = Dimensions.get('window').width;

const DAILY_AYAHS = [
  { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship will be ease.', reference: 'Ash-Sharh 94:6' },
  { arabic: 'وَبَشِّرِ الصَّابِرِينَ', translation: 'And give good tidings to the patient.', reference: 'Al-Baqarah 2:155' },
  { arabic: 'وَاللَّهُ خَيْرُ الرَّازِقِينَ', translation: 'And Allah is the best of providers.', reference: 'Al-Jumuah 62:11' },
  { arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translation: 'Allah is sufficient for us and the best Disposer of affairs.', reference: 'Al-Imran 3:173' },
  { arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', translation: 'Indeed, Allah is with the patient.', reference: 'Al-Baqarah 2:153' },
  { arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', translation: 'Do not despair of the mercy of Allah.', reference: 'Yusuf 12:87' },
  { arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', translation: 'And He is with you wherever you are.', reference: 'Al-Hadid 57:4' },
];

const QUICK_ACTIONS = [
  { id: 'quran', title: 'Quran', subtitle: '114 Surahs', icon: 'menu-book', color: '#2D6B57', route: '/quran' },
  { id: 'hadith', title: 'Hadith', subtitle: '9 Collections', icon: 'library-books', color: '#2D4A6B', route: '/hadith' },
  { id: 'duas', title: 'Duas', subtitle: 'Daily Azkar', icon: 'favorite', color: '#6B2D4A', route: '/duas' },
  { id: 'ai-guide', title: 'AI Guide', subtitle: 'Ask Islam', icon: 'smart-toy', color: '#2D6B5A', route: '/ai-guide' },
  { id: 'qibla', title: 'Qibla', subtitle: 'Compass', icon: 'explore', color: '#4A6B2D', route: '/qibla' },
  { id: 'tasbeeh', title: 'Tasbeeh', subtitle: 'Counter', icon: 'loop', color: '#6B4A2D', route: '/tasbeeh' },
  { id: 'calendar', title: 'Calendar', subtitle: 'Hijri', icon: 'calendar-today', color: '#6B2D6B', route: '/hijri-calendar' },
  { id: 'prayer-guide', title: 'Prayer', subtitle: 'Guide', icon: 'mosque', color: '#2D2D6B', route: '/prayer-guide' },
  { id: 'asma', title: '99 Names', subtitle: 'Asma Allah', icon: 'star', color: '#5B2D6B', route: '/asma-ul-husna' },
  { id: 'ramadan', title: 'Ramadan', subtitle: 'Companion', icon: 'nightlight', color: '#1B4D8A', route: '/ramadan' },
  { id: 'hajj', title: 'Hajj', subtitle: 'Guide', icon: 'flight-takeoff', color: '#4A2D6B', route: '/hajj-guide' },
  { id: 'stats', title: 'Statistics', subtitle: 'Progress', icon: 'bar-chart', color: '#2D6B4A', route: '/reading-stats' },
  { id: 'audio', title: 'Audio', subtitle: 'Downloads', icon: 'headphones', color: '#6B2D5B', route: '/audio-manager' },
  { id: 'hifz', title: 'Hifz', subtitle: 'Memorize', icon: 'psychology', color: '#2D4A2D', route: '/hifz' },
  { id: 'compare', title: 'Compare', subtitle: 'Translations', icon: 'compare-arrows', color: '#6B4A2D', route: '/quran-comparison' },
  { id: 'mosque', title: 'Mosques', subtitle: 'Near Me', icon: 'location-on', color: '#2D6B2D', route: '/mosque-finder' },
];

const FEATURE_CARDS = [
  { id: 'ramadan', title: 'Ramadan Companion', desc: 'Fasting tracker, Suhoor/Iftar times, Ramadan duas & goals', icon: '🌙', color: '#1B4D8A', route: '/ramadan' },
  { id: 'asma', title: 'Asma-ul-Husna', desc: '99 Beautiful Names of Allah with meanings & explanations', icon: '✨', color: '#5B2D6B', route: '/asma-ul-husna' },
  { id: 'hajj', title: 'Hajj & Umrah Guide', desc: 'Step-by-step guide, duas, and packing checklist', icon: '🕋', color: '#4A2D6B', route: '/hajj-guide' },
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
    if (hour < 5) setGreeting('Tahajjud Time 🌌');
    else if (hour < 12) setGreeting('Good Morning ☀️');
    else if (hour < 17) setGreeting('Good Afternoon 🌤️');
    else if (hour < 20) setGreeting('Good Evening 🌅');
    else setGreeting('Good Night 🌙');
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
    } catch { /* silent */ }
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

  const colSize = (SCREEN_WIDTH - Spacing.md * 2 - 9 * 3) / 4;

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Hero Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/home-bg.png')}
            style={styles.headerBg}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', C.background]}
            style={styles.headerGradient}
          />
          <View style={[styles.headerContent, { paddingBottom: Spacing.md }]}>
            <View style={styles.headerLeft}>
              <Text style={[styles.bismillah, { color: C.gold }]}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
              <Text style={[styles.greeting, { color: C.textPrimary }]}>{greeting}</Text>
              {hijriDate ? <Text style={[styles.hijriDate, { color: C.textMuted }]}>{hijriDate}</Text> : null}
            </View>
            <View style={styles.headerRight}>
              <Pressable onPress={() => router.push('/reading-stats')} style={[styles.headerBtn, { backgroundColor: `${C.gold}20`, borderColor: `${C.gold}30` }]}>
                <MaterialIcons name="bar-chart" size={18} color={C.gold} />
              </Pressable>
              <Pressable onPress={() => router.push('/settings')} style={[styles.headerBtn, { backgroundColor: `${C.gold}20`, borderColor: `${C.gold}30` }]}>
                <MaterialIcons name="settings" size={18} color={C.gold} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Next Prayer Card */}
        {nextPrayer ? (
          <Pressable
            onPress={() => router.push('/prayer')}
            style={[styles.prayerCard, { marginHorizontal: Spacing.md, marginBottom: Spacing.md, borderRadius: Radius.lg, overflow: 'hidden' }]}
          >
            <LinearGradient
              colors={[C.primaryDark, C.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.prayerGradient}
            >
              <View>
                <Text style={[styles.prayerLabel, { color: `${C.gold}90` }]}>Next Prayer</Text>
                <Text style={[styles.prayerName, { color: C.textPrimary }]}>{nextPrayer.name}</Text>
                <Text style={[styles.prayerTime, { color: C.gold }]}>{formatPrayerTime(nextPrayer.time)}</Text>
              </View>
              <View style={styles.prayerRight}>
                <MaterialIcons name="mosque" size={44} color={`${C.gold}40`} />
                <Text style={[styles.prayerCountdown, { color: C.gold }]}>
                  {nextPrayer.minutesLeft < 60
                    ? `${nextPrayer.minutesLeft}m`
                    : `${Math.floor(nextPrayer.minutesLeft / 60)}h ${nextPrayer.minutesLeft % 60}m`}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        ) : null}

        {/* Daily Verse */}
        <Pressable
          onPress={() => router.push('/quran')}
          style={[styles.ayahCard, { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: C.card, borderColor: `${C.gold}30` }]}
        >
          <View style={styles.ayahHeaderRow}>
            <View style={[styles.ayahIconBox, { backgroundColor: `${C.gold}15` }]}>
              <MaterialIcons name="format-quote" size={16} color={C.gold} />
            </View>
            <Text style={[styles.ayahLabel, { color: C.gold }]}>Verse of the Day</Text>
            <MaterialIcons name="chevron-right" size={16} color={C.textMuted} />
          </View>
          <Text style={[styles.ayahArabic, { color: C.textArabic }]}>{dailyAyah.arabic}</Text>
          <Text style={[styles.ayahTranslation, { color: C.textSecondary }]}>{dailyAyah.translation}</Text>
          <Text style={[styles.ayahRef, { color: C.gold }]}>{dailyAyah.reference}</Text>
        </Pressable>

        {/* Continue Reading */}
        {lastRead ? (
          <Pressable
            onPress={() => router.push(`/quran/${lastRead.surahNumber}` as any)}
            style={[styles.continueCard, { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: C.surfaceElevated, borderColor: C.cardBorder }]}
          >
            <View style={[styles.continueIcon, { backgroundColor: `${C.gold}20` }]}>
              <MaterialIcons name="bookmark" size={20} color={C.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.continueLabel, { color: C.textMuted }]}>Continue Reading</Text>
              <Text style={[styles.continueSurah, { color: C.textPrimary }]}>Surah {lastRead.surahNumber} — Verse {lastRead.ayahNumber}</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={C.gold} />
          </Pressable>
        ) : null}

        {/* Quick Access Grid */}
        <View style={[styles.section, { marginHorizontal: Spacing.md, marginBottom: Spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Islamic Library</Text>
          <View style={styles.grid}>
            {QUICK_ACTIONS.map(action => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [
                  styles.gridItem,
                  { width: colSize, backgroundColor: C.card, borderColor: C.cardBorder },
                  pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] },
                ]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.gridIcon, { backgroundColor: `${action.color}25` }]}>
                  <MaterialIcons name={action.icon as any} size={22} color={action.color + 'CC'} />
                </View>
                <Text style={[styles.gridTitle, { color: C.textPrimary }]} numberOfLines={1}>{action.title}</Text>
                <Text style={[styles.gridSubtitle, { color: C.textMuted }]} numberOfLines={1}>{action.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured Sections */}
        <View style={[styles.section, { marginHorizontal: Spacing.md, marginBottom: Spacing.md }]}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Featured</Text>
          {FEATURE_CARDS.map(card => (
            <Pressable
              key={card.id}
              style={({ pressed }) => [
                styles.featureCard,
                { backgroundColor: C.card, borderColor: C.cardBorder },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push(card.route as any)}
            >
              <View style={[styles.featureIcon, { backgroundColor: `${card.color}20` }]}>
                <Text style={styles.featureEmoji}>{card.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: C.textPrimary }]}>{card.title}</Text>
                <Text style={[styles.featureDesc, { color: C.textSecondary }]}>{card.desc}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={C.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* AI Guide Promo */}
        <Pressable
          style={[styles.aiCard, { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: C.card, borderColor: `${C.success}30` }]}
          onPress={() => router.push('/ai-guide')}
        >
          <LinearGradient colors={[`${C.success}20`, `${C.primary}30`]} style={styles.aiGradient}>
            <View style={[styles.aiIcon, { backgroundColor: `${C.success}25` }]}>
              <MaterialIcons name="smart-toy" size={28} color={C.success} />
            </View>
            <View style={styles.aiInfo}>
              <Text style={[styles.aiTitle, { color: C.textPrimary }]}>AI Islamic Guide</Text>
              <Text style={[styles.aiDesc, { color: C.textSecondary }]}>
                Ask Islamic questions and receive answers backed by Quran & authentic Hadith citations.
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={C.textMuted} />
          </LinearGradient>
        </Pressable>

        {/* Hadith of the Day */}
        <Pressable
          onPress={() => router.push('/hadith')}
          style={[styles.hadithCard, { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: C.card, borderColor: `${C.primaryLight}40` }]}
        >
          <View style={styles.hadithHeader}>
            <MaterialIcons name="library-books" size={16} color={C.gold} />
            <Text style={[styles.hadithLabel, { color: C.gold }]}>Hadith of the Day</Text>
          </View>
          <Text style={[styles.hadithArabic, { color: C.textArabic }]}>إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ</Text>
          <Text style={[styles.hadithText, { color: C.textPrimary }]}>
            "The reward of deeds depends upon the intentions, and every person will get the reward according to what he has intended."
          </Text>
          <View style={styles.hadithFooter}>
            <Text style={[styles.hadithRef, { color: C.textMuted }]}>Sahih al-Bukhari 1 · Umar ibn al-Khattab RA</Text>
            <View style={[styles.hadithGrade, { backgroundColor: `${C.success}15` }]}>
              <Text style={[styles.hadithGradeText, { color: C.success }]}>Sahih</Text>
            </View>
          </View>
        </Pressable>

        {/* Names & History */}
        <View style={[styles.rowCards, { marginHorizontal: Spacing.md, marginBottom: Spacing.md }]}>
          <Pressable
            style={[styles.halfCard, { backgroundColor: C.card, borderColor: `${C.gold}30` }]}
            onPress={() => router.push('/islamic-names')}
          >
            <Text style={styles.halfCardEmoji}>👶</Text>
            <Text style={[styles.halfCardTitle, { color: C.textPrimary }]}>Islamic Names</Text>
            <Text style={[styles.halfCardDesc, { color: C.textMuted }]}>75+ Baby Names</Text>
          </Pressable>
          <Pressable
            style={[styles.halfCard, { backgroundColor: C.card, borderColor: `${C.gold}30` }]}
            onPress={() => router.push('/reading-stats')}
          >
            <Text style={styles.halfCardEmoji}>📊</Text>
            <Text style={[styles.halfCardTitle, { color: C.textPrimary }]}>My Progress</Text>
            <Text style={[styles.halfCardDesc, { color: C.textMuted }]}>Stats & Achievements</Text>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 200,
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  headerGradient: { ...StyleSheet.absoluteFillObject },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: { flex: 1 },
  bismillah: { fontSize: 18, fontWeight: '600', textAlign: 'right' },
  greeting: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  hijriDate: { fontSize: 12, marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: 8, marginLeft: Spacing.sm },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  prayerCard: {},
  prayerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingVertical: 20,
    borderRadius: Radius.lg,
  },
  prayerLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  prayerName: { fontSize: 24, fontWeight: '700', marginTop: 2 },
  prayerTime: { fontSize: 18, fontWeight: '600', marginTop: 4 },
  prayerRight: { alignItems: 'center', gap: 4 },
  prayerCountdown: { fontSize: 14, fontWeight: '700' },
  ayahCard: { borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1 },
  ayahHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  ayahIconBox: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  ayahLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, flex: 1 },
  ayahArabic: { fontSize: 24, fontWeight: '400', textAlign: 'right', lineHeight: 44, marginBottom: Spacing.xs },
  ayahTranslation: { fontSize: 14, lineHeight: 22, fontStyle: 'italic', marginBottom: 4 },
  ayahRef: { fontSize: 11, fontWeight: '600' },
  continueCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
  },
  continueIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  continueLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  continueSurah: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  section: {},
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  gridItem: {
    alignItems: 'center',
    borderRadius: Radius.md,
    padding: 10,
    borderWidth: 1,
  },
  gridIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  gridTitle: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  gridSubtitle: { fontSize: 9, textAlign: 'center', marginTop: 1 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: Spacing.md,
    marginBottom: 10,
  },
  featureIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  featureEmoji: { fontSize: 26 },
  featureTitle: { fontSize: 15, fontWeight: '700' },
  featureDesc: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  aiCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  aiGradient: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.lg },
  aiIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  aiInfo: { flex: 1 },
  aiTitle: { fontSize: 16, fontWeight: '700' },
  aiDesc: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  hadithCard: { borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1 },
  hadithHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  hadithLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  hadithArabic: { fontSize: 20, textAlign: 'right', lineHeight: 36, marginBottom: Spacing.sm },
  hadithText: { fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  hadithFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  hadithRef: { fontSize: 11, flex: 1 },
  hadithGrade: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  hadithGradeText: { fontSize: 10, fontWeight: '700' },
  rowCards: { flexDirection: 'row', gap: 12 },
  halfCard: { flex: 1, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, alignItems: 'center' },
  halfCardEmoji: { fontSize: 32, marginBottom: 6 },
  halfCardTitle: { fontSize: 14, fontWeight: '700' },
  halfCardDesc: { fontSize: 11, marginTop: 2 },
});
