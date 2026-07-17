import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius } from '../../constants/theme';
import { HADITH_COLLECTIONS } from '../../constants/hadithData';
import { useApp } from '../../contexts/AppContext';

export default function HadithIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: C } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.cardBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
        </Pressable>
        <View>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Hadith Collections</Text>
          <Text style={[styles.headerSub, { color: C.textMuted }]}>Authentic Prophetic Traditions</Text>
        </View>
      </View>

      <FlatList
        data={HADITH_COLLECTIONS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, { backgroundColor: C.card, borderColor: C.cardBorder }, pressed && { opacity: 0.8 }]}
            onPress={() => router.push(`/hadith/${item.id}` as any)}
          >
            <View style={[styles.cardIcon, { backgroundColor: `${item.color}20` }]}>
              <Text style={styles.cardEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: C.textPrimary }]}>{item.name}</Text>
              <Text style={[styles.cardArabic, { color: C.textArabic }]}>{item.arabicName}</Text>
              <Text style={[styles.cardScholar, { color: C.textMuted }]}>{item.scholar}</Text>
              <View style={styles.cardMeta}>
                <View style={[styles.badge, { backgroundColor: `${C.gold}20`, borderColor: `${C.gold}30` }]}>
                  <Text style={[styles.badgeText, { color: C.gold }]}>{item.totalHadiths.toLocaleString()} hadiths</Text>
                </View>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={C.textMuted} />
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={[styles.intro, { backgroundColor: `${C.primary}30`, borderColor: `${C.primary}50` }]}>
            <Text style={[styles.introText, { color: C.textSecondary }]}>
              The six authentic hadith collections (Kutub al-Sittah) form the basis of Islamic jurisprudence.
              All hadiths are sourced from authenticated Islamic databases.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSub: { fontSize: 13 },
  intro: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  introText: { fontSize: 13, lineHeight: 20 },
  list: { paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: 12,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  cardIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 26 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardArabic: { fontSize: 18, fontWeight: '400', marginTop: 2 },
  cardScholar: { fontSize: 12, marginTop: 2 },
  cardMeta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
