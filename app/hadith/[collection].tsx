import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  ActivityIndicator, Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '../../constants/theme';
import { HADITH_COLLECTIONS } from '../../constants/hadithData';
import { getOfflineHadiths, OfflineHadith } from '../../constants/offlineHadithDb';
import { useApp } from '../../contexts/AppContext';

export default function HadithCollectionScreen() {
  const { collection } = useLocalSearchParams<{ collection: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addBookmark, removeBookmark, isBookmarked, colors: C } = useApp();

  const meta = HADITH_COLLECTIONS.find(c => c.id === collection);

  // Load from offline DB — always available, no network needed
  const [hadiths] = useState<OfflineHadith[]>(() =>
    getOfflineHadiths(collection || 'nawawi40')
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const shareHadith = useCallback(async (item: OfflineHadith) => {
    const text = `${item.arabic}\n\n"${item.english}"\n\n— ${item.narrator}\n${item.reference}`;
    await Share.share({ message: text });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const renderHadith = useCallback(({ item }: { item: OfflineHadith }) => {
    const ref = `hadith_${collection}_${item.number}`;
    const bookmarked = isBookmarked(ref);
    const isExpanded = expandedId === item.id;

    const gradeColor = item.grade === 'Sahih'
      ? C.success
      : item.grade === 'Hasan' || item.grade === 'Hasan Sahih'
      ? C.gold
      : C.textMuted;

    return (
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
        {/* Header Row */}
        <Pressable style={styles.cardHeader} onPress={() => toggleExpand(item.id)}>
          <View style={[styles.numBox, { backgroundColor: `${C.gold}15`, borderColor: `${C.gold}30` }]}>
            <Text style={[styles.numText, { color: C.gold }]}>{item.number}</Text>
          </View>
          <View style={styles.cardMeta}>
            <Text style={[styles.chapterName, { color: C.textPrimary }]} numberOfLines={isExpanded ? undefined : 1}>
              {item.chapterName}
            </Text>
            <Text style={[styles.bookName, { color: C.textMuted }]}>{item.bookName}</Text>
          </View>
          <View style={styles.cardHeaderRight}>
            <View style={[styles.gradeBadge, { backgroundColor: `${gradeColor}15` }]}>
              <Text style={[styles.gradeText, { color: gradeColor }]}>{item.grade}</Text>
            </View>
            <MaterialIcons
              name={isExpanded ? 'expand-less' : 'expand-more'}
              size={20}
              color={C.textMuted}
            />
          </View>
        </Pressable>

        {/* Arabic Text */}
        {item.arabic ? (
          <Text style={[styles.arabicText, { color: C.textArabic, fontSize: 20 }]}>
            {item.arabic}
          </Text>
        ) : null}

        {/* English Translation */}
        <Text style={[styles.englishText, { color: C.textPrimary }]}>
          {item.english}
        </Text>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={[styles.expandedDetails, { borderTopColor: C.divider }]}>
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={14} color={C.textMuted} />
              <Text style={[styles.detailText, { color: C.textMuted }]}>
                Narrator: {item.narrator}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="info-outline" size={14} color={C.textMuted} />
              <Text style={[styles.detailText, { color: C.textMuted }]}>
                {item.reference}
              </Text>
            </View>
          </View>
        )}

        {/* Action Row */}
        <View style={[styles.actionRow, { borderTopColor: C.divider }]}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => bookmarked
              ? removeBookmark(ref)
              : addBookmark({
                  type: 'hadith',
                  reference: ref,
                  title: `${meta?.name} #${item.number}`,
                  subtitle: item.english.substring(0, 80) + '...',
                  arabic: item.arabic,
                })}
          >
            <MaterialIcons
              name={bookmarked ? 'bookmark' : 'bookmark-border'}
              size={18}
              color={bookmarked ? C.gold : C.textMuted}
            />
            <Text style={[styles.actionText, { color: C.textMuted }]}>
              {bookmarked ? 'Saved' : 'Bookmark'}
            </Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => shareHadith(item)}>
            <MaterialIcons name="share" size={18} color={C.textMuted} />
            <Text style={[styles.actionText, { color: C.textMuted }]}>Share</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => toggleExpand(item.id)}>
            <MaterialIcons name="info" size={18} color={C.textMuted} />
            <Text style={[styles.actionText, { color: C.textMuted }]}>
              {isExpanded ? 'Less' : 'Details'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }, [C, expandedId, collection, isBookmarked]);

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={[C.primaryDark, C.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: C.textPrimary }]}>
              {meta?.name || collection}
            </Text>
            <Text style={[styles.headerArabic, { color: C.gold }]}>{meta?.arabicName}</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: `${C.gold}20` }]}>
            <Text style={[styles.countText, { color: C.gold }]}>{hadiths.length}</Text>
            <Text style={[styles.countLabel, { color: C.textMuted }]}>hadiths</Text>
          </View>
        </View>

        {/* Scholar Info */}
        {meta && (
          <View style={[styles.scholarCard, { backgroundColor: `${C.gold}10`, borderColor: `${C.gold}20` }]}>
            <MaterialIcons name="person" size={14} color={C.gold} />
            <Text style={[styles.scholarText, { color: C.textSecondary }]} numberOfLines={2}>
              {meta.scholar}
            </Text>
          </View>
        )}
      </LinearGradient>

      {hadiths.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="library-books" size={56} color={C.textMuted} />
          <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>
            Collection Coming Soon
          </Text>
          <Text style={[styles.emptyDesc, { color: C.textMuted }]}>
            This collection is being added to the offline database. Currently showing Nawawi 40 and selected hadiths from major collections.
          </Text>
        </View>
      ) : (
        <FlatList
          data={hadiths}
          renderItem={renderHadith}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={
            <View style={[styles.offlineBanner, { backgroundColor: `${C.success}10`, borderColor: `${C.success}20` }]}>
              <MaterialIcons name="offline-bolt" size={14} color={C.success} />
              <Text style={[styles.offlineBannerText, { color: C.success }]}>
                {hadiths.length} verified hadiths available offline
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: 4,
    marginBottom: Spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerArabic: { fontSize: 16, marginTop: 2 },
  countBadge: { alignItems: 'center', padding: 10, borderRadius: Radius.md },
  countText: { fontSize: 18, fontWeight: '800' },
  countLabel: { fontSize: 10, marginTop: 1 },
  scholarCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  scholarText: { flex: 1, fontSize: 12, lineHeight: 18 },

  list: { padding: Spacing.md },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  offlineBannerText: { fontSize: 12, fontWeight: '600' },

  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
  },
  numBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  numText: { fontSize: 12, fontWeight: '700' },
  cardMeta: { flex: 1 },
  chapterName: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  bookName: { fontSize: 11, marginTop: 2 },
  cardHeaderRight: { alignItems: 'flex-end', gap: 4 },
  gradeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gradeText: { fontSize: 10, fontWeight: '700' },

  arabicText: {
    textAlign: 'right',
    lineHeight: 40,
    paddingHorizontal: 12,
    paddingBottom: 8,
    writingDirection: 'rtl',
  },
  englishText: {
    fontSize: 15,
    lineHeight: 26,
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontStyle: 'italic',
  },

  expandedDetails: {
    borderTopWidth: 1,
    padding: 12,
    gap: 8,
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  detailText: { fontSize: 12, lineHeight: 18, flex: 1 },

  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 8,
    gap: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  actionText: { fontSize: 12 },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
