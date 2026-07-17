import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  ActivityIndicator, Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { HADITH_COLLECTIONS, SAMPLE_HADITHS } from '../../constants/hadithData';
import { useHadithCollection } from '../../hooks/useHadith';
import { useApp } from '../../contexts/AppContext';

export default function HadithCollectionScreen() {
  const { collection } = useLocalSearchParams<{ collection: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addBookmark, removeBookmark, isBookmarked } = useApp();

  const meta = HADITH_COLLECTIONS.find(c => c.id === collection);
  const { hadiths, loading, error, loadHadiths, loadMore } = useHadithCollection(collection || 'bukhari');

  useEffect(() => { loadHadiths(1); }, []);

  const shareHadith = async (item: any) => {
    const text = `${item.arab || ''}\n\n"${item.id}"\n\n— ${meta?.name} #${item.number}`;
    await Share.share({ message: text });
  };

  const renderHadith = ({ item }: { item: any }) => {
    const ref = `hadith_${collection}_${item.number}`;
    const bookmarked = isBookmarked(ref);
    return (
      <View style={styles.hadithCard}>
        <View style={styles.hadithTop}>
          <View style={styles.hadithNum}>
            <Text style={styles.hadithNumText}>{item.number}</Text>
          </View>
          <View style={styles.hadithMeta}>
            <Text style={styles.hadithBook}>{meta?.name}</Text>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>Hadith #{item.number}</Text>
            </View>
          </View>
          <View style={styles.hadithActions}>
            <Pressable onPress={() => shareHadith(item)} style={styles.actionIcon}>
              <MaterialIcons name="share" size={18} color={Colors.textMuted} />
            </Pressable>
            <Pressable
              onPress={() => bookmarked
                ? removeBookmark(ref)
                : addBookmark({ type: 'hadith', reference: ref, title: `${meta?.name} #${item.number}`, subtitle: String(item.id).substring(0, 60) + '...' })}
              style={styles.actionIcon}
            >
              <MaterialIcons name={bookmarked ? 'bookmark' : 'bookmark-border'} size={18} color={bookmarked ? Colors.gold : Colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {item.arab ? (
          <Text style={styles.arabicText}>{item.arab}</Text>
        ) : null}

        <Text style={styles.hadithText}>{item.id}</Text>

        <View style={styles.refRow}>
          <MaterialIcons name="info-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.refText}>{meta?.name}, Hadith {item.number}</Text>
        </View>
      </View>
    );
  };

  // Use sample hadiths as fallback
  const displayHadiths = hadiths.length > 0 ? hadiths : (
    collection === 'nawawi40' || collection === 'bukhari' || collection === 'muslim'
      ? SAMPLE_HADITHS.filter(h => h.collection === collection).map(h => ({
          number: h.hadithNumber,
          arab: h.arabic,
          id: h.english,
        }))
      : []
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{meta?.name || collection}</Text>
          <Text style={styles.headerArabic}>{meta?.arabicName}</Text>
        </View>
      </View>

      {loading && displayHadiths.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Loading hadiths...</Text>
        </View>
      ) : error && displayHadiths.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => loadHadiths(1)}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={displayHadiths}
          renderItem={renderHadith}
          keyExtractor={(item, idx) => `${item.number || idx}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator color={Colors.gold} style={{ padding: 20 }} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: Colors.textSecondary, fontSize: 15 },
  errorText: { color: Colors.error, fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: Radius.md },
  retryText: { color: Colors.gold, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerInfo: {},
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  headerArabic: { fontSize: 16, color: Colors.gold },
  list: { padding: Spacing.md, paddingBottom: 100, gap: 12 },
  hadithCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  hadithTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  hadithNum: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${Colors.gold}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.gold}30`,
  },
  hadithNumText: { fontSize: 12, color: Colors.gold, fontWeight: '700' },
  hadithMeta: { flex: 1 },
  hadithBook: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.success}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  gradeText: { fontSize: 10, color: Colors.success, fontWeight: '600' },
  hadithActions: { flexDirection: 'row', gap: 4 },
  actionIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  arabicText: {
    fontSize: 20,
    color: Colors.textArabic,
    textAlign: 'right',
    lineHeight: 36,
    marginBottom: Spacing.sm,
    writingDirection: 'rtl',
  },
  hadithText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  refText: { fontSize: 11, color: Colors.textMuted },
});
