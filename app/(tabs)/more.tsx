import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: C, settings, updateSettings } = useApp();

  const MENU_SECTIONS = [
    {
      title: 'AI & Learning',
      items: [
        { id: 'ai-guide', title: 'AI Islamic Guide', subtitle: 'Ask questions with Quran & Hadith citations', icon: 'smart-toy', color: '#2D6B57', route: '/ai-guide' },
        { id: 'prayer-guide', title: 'Prayer Guide', subtitle: 'Complete Salah Instructions', icon: 'mosque', color: '#2D2D6B', route: '/prayer-guide' },
        { id: 'hijri-calendar', title: 'Hijri Calendar', subtitle: 'Islamic events & fasting tracker', icon: 'calendar-today', color: '#6B2D6B', route: '/hijri-calendar' },
      ],
    },
    {
      title: 'Islamic Library',
      items: [
        { id: 'hadith', title: 'Hadith Collections', subtitle: 'Bukhari, Muslim, Abu Dawood & more', icon: 'library-books', color: '#2D4A6B', route: '/hadith' },
        { id: 'duas', title: 'Duas & Azkar', subtitle: 'Morning, Evening & Daily Supplications', icon: 'favorite', color: '#6B2D4A', route: '/duas' },
      ],
    },
    {
      title: 'Islamic Tools',
      items: [
        { id: 'qibla', title: 'Qibla Compass', subtitle: 'Find the direction of Makkah', icon: 'explore', color: '#4A6B2D', route: '/qibla' },
        { id: 'tasbeeh', title: 'Digital Tasbeeh', subtitle: 'Counter with daily history', icon: 'loop', color: '#6B4A2D', route: '/tasbeeh' },
        { id: 'search', title: 'Global Search', subtitle: 'Search Quran, Hadith & Duas', icon: 'search', color: '#2D6B6B', route: '/search' },
      ],
    },
    {
      title: 'Personal',
      items: [
        { id: 'bookmarks', title: 'Bookmarks', subtitle: 'Saved verses, hadiths & duas', icon: 'bookmark', color: '#6B6B2D', route: '/bookmarks' },
        { id: 'settings', title: 'Settings', subtitle: 'Theme, translations, reciters', icon: 'settings', color: '#4A4A4A', route: '/settings' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.cardBorder }]}>
        <View>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>More</Text>
          <Text style={[styles.headerSubtitle, { color: C.textMuted }]}>Islamic Resources & Tools</Text>
        </View>
        {/* Quick Theme Toggle */}
        <Pressable
          style={[styles.themeToggle, { backgroundColor: `${C.gold}15`, borderColor: `${C.gold}30` }]}
          onPress={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
        >
          <MaterialIcons
            name={settings.theme === 'dark' ? 'wb-sunny' : 'nights-stay'}
            size={20}
            color={C.gold}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {MENU_SECTIONS.map(section => (
          <View key={section.title} style={[styles.section, { paddingHorizontal: Spacing.md, marginTop: Spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: C.textMuted }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
              {section.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Pressable
                    style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: C.surfaceElevated }]}
                    onPress={() => router.push(item.route as any)}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                      <MaterialIcons name={item.icon as any} size={22} color={item.color + 'CC'} />
                    </View>
                    <View style={styles.menuInfo}>
                      <Text style={[styles.menuTitle, { color: C.textPrimary }]}>{item.title}</Text>
                      <Text style={[styles.menuSubtitle, { color: C.textMuted }]}>{item.subtitle}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={C.textMuted} />
                  </Pressable>
                  {index < section.items.length - 1 && <View style={[styles.divider, { backgroundColor: C.cardBorder }]} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={[styles.appInfo, { margin: Spacing.md, marginTop: Spacing.xl, backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: `${C.gold}20` }]}>
          <Text style={[styles.appName, { color: C.gold }]}>Islamic Guide</Text>
          <Text style={[styles.appVersion, { color: C.textMuted }]}>v1.0.0 · Powered by OnSpace AI</Text>
          <Text style={[styles.appDesc, { color: C.textSecondary }]}>
            Quran with word-by-word translation, authentic Hadith collections, daily Duas, AI Islamic Guide with citations, Hijri Calendar, Prayer Times, and Qibla Compass.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  section: {},
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600' },
  menuSubtitle: { fontSize: 13, marginTop: 1 },
  divider: { height: 1, marginLeft: 44 + Spacing.md * 2 },
  appInfo: { padding: Spacing.md, alignItems: 'center' },
  appName: { fontSize: 16, fontWeight: '700' },
  appVersion: { fontSize: 12, marginTop: 2 },
  appDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: Spacing.sm },
});
