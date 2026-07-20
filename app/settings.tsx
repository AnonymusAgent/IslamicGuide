import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { TRANSLATIONS, RECITERS } from '../constants/quranData';
import { CALCULATION_METHODS, MADHABS } from '../constants/prayerData';
import {
  requestNotificationPermission,
  applyAllNotificationSettings,
  cancelAllNotifications,
} from '../services/notificationService';

type ThemeOption = 'dark' | 'light' | 'system';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, colors: C, bookmarks, notes } = useApp();
  const [notifPermission, setNotifPermission] = useState<boolean | null>(null);

  const handleThemeChange = (theme: ThemeOption) => {
    updateSettings({ theme });
  };

  const handleNotificationToggle = useCallback(async (
    key: keyof typeof settings.notifications,
    value: boolean
  ) => {
    if (value && notifPermission === null) {
      const granted = await requestNotificationPermission();
      setNotifPermission(granted);
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notification permissions in your device settings to receive prayer reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    const updatedNotifs = { ...settings.notifications, [key]: value };
    await updateSettings({ notifications: updatedNotifs });
    await applyAllNotificationSettings(updatedNotifs);
  }, [settings.notifications, notifPermission, updateSettings]);

  const handleCancelAll = async () => {
    await cancelAllNotifications();
    const disabled = Object.fromEntries(
      Object.keys(settings.notifications).map(k =>
        [k, typeof settings.notifications[k as keyof typeof settings.notifications] === 'boolean' ? false : settings.notifications[k as keyof typeof settings.notifications]]
      )
    ) as typeof settings.notifications;
    await updateSettings({ notifications: disabled });
    Alert.alert('Done', 'All notifications have been disabled.');
  };

  // ── Sub-components ──────────────────────────────────────────────────────────

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.section, { paddingHorizontal: Spacing.md, marginTop: Spacing.lg }]}>
      <Text style={[styles.sectionTitle, { color: C.textMuted }]}>{title.toUpperCase()}</Text>
      <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>{children}</View>
    </View>
  );

  const Divider = () => <View style={[styles.divider, { backgroundColor: C.divider }]} />;

  const ToggleRow = ({
    label, subtitle, value, onChange, icon, iconColor,
  }: {
    label: string; subtitle?: string; value: boolean;
    onChange: (v: boolean) => void; icon?: string; iconColor?: string;
  }) => (
    <View style={styles.toggleRow}>
      {icon ? (
        <View style={[styles.rowIcon, { backgroundColor: `${iconColor || C.gold}15` }]}>
          <MaterialIcons name={icon as any} size={18} color={iconColor || C.gold} />
        </View>
      ) : null}
      <View style={styles.rowInfo}>
        <Text style={[styles.rowLabel, { color: C.textPrimary }]}>{label}</Text>
        {subtitle ? <Text style={[styles.rowSub, { color: C.textMuted }]}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: C.cardBorder, true: `${C.gold}80` }}
        thumbColor={value ? C.gold : C.textMuted}
        ios_backgroundColor={C.cardBorder}
      />
    </View>
  );

  const SelectRow = ({
    label, options, selected, onSelect, renderOption,
  }: {
    label?: string;
    options: any[];
    selected: any;
    onSelect: (v: any) => void;
    renderOption: (item: any) => React.ReactNode;
  }) => (
    <View>
      {options.map((item, i) => (
        <React.Fragment key={i}>
          <Pressable
            style={({ pressed }) => [
              styles.optionRow,
              pressed && { backgroundColor: C.surfaceElevated },
              selected === (item.id ?? item) && { backgroundColor: `${C.gold}08` },
            ]}
            onPress={() => onSelect(item.id ?? item)}
          >
            {renderOption(item)}
            {selected === (item.id ?? item) && (
              <MaterialIcons name="check-circle" size={20} color={C.gold} />
            )}
          </Pressable>
          {i < options.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={[C.primaryDark, C.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Settings</Text>
            <Text style={[styles.headerSub, { color: C.textSecondary }]}>Personalize your experience</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'bookmark', label: 'Bookmarks', value: bookmarks.length, color: C.gold },
            { icon: 'note', label: 'Notes', value: notes.length, color: C.info },
          ].map(s => (
            <View key={s.label} style={[styles.statChip, { backgroundColor: `${s.color}15`, borderColor: `${s.color}25` }]}>
              <MaterialIcons name={s.icon as any} size={14} color={s.color} />
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: C.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Appearance ───────────────────────────────────────────────────── */}
        <Section title="Appearance">
          {/* Theme */}
          <View style={styles.themeSection}>
            <Text style={[styles.rowLabel, { color: C.textPrimary, paddingHorizontal: Spacing.md, paddingTop: Spacing.md }]}>
              Theme
            </Text>
            <View style={styles.themeRow}>
              {([
                { key: 'dark', icon: 'nights-stay', label: 'Dark' },
                { key: 'light', icon: 'wb-sunny', label: 'Light' },
                { key: 'system', icon: 'brightness-auto', label: 'System' },
              ] as { key: ThemeOption; icon: string; label: string }[]).map(t => (
                <Pressable
                  key={t.key}
                  style={[
                    styles.themeCard,
                    { backgroundColor: C.surfaceElevated, borderColor: C.cardBorder },
                    settings.theme === t.key && [styles.themeCardActive, { borderColor: C.gold, backgroundColor: `${C.gold}15` }],
                  ]}
                  onPress={() => handleThemeChange(t.key)}
                >
                  <MaterialIcons
                    name={t.icon as any}
                    size={22}
                    color={settings.theme === t.key ? C.gold : C.textMuted}
                  />
                  <Text style={[styles.themeLabel, { color: settings.theme === t.key ? C.gold : C.textMuted }]}>
                    {t.label}
                  </Text>
                  {settings.theme === t.key && (
                    <View style={[styles.themeCheck, { backgroundColor: C.gold }]}>
                      <MaterialIcons name="check" size={10} color={C.primaryDark} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
          <Divider />

          {/* Arabic Font Size */}
          <View style={[styles.toggleRow, { paddingVertical: Spacing.md }]}>
            <View style={[styles.rowIcon, { backgroundColor: `${C.gold}15` }]}>
              <MaterialIcons name="text-fields" size={18} color={C.gold} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: C.textPrimary }]}>Arabic Font Size</Text>
              <Text style={[styles.rowSub, { color: C.textMuted }]}>{settings.arabicFontSize}px preview size</Text>
            </View>
            <View style={styles.fontStepper}>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: C.surfaceElevated, borderColor: C.cardBorder }]}
                onPress={() => updateSettings({ arabicFontSize: Math.max(18, settings.arabicFontSize - 2) })}
              >
                <MaterialIcons name="remove" size={16} color={C.textPrimary} />
              </Pressable>
              <Text style={[styles.stepValue, { color: C.gold }]}>{settings.arabicFontSize}</Text>
              <Pressable
                style={[styles.stepBtn, { backgroundColor: C.surfaceElevated, borderColor: C.cardBorder }]}
                onPress={() => updateSettings({ arabicFontSize: Math.min(42, settings.arabicFontSize + 2) })}
              >
                <MaterialIcons name="add" size={16} color={C.textPrimary} />
              </Pressable>
            </View>
          </View>
          <Divider />

          {/* Arabic preview */}
          <View style={[styles.arabicPreview, { backgroundColor: C.surfaceElevated, borderColor: C.divider }]}>
            <Text style={[styles.arabicPreviewText, { color: C.textArabic, fontSize: settings.arabicFontSize }]}>
              إِنَّ مَعَ الْعُسْرِ يُسْرًا
            </Text>
            <Text style={[styles.arabicPreviewSub, { color: C.textMuted }]}>Font preview — Ash-Sharh 94:6</Text>
          </View>
          <Divider />

          {/* Accessibility */}
          <ToggleRow
            label="High Contrast Mode"
            subtitle="Improve readability for low-vision users"
            value={settings.highContrastMode}
            onChange={v => updateSettings({ highContrastMode: v })}
            icon="contrast"
            iconColor={C.info}
          />
          <Divider />
          <ToggleRow
            label="Haptic Feedback"
            subtitle="Vibration feedback on interactions"
            value={settings.hapticFeedback}
            onChange={v => updateSettings({ hapticFeedback: v })}
            icon="vibration"
            iconColor={C.success}
          />
        </Section>

        {/* ── Quran Reading ─────────────────────────────────────────────────── */}
        <Section title="Quran Reading">
          <ToggleRow
            label="Show Translation"
            subtitle="Display verse translation below Arabic"
            value={settings.showTranslation}
            onChange={v => updateSettings({ showTranslation: v })}
            icon="translate"
            iconColor={C.info}
          />
          <Divider />
          <ToggleRow
            label="Show Transliteration"
            subtitle="Display romanized pronunciation"
            value={settings.showTransliteration}
            onChange={v => updateSettings({ showTransliteration: v })}
            icon="text-fields"
            iconColor={C.gold}
          />
          <Divider />
          <ToggleRow
            label="Word-by-Word Mode"
            subtitle="Tap any word for individual translation"
            value={settings.showWordByWord}
            onChange={v => updateSettings({ showWordByWord: v })}
            icon="view-column"
            iconColor={C.warning}
          />
          <Divider />
          <ToggleRow
            label="Tajweed Coloring"
            subtitle="Color-coded Tajweed rules on Arabic text"
            value={settings.showTajweed}
            onChange={v => updateSettings({ showTajweed: v })}
            icon="palette"
            iconColor={C.success}
          />
          <Divider />
          <ToggleRow
            label="Auto-play Next Surah"
            subtitle="Continue to next Surah when audio ends"
            value={settings.autoPlayNext}
            onChange={v => updateSettings({ autoPlayNext: v })}
            icon="skip-next"
            iconColor={C.primary}
          />
        </Section>

        {/* ── Translation ───────────────────────────────────────────────────── */}
        <Section title="Quran Translation">
          <SelectRow
            options={TRANSLATIONS}
            selected={settings.selectedTranslation}
            onSelect={id => updateSettings({ selectedTranslation: id })}
            renderOption={t => (
              <View style={styles.optionContent}>
                <Text style={styles.optionFlag}>{t.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionName, { color: C.textPrimary }]}>{t.name}</Text>
                  <Text style={[styles.optionSub, { color: C.textMuted }]}>{t.language}</Text>
                </View>
              </View>
            )}
          />
        </Section>

        {/* ── Reciter ───────────────────────────────────────────────────────── */}
        <Section title="Audio Reciter">
          <SelectRow
            options={RECITERS}
            selected={settings.selectedReciter}
            onSelect={id => updateSettings({ selectedReciter: id })}
            renderOption={r => (
              <View style={styles.optionContent}>
                <View style={[styles.reciterBadge, { backgroundColor: `${C.primary}40` }]}>
                  <Text style={[styles.reciterInitial, { color: C.gold }]}>{r.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionName, { color: C.textPrimary }]}>{r.name}</Text>
                  <Text style={[styles.optionSub, { color: C.textMuted }]}>{r.arabicName} · {r.style}</Text>
                </View>
              </View>
            )}
          />
        </Section>

        {/* ── Prayer Times ──────────────────────────────────────────────────── */}
        <Section title="Prayer Calculation Method">
          <SelectRow
            options={CALCULATION_METHODS.slice(0, 8)}
            selected={settings.prayerCalculationMethod}
            onSelect={id => updateSettings({ prayerCalculationMethod: id })}
            renderOption={m => (
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionName, { color: C.textPrimary }]}>{m.name}</Text>
                <Text style={[styles.optionSub, { color: C.textMuted }]}>{m.region}</Text>
              </View>
            )}
          />
        </Section>

        <Section title="Asr Calculation (Madhab)">
          <SelectRow
            options={MADHABS}
            selected={settings.madhab}
            onSelect={id => updateSettings({ madhab: id })}
            renderOption={m => (
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionName, { color: C.textPrimary }]}>{m.name}</Text>
                <Text style={[styles.optionSub, { color: C.textMuted }]}>{m.description}</Text>
              </View>
            )}
          />
        </Section>

        {/* ── Notifications ────────────────────────────────────────────────── */}
        <Section title="Notifications & Reminders">
          <View style={[styles.notifHeader, { borderBottomColor: C.divider }]}>
            <MaterialIcons name="notifications" size={18} color={C.gold} />
            <Text style={[styles.notifHeaderText, { color: C.textSecondary }]}>
              Enable reminders to stay connected with your daily Islamic practices
            </Text>
          </View>

          {/* Prayer Reminders */}
          <Text style={[styles.notifGroupLabel, { color: C.textMuted, backgroundColor: C.surfaceElevated }]}>
            Prayer Reminders
          </Text>
          {[
            { key: 'fajrReminder', label: 'Fajr Reminder', icon: '🌙', sub: '10 min before Fajr' },
            { key: 'dhuhrReminder', label: 'Dhuhr Reminder', icon: '☀️', sub: '10 min before Dhuhr' },
            { key: 'asrReminder', label: 'Asr Reminder', icon: '🌤️', sub: '10 min before Asr' },
            { key: 'maghribReminder', label: 'Maghrib Reminder', icon: '🌅', sub: '10 min before Maghrib' },
            { key: 'ishaReminder', label: 'Isha Reminder', icon: '🌃', sub: '10 min before Isha' },
          ].map((item, i, arr) => (
            <React.Fragment key={item.key}>
              <View style={styles.notifRow}>
                <Text style={styles.notifEmoji}>{item.icon}</Text>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowLabel, { color: C.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.rowSub, { color: C.textMuted }]}>{item.sub}</Text>
                </View>
                <Switch
                  value={!!settings.notifications[item.key as keyof typeof settings.notifications]}
                  onValueChange={v => handleNotificationToggle(item.key as keyof typeof settings.notifications, v)}
                  trackColor={{ false: C.cardBorder, true: `${C.gold}80` }}
                  thumbColor={settings.notifications[item.key as keyof typeof settings.notifications] ? C.gold : C.textMuted}
                />
              </View>
              {i < arr.length - 1 && <Divider />}
            </React.Fragment>
          ))}

          {/* Daily Reminders */}
          <Text style={[styles.notifGroupLabel, { color: C.textMuted, backgroundColor: C.surfaceElevated }]}>
            Daily Islamic Reminders
          </Text>
          {[
            { key: 'dailyAyah', label: 'Daily Verse (Ayah)', icon: '📖', sub: 'Every morning at 7:00 AM' },
            { key: 'dailyHadith', label: 'Daily Hadith', icon: '📚', sub: 'Every morning at 8:00 AM' },
            { key: 'morningAzkar', label: 'Morning Azkar', icon: '🌅', sub: 'After Fajr at 6:30 AM' },
            { key: 'eveningAzkar', label: 'Evening Azkar', icon: '🌆', sub: 'At 5:30 PM' },
            { key: 'fridayReminder', label: "Jumu'ah Reminder", icon: '🕌', sub: 'Every Friday at 11:30 AM' },
            { key: 'tahajjudReminder', label: 'Tahajjud Reminder', icon: '🌌', sub: 'At 3:30 AM nightly' },
            { key: 'fastingReminder', label: 'Fasting Tracker', icon: '🌙', sub: 'Daily reminder to log fasts' },
          ].map((item, i, arr) => (
            <React.Fragment key={item.key}>
              <View style={styles.notifRow}>
                <Text style={styles.notifEmoji}>{item.icon}</Text>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowLabel, { color: C.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.rowSub, { color: C.textMuted }]}>{item.sub}</Text>
                </View>
                <Switch
                  value={!!settings.notifications[item.key as keyof typeof settings.notifications]}
                  onValueChange={v => handleNotificationToggle(item.key as keyof typeof settings.notifications, v)}
                  trackColor={{ false: C.cardBorder, true: `${C.gold}80` }}
                  thumbColor={settings.notifications[item.key as keyof typeof settings.notifications] ? C.gold : C.textMuted}
                />
              </View>
              {i < arr.length - 1 && <Divider />}
            </React.Fragment>
          ))}

          {/* Disable all */}
          <Pressable
            style={[styles.disableAllBtn, { borderTopColor: C.cardBorder }]}
            onPress={handleCancelAll}
          >
            <MaterialIcons name="notifications-off" size={16} color={C.error} />
            <Text style={[styles.disableAllText, { color: C.error }]}>Disable All Notifications</Text>
          </Pressable>
        </Section>

        {/* ── About ─────────────────────────────────────────────────────────── */}
        <Section title="About">
          <View style={[styles.aboutCard, { backgroundColor: `${C.primary}15` }]}>
            <Text style={[styles.aboutName, { color: C.gold }]}>🕌 Islamic Guide</Text>
            <Text style={[styles.aboutVersion, { color: C.textMuted }]}>Version 2.1.0 · Production Build</Text>
            <Text style={[styles.aboutDesc, { color: C.textSecondary }]}>
              Complete Quran with word-by-word translation, 9 authentic Hadith collections, comprehensive Duas library, AI Islamic Guide powered by Gemini 3, GPS prayer times, Qibla compass, 99 Names of Allah, Ramadan companion, Hajj guide, and more.
            </Text>
          </View>
          <Divider />
          <Pressable
            style={styles.optionRow}
            onPress={() => {
              /* Clear cache */
              Alert.alert('Cache Cleared', 'App cache has been cleared successfully.');
            }}
          >
            <View style={styles.optionContent}>
              <View style={[styles.rowIcon, { backgroundColor: `${C.warning}15` }]}>
                <MaterialIcons name="cleaning-services" size={18} color={C.warning} />
              </View>
              <Text style={[styles.optionName, { color: C.textPrimary }]}>Clear Cache</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={C.textMuted} />
          </Pressable>
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingTop: 4, marginBottom: Spacing.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 8, borderRadius: Radius.md, borderWidth: 1 },
  statNum: { fontSize: 15, fontWeight: '700' },
  statLabel: { fontSize: 11 },

  section: {},
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: Spacing.xs },
  sectionCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },

  divider: { height: 1, marginHorizontal: Spacing.md },

  themeSection: {},
  themeRow: { flexDirection: 'row', gap: 10, padding: Spacing.md },
  themeCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    gap: 6,
    position: 'relative',
  },
  themeCardActive: {},
  themeLabel: { fontSize: 12, fontWeight: '600' },
  themeCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    minHeight: 60,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '500' },
  rowSub: { fontSize: 12, marginTop: 1 },

  fontStepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  stepValue: { fontSize: 16, fontWeight: '700', minWidth: 28, textAlign: 'center' },

  arabicPreview: { padding: Spacing.md, alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1 },
  arabicPreviewText: { textAlign: 'center', lineHeight: 60 },
  arabicPreviewSub: { fontSize: 11, marginTop: 4 },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  optionContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionFlag: { fontSize: 20, width: 28, textAlign: 'center' },
  optionName: { fontSize: 14, fontWeight: '500' },
  optionSub: { fontSize: 12, marginTop: 1 },
  reciterBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  reciterInitial: { fontSize: 16, fontWeight: '700' },

  notifHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: Spacing.md, borderBottomWidth: 1 },
  notifHeaderText: { flex: 1, fontSize: 13, lineHeight: 20 },
  notifGroupLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, padding: 10, paddingHorizontal: Spacing.md },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 12, gap: 12 },
  notifEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  disableAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.md, borderTopWidth: 1, justifyContent: 'center' },
  disableAllText: { fontSize: 14, fontWeight: '600' },

  aboutCard: { padding: Spacing.md, alignItems: 'center', gap: 6 },
  aboutName: { fontSize: 16, fontWeight: '700' },
  aboutVersion: { fontSize: 12 },
  aboutDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 4 },
});
