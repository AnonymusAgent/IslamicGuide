import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius } from '../constants/theme';
import { useApp, Bookmark } from '../contexts/AppContext';

type FilterType = 'all' | 'quran' | 'hadith' | 'dua';

export default function BookmarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookmarks, removeBookmark, colors: C } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all' ? bookmarks : bookmarks.filter(b => b.type === filter);

  const getIcon = (type: Bookmark['type']) => {
    if (type === 'quran') return 'menu-book';
    if (type === 'hadith') return 'library-books';
    return 'favorite';
  };

  const getColor = (type: Bookmark['type']) => {
    if (type === 'quran') return C.gold;
    if (type === 'hadith') return C.info;
    return C.error;
  };

  const handlePress = (bookmark: Bookmark) => {
    const ref = bookmark.reference;
    if (ref.startsWith('quran_')) {
      const parts = ref.replace('quran_', '').split('_');
      router.push(`/quran/${parts[0]}` as any);
    } else if (ref.startsWith('hadith_')) {
      router.push('/hadith' as any);
    } else if (ref.startsWith('dua_')) {
      router.push('/duas' as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.cardBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
        </Pressable>
        <View>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Bookmarks</Text>
          <Text style={[styles.headerSub, { color: C.textMuted }]}>{bookmarks.length} saved items</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'quran', 'hadith', 'dua'] as FilterType[]).map(f => (
          <Pressable
            key={f}
            style={[
              styles.filterBtn,
              { backgroundColor: C.card, borderColor: C.cardBorder },
              filter === f && { backgroundColor: C.gold, borderColor: C.gold },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, { color: filter === f ? C.primaryDark : C.textSecondary }, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, { backgroundColor: C.card, borderColor: C.cardBorder }, pressed && { opacity: 0.8 }]}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.iconBox, { backgroundColor: `${getColor(item.type)}15` }]}>
              <MaterialIcons name={getIcon(item.type) as any} size={20} color={getColor(item.type)} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: C.textPrimary }]}>{item.title}</Text>
              {item.subtitle ? <Text style={[styles.cardSub, { color: C.textSecondary }]} numberOfLines={2}>{item.subtitle}</Text> : null}
              {item.arabic ? <Text style={[styles.cardArabic, { color: C.textArabic }]} numberOfLines={1}>{item.arabic}</Text> : null}
              <Text style={[styles.cardTime, { color: C.textMuted }]}>{new Date(item.timestamp).toLocaleDateString()}</Text>
            </View>
            <Pressable onPress={() => removeBookmark(item.id)} style={styles.deleteBtn}>
              <MaterialIcons name="delete-outline" size={18} color={C.textMuted} />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="bookmark-border" size={64} color={C.textMuted} />
            <Text style={[styles.emptyTitle, { color: C.textSecondary }]}>No bookmarks yet</Text>
            <Text style={[styles.emptyText, { color: C.textMuted }]}>Bookmark Quran verses, hadiths, and duas to access them quickly.</Text>
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
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.round, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '500' },
  filterTextActive: { fontWeight: '700' },
  list: { padding: Spacing.md, gap: 10, paddingBottom: 100 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.md, borderWidth: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  cardArabic: { fontSize: 16, marginTop: 2 },
  cardTime: { fontSize: 11, marginTop: 4 },
  deleteBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: 48, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
