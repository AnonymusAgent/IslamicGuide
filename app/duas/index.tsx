import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius } from '../../constants/theme';
import { DUA_CATEGORIES } from '../../constants/duasData';
import { useApp } from '../../contexts/AppContext';

export default function DuasIndexScreen() {
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
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Duas & Azkar</Text>
          <Text style={[styles.headerSub, { color: C.textMuted }]}>Daily Supplications & Remembrance</Text>
        </View>
      </View>

      <FlatList
        data={DUA_CATEGORIES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, { backgroundColor: C.card, borderColor: C.cardBorder }, pressed && { opacity: 0.8 }]}
            onPress={() => router.push(`/duas/${item.id}` as any)}
          >
            <Text style={styles.cardEmoji}>{item.icon}</Text>
            <Text style={[styles.cardTitle, { color: C.textPrimary }]}>{item.name}</Text>
            <Text style={[styles.cardArabic, { color: C.gold }]}>{item.arabicName}</Text>
            <View style={[styles.countBadge, { backgroundColor: `${C.gold}15` }]}>
              <Text style={[styles.countText, { color: C.gold }]}>{item.count} duas</Text>
            </View>
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={[styles.intro, { backgroundColor: `${C.primary}20`, borderColor: `${C.primary}40` }]}>
            <Text style={[styles.introArabic, { color: C.gold }]}>وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ</Text>
            <Text style={[styles.introText, { color: C.textSecondary }]}>
              "And your Lord said: Call upon Me, I will respond to you." — Quran 40:60
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
    alignItems: 'center',
  },
  introArabic: { fontSize: 18, fontWeight: '400', textAlign: 'center', lineHeight: 32 },
  introText: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 6 },
  list: { padding: Spacing.md, paddingBottom: 100 },
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  cardArabic: { fontSize: 14, textAlign: 'center' },
  countBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginTop: 4 },
  countText: { fontSize: 11, fontWeight: '600' },
});
