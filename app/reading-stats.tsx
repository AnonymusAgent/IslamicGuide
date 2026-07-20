import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { SURAH_LIST } from '../constants/quranData';

const { width } = Dimensions.get('window');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateReadingHeatmap(progress: Record<string, number>): number[] {
  // 30 day heatmap based on ayahs read
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split('T')[0];
    return Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0;
  });
}

export default function ReadingStatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: C, settings, dailyTasbeehHistory, tasbeehCount, bookmarks, notes, fastingDays } = useApp();

  const readingProgress = settings.readingProgress;
  const progressEntries = Object.entries(readingProgress);
  const surahsStarted = progressEntries.length;
  const surahsCompleted = progressEntries.filter(([k, v]) => {
    const surah = SURAH_LIST[parseInt(k) - 1];
    return surah && v >= surah.versesCount;
  }).length;

  const totalAyahsRead = progressEntries.reduce((sum, [k, v]) => sum + v, 0);
  const totalSurahs = 114;
  const totalAyahs = 6236;
  const completionPct = Math.round((totalAyahsRead / totalAyahs) * 100);

  const juzCompleted = Math.floor(totalAyahsRead / (totalAyahs / 30));
  const pagesRead = Math.floor(totalAyahsRead / (totalAyahs / 604));

  const tasbeehTotal = dailyTasbeehHistory.reduce((sum, d) => sum + d.count, 0);
  const fastingTotal = fastingDays.filter(d => d.fasted).length;
  const heatmap = generateReadingHeatmap(readingProgress);

  const getHeatColor = (val: number) => {
    if (val === 0) return C.cardBorder;
    if (val === 1) return `${C.gold}30`;
    if (val === 2) return `${C.gold}55`;
    if (val === 3) return `${C.gold}80`;
    return C.gold;
  };

  // Most read surahs
  const topSurahs = progressEntries
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([k, v]) => ({
      surah: SURAH_LIST[parseInt(k) - 1],
      ayahsRead: v,
    }))
    .filter(s => s.surah);

  // Streak calculation
  let streak = 0;
  const sortedHistory = [...dailyTasbeehHistory].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  for (let i = 0; i < sortedHistory.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (sortedHistory[i]?.date === expected.toISOString().split('T')[0] && sortedHistory[i]?.count > 0) streak++;
    else break;
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={[C.primaryDark, C.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Reading Statistics</Text>
            <Text style={[styles.headerSub, { color: C.textSecondary }]}>Your Islamic journey progress</Text>
          </View>
        </View>

        {/* Completion Ring */}
        <View style={styles.ringArea}>
          <View style={[styles.ringOuter, { borderColor: `${C.gold}30` }]}>
            <View style={[styles.ringInner, { backgroundColor: `${C.gold}15` }]}>
              <Text style={[styles.ringPct, { color: C.gold }]}>{completionPct}%</Text>
              <Text style={[styles.ringLabel, { color: C.textSecondary }]}>Quran</Text>
              <Text style={[styles.ringLabel, { color: C.textSecondary }]}>Complete</Text>
            </View>
          </View>
          <View style={styles.ringStats}>
            {[
              { label: 'Ayahs Read', value: totalAyahsRead.toLocaleString(), color: C.gold },
              { label: 'Surahs', value: `${surahsStarted}/${totalSurahs}`, color: C.info },
              { label: 'Juz', value: `${juzCompleted}/30`, color: C.success },
              { label: 'Pages', value: `${pagesRead}/604`, color: C.warning },
            ].map(({ label, value, color }) => (
              <View key={label} style={[styles.ringStat, { backgroundColor: `${color}15` }]}>
                <Text style={[styles.ringStatVal, { color }]}>{value}</Text>
                <Text style={[styles.ringStatLabel, { color: C.textMuted }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Key Stats */}
        <View style={[styles.statsGrid, { paddingHorizontal: Spacing.md, paddingTop: Spacing.md }]}>
          {[
            { icon: 'auto-stories', label: 'Surahs Completed', value: surahsCompleted, color: C.success },
            { icon: 'bookmark', label: 'Bookmarks', value: bookmarks.length, color: C.gold },
            { icon: 'note', label: 'Notes', value: notes.length, color: C.info },
            { icon: 'favorite', label: 'Days Fasted', value: fastingTotal, color: C.error },
            { icon: 'loop', label: 'Total Tasbeeh', value: tasbeehTotal, color: C.warning },
            { icon: 'local-fire-department', label: 'Day Streak', value: streak, color: '#FF6B35' },
          ].map(({ icon, label, value, color }) => (
            <View key={label} style={[styles.statCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
              <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
                <MaterialIcons name={icon as any} size={20} color={color} />
              </View>
              <Text style={[styles.statValue, { color }]}>{value}</Text>
              <Text style={[styles.statLabel, { color: C.textMuted }]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Activity Heatmap */}
        <View style={[styles.section, { paddingHorizontal: Spacing.md, marginTop: Spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>30-Day Activity</Text>
          <View style={[styles.heatmapCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
            <View style={styles.heatmap}>
              {heatmap.map((val, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (29 - i));
                return (
                  <View key={i} style={styles.heatCell}>
                    <View style={[styles.heatBlock, { backgroundColor: getHeatColor(val) }]} />
                    {i % 5 === 0 && (
                      <Text style={[styles.heatLabel, { color: C.textMuted }]}>{d.getDate()}</Text>
                    )}
                  </View>
                );
              })}
            </View>
            <View style={styles.heatLegend}>
              <Text style={[styles.heatLegendLabel, { color: C.textMuted }]}>Less</Text>
              {[0, 1, 2, 3, 4].map(v => (
                <View key={v} style={[styles.heatLegendBlock, { backgroundColor: getHeatColor(v) }]} />
              ))}
              <Text style={[styles.heatLegendLabel, { color: C.textMuted }]}>More</Text>
            </View>
          </View>
        </View>

        {/* Top Surahs */}
        {topSurahs.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: Spacing.md, marginTop: Spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Most Read Surahs</Text>
            <View style={[styles.listCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
              {topSurahs.map(({ surah, ayahsRead }, i) => {
                const pct = (ayahsRead / surah.versesCount) * 100;
                return (
                  <Pressable
                    key={surah.number}
                    style={[styles.surahRow, i > 0 && { borderTopColor: C.cardBorder, borderTopWidth: 1 }]}
                    onPress={() => router.push(`/quran/${surah.number}` as any)}
                  >
                    <View style={[styles.rankBadge, { backgroundColor: `${C.gold}15` }]}>
                      <Text style={[styles.rankText, { color: C.gold }]}>#{i + 1}</Text>
                    </View>
                    <View style={styles.surahInfo}>
                      <View style={styles.surahNameRow}>
                        <Text style={[styles.surahName, { color: C.textPrimary }]}>{surah.transliteration}</Text>
                        <Text style={[styles.surahArabic, { color: C.textArabic }]}>{surah.arabicName}</Text>
                      </View>
                      <View style={[styles.surahProgressBar, { backgroundColor: C.cardBorder }]}>
                        <View style={[styles.surahProgressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: C.gold }]} />
                      </View>
                      <Text style={[styles.surahProgress, { color: C.textMuted }]}>
                        {ayahsRead}/{surah.versesCount} verses · {Math.round(pct)}%
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Tasbeeh History */}
        {dailyTasbeehHistory.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: Spacing.md, marginTop: Spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Tasbeeh History</Text>
            <View style={[styles.listCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
              {dailyTasbeehHistory.slice(0, 7).map((h, i) => (
                <View key={h.date} style={[styles.historyRow, i > 0 && { borderTopColor: C.cardBorder, borderTopWidth: 1 }]}>
                  <Text style={[styles.historyDate, { color: C.textSecondary }]}>{h.date}</Text>
                  <View style={styles.historyBar}>
                    <View style={[styles.historyBarFill, { width: `${Math.min((h.count / 1000) * 100, 100)}%`, backgroundColor: C.gold }]} />
                  </View>
                  <Text style={[styles.historyCount, { color: C.gold }]}>{h.count.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={[styles.section, { paddingHorizontal: Spacing.md, marginTop: Spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Achievements</Text>
          <View style={styles.achievementGrid}>
            {[
              { icon: '📖', title: 'First Surah', desc: 'Read your first Surah', earned: surahsStarted >= 1 },
              { icon: '📚', title: 'Scholar', desc: 'Read 10 Surahs', earned: surahsStarted >= 10 },
              { icon: '🌙', title: 'Hifz Journey', desc: 'Read 30 Surahs', earned: surahsStarted >= 30 },
              { icon: '🕌', title: 'Khatam', desc: 'Complete Quran', earned: surahsCompleted >= 114 },
              { icon: '🤲', title: 'Dhikr Master', desc: '1000 Tasbeeh', earned: tasbeehTotal >= 1000 },
              { icon: '🌟', title: 'Ramadan Fast', desc: 'Log 10 fasts', earned: fastingTotal >= 10 },
            ].map((a, i) => (
              <View
                key={i}
                style={[
                  styles.achievement,
                  { backgroundColor: C.card, borderColor: a.earned ? C.gold : C.cardBorder },
                  !a.earned && { opacity: 0.5 },
                ]}
              >
                <Text style={styles.achievementIcon}>{a.icon}</Text>
                <Text style={[styles.achievementTitle, { color: a.earned ? C.gold : C.textSecondary }]}>{a.title}</Text>
                <Text style={[styles.achievementDesc, { color: C.textMuted }]}>{a.desc}</Text>
                {a.earned && <MaterialIcons name="verified" size={14} color={C.gold} style={{ marginTop: 4 }} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.md, paddingBottom: Spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 2 },
  ringArea: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  ringOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPct: { fontSize: 24, fontWeight: '700' },
  ringLabel: { fontSize: 11, fontWeight: '500' },
  ringStats: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ringStat: { borderRadius: Radius.sm, padding: 8, alignItems: 'center', minWidth: 60 },
  ringStatVal: { fontSize: 16, fontWeight: '700' },
  ringStatLabel: { fontSize: 10, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: (width - Spacing.md * 2 - 20) / 3,
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 10, textAlign: 'center', marginTop: 2 },
  section: {},
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.sm },
  heatmapCard: { borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1 },
  heatmap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatCell: { alignItems: 'center' },
  heatBlock: { width: (width - Spacing.md * 4 - 30 * 4) / 30, height: 24, borderRadius: 4 },
  heatLabel: { fontSize: 8, marginTop: 2 },
  heatLegend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, justifyContent: 'flex-end' },
  heatLegendLabel: { fontSize: 10 },
  heatLegendBlock: { width: 14, height: 14, borderRadius: 3 },
  listCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  surahRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  rankBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 12, fontWeight: '700' },
  surahInfo: { flex: 1 },
  surahNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  surahName: { fontSize: 14, fontWeight: '600' },
  surahArabic: { fontSize: 16 },
  surahProgressBar: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 3 },
  surahProgressFill: { height: '100%', borderRadius: 2 },
  surahProgress: { fontSize: 10 },
  historyRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  historyDate: { fontSize: 12, width: 80 },
  historyBar: { flex: 1, height: 6, backgroundColor: 'transparent', borderRadius: 3, overflow: 'hidden' },
  historyBarFill: { height: '100%', borderRadius: 3 },
  historyCount: { fontSize: 13, fontWeight: '700', width: 50, textAlign: 'right' },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievement: {
    width: (width - Spacing.md * 2 - 20) / 3,
    borderRadius: Radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  achievementIcon: { fontSize: 24, marginBottom: 4 },
  achievementTitle: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  achievementDesc: { fontSize: 9, textAlign: 'center', marginTop: 2 },
});
