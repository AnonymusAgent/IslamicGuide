import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { TRANSLATIONS, RECITERS } from '../constants/quranData';
import { CALCULATION_METHODS, MADHABS } from '../constants/prayerData';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, colors: C } = useApp();

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.section, { paddingHorizontal: Spacing.md, marginTop: Spacing.lg }]}>
      <Text style={[styles.sectionTitle, { color: C.textMuted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>{children}</View>
    </View>
  );

  const Divider = () => <View style={[styles.divider, { backgroundColor: C.cardBorder }]} />;

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.cardBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Section title="Appearance">
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Theme</Text>
            <View style={styles.themeToggle}>
              {(['dark', 'light'] as const).map(t => (
                <Pressable
                  key={t}
                  style={[
                    styles.themeBtn,
                    { backgroundColor: C.surfaceElevated, borderColor: C.cardBorder },
                    settings.theme === t && { backgroundColor: C.gold, borderColor: C.gold },
                  ]}
                  onPress={() => updateSettings({ theme: t })}
                >
                  <MaterialIcons
                    name={t === 'dark' ? 'nights-stay' : 'wb-sunny'}
                    size={16}
                    color={settings.theme === t ? C.primaryDark : C.textMuted}
                  />
                  <Text style={[styles.themeBtnText, { color: settings.theme === t ? C.primaryDark : C.textMuted }, settings.theme === t && styles.themeBtnTextActive]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Divider />
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Arabic Font Size</Text>
            <View style={styles.fontSizeRow}>
              <Pressable onPress={() => updateSettings({ arabicFontSize: Math.max(16, settings.arabicFontSize - 2) })} style={[styles.fontBtn, { backgroundColor: C.surfaceElevated, borderColor: C.cardBorder }]}>
                <MaterialIcons name="remove" size={16} color={C.textPrimary} />
              </Pressable>
              <Text style={[styles.settingValue, { color: C.textMuted }]}>{settings.arabicFontSize}px</Text>
              <Pressable onPress={() => updateSettings({ arabicFontSize: Math.min(40, settings.arabicFontSize + 2) })} style={[styles.fontBtn, { backgroundColor: C.surfaceElevated, borderColor: C.cardBorder }]}>
                <MaterialIcons name="add" size={16} color={C.textPrimary} />
              </Pressable>
            </View>
          </View>
        </Section>

        <Section title="Quran Reading">
          {[
            { key: 'showTranslation', label: 'Show Translation' },
            { key: 'showTransliteration', label: 'Show Transliteration' },
            { key: 'showWordByWord', label: 'Word-by-Word Mode' },
            { key: 'autoPlayNext', label: 'Auto-play Next Surah' },
          ].map((opt, i, arr) => (
            <React.Fragment key={opt.key}>
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: C.textPrimary }]}>{opt.label}</Text>
                <Switch
                  value={!!settings[opt.key as keyof typeof settings]}
                  onValueChange={v => updateSettings({ [opt.key]: v })}
                  trackColor={{ false: C.cardBorder, true: C.gold }}
                  thumbColor={settings[opt.key as keyof typeof settings] ? C.primaryDark : C.textMuted}
                />
              </View>
              {i < arr.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          <Divider />
          <View>
            {TRANSLATIONS.map(t => (
              <Pressable
                key={t.id}
                style={[styles.optionRow, { borderBottomColor: C.cardBorder }, settings.selectedTranslation === t.id && { backgroundColor: `${C.gold}08` }]}
                onPress={() => updateSettings({ selectedTranslation: t.id })}
              >
                <Text style={styles.optionFlag}>{t.flag}</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, { color: C.textPrimary }]}>{t.name}</Text>
                  <Text style={[styles.optionSub, { color: C.textMuted }]}>{t.language}</Text>
                </View>
                {settings.selectedTranslation === t.id && (
                  <MaterialIcons name="check-circle" size={20} color={C.gold} />
                )}
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title="Audio Reciter">
          <View>
            {RECITERS.map(r => (
              <Pressable
                key={r.id}
                style={[styles.optionRow, { borderBottomColor: C.cardBorder }, settings.selectedReciter === r.id && { backgroundColor: `${C.gold}08` }]}
                onPress={() => updateSettings({ selectedReciter: r.id })}
              >
                <Text style={[styles.reciterInitial, { backgroundColor: `${C.primary}40`, color: C.gold }]}>{r.name.charAt(0)}</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, { color: C.textPrimary }]}>{r.name}</Text>
                  <Text style={[styles.optionSub, { color: C.textMuted }]}>{r.arabicName} · {r.style}</Text>
                </View>
                {settings.selectedReciter === r.id && (
                  <MaterialIcons name="check-circle" size={20} color={C.gold} />
                )}
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title="Prayer Times">
          <View>
            {CALCULATION_METHODS.slice(0, 6).map(m => (
              <Pressable
                key={m.id}
                style={[styles.optionRow, { borderBottomColor: C.cardBorder }, settings.prayerCalculationMethod === m.id && { backgroundColor: `${C.gold}08` }]}
                onPress={() => updateSettings({ prayerCalculationMethod: m.id })}
              >
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, { color: C.textPrimary }]}>{m.name}</Text>
                  <Text style={[styles.optionSub, { color: C.textMuted }]}>{m.region}</Text>
                </View>
                {settings.prayerCalculationMethod === m.id && (
                  <MaterialIcons name="check-circle" size={20} color={C.gold} />
                )}
              </Pressable>
            ))}
          </View>
          <Divider />
          <View>
            {MADHABS.map(m => (
              <Pressable
                key={m.id}
                style={[styles.optionRow, { borderBottomColor: C.cardBorder }, settings.madhab === m.id && { backgroundColor: `${C.gold}08` }]}
                onPress={() => updateSettings({ madhab: m.id })}
              >
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, { color: C.textPrimary }]}>{m.name}</Text>
                  <Text style={[styles.optionSub, { color: C.textMuted }]}>{m.description}</Text>
                </View>
                {settings.madhab === m.id && (
                  <MaterialIcons name="check-circle" size={20} color={C.gold} />
                )}
              </Pressable>
            ))}
          </View>
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  section: {},
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  sectionCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  settingLabel: { fontSize: 15, flex: 1 },
  settingValue: { fontSize: 14, textAlign: 'right' },
  divider: { height: 1, marginHorizontal: Spacing.md },
  themeToggle: { flexDirection: 'row', gap: 6 },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.round,
    borderWidth: 1,
  },
  themeBtnText: { fontSize: 12, fontWeight: '500' },
  themeBtnTextActive: { fontWeight: '700' },
  fontSizeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fontBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  optionFlag: { fontSize: 20, width: 28, textAlign: 'center' },
  optionInfo: { flex: 1 },
  optionName: { fontSize: 14, fontWeight: '500' },
  optionSub: { fontSize: 12, marginTop: 1 },
  reciterInitial: {
    width: 36,
    height: 36,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 36,
    fontSize: 16,
    fontWeight: '700',
  },
});
