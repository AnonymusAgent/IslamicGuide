import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, ActivityIndicator, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import { useQibla } from '../hooks/usePrayer';
import { Magnetometer } from 'expo-sensors';

export default function QiblaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: C } = useApp();
  const { direction, distance, loading, error, coordinates, reload } = useQibla();
  const [compassHeading, setCompassHeading] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotateAnimCompass = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let sub: any;
    Magnetometer.isAvailableAsync().then(available => {
      if (available) {
        Magnetometer.setUpdateInterval(100);
        sub = Magnetometer.addListener(data => {
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          if (angle < 0) angle += 360;
          setCompassHeading(angle);
        });
      }
    });
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    if (direction !== null) {
      const qiblaRotation = direction - compassHeading;
      Animated.spring(rotateAnim, { toValue: qiblaRotation, useNativeDriver: true, damping: 10, stiffness: 100 }).start();
      Animated.spring(rotateAnimCompass, { toValue: -compassHeading, useNativeDriver: true, damping: 10, stiffness: 100 }).start();
    }
  }, [direction, compassHeading]);

  const needleRotation = rotateAnim.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] });
  const compassRotation = rotateAnimCompass.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] });

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: C.background, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={C.gold} />
        <Text style={[styles.loadingText, { color: C.textSecondary }]}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: C.cardBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={C.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Qibla Direction</Text>
          <Text style={[styles.headerSub, { color: C.textMuted }]}>Direction towards Al-Ka'bah</Text>
        </View>
        <Pressable onPress={reload} style={styles.refreshBtn}>
          <MaterialIcons name="refresh" size={20} color={C.gold} />
        </Pressable>
      </View>

      <View style={styles.compassArea}>
        {error ? (
          <View style={styles.errorArea}>
            <MaterialIcons name="location-off" size={48} color={C.error} />
            <Text style={[styles.errorText, { color: C.error }]}>{error}</Text>
            <Pressable style={[styles.retryBtn, { backgroundColor: C.primary }]} onPress={reload}>
              <Text style={[styles.retryText, { color: C.gold }]}>Enable Location</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Animated.View style={[styles.compassRose, { borderColor: `${C.gold}30`, backgroundColor: `${C.primary}10`, transform: [{ rotate: compassRotation }] }]}>
              {['N', 'E', 'S', 'W'].map((dir, i) => (
                <View key={dir} style={[styles.compassPoint, { transform: [{ rotate: `${i * 90}deg` }] }]}>
                  <Text style={[styles.compassLetter, { color: C.textSecondary }, dir === 'N' && { color: C.gold, fontSize: 16 }]}>{dir}</Text>
                </View>
              ))}
              {Array.from({ length: 36 }).map((_, i) => (
                <View key={i} style={[styles.degreeMark, { backgroundColor: `${C.gold}40`, transform: [{ rotate: `${i * 10}deg` }, { translateY: -110 }], height: i % 3 === 0 ? 10 : 5 }]} />
              ))}
            </Animated.View>

            <Animated.View style={[styles.needleContainer, { transform: [{ rotate: needleRotation }] }]}>
              <View style={[styles.needleUp, { backgroundColor: C.gold }]} />
              <View style={[styles.needleCenter, { backgroundColor: C.textPrimary, borderColor: C.gold }]} />
              <View style={[styles.needleDown, { backgroundColor: C.textMuted }]} />
            </Animated.View>

            <View style={styles.kaabaIcon}>
              <Text style={styles.kaabaEmoji}>🕋</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.infoRow}>
        {[
          { label: 'Qibla Direction', value: direction !== null ? `${Math.round(direction)}°` : '--', sub: 'from North' },
          { label: 'Distance', value: distance !== null ? `${distance.toLocaleString()}` : '--', sub: 'km to Kaaba' },
          { label: 'Compass', value: `${Math.round(compassHeading)}°`, sub: 'current heading' },
        ].map(({ label, value, sub }) => (
          <View key={label} style={[styles.infoCard, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
            <Text style={[styles.infoLabel, { color: C.textMuted }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: C.gold }]}>{value}</Text>
            <Text style={[styles.infoSub, { color: C.textMuted }]}>{sub}</Text>
          </View>
        ))}
      </View>

      {coordinates && (
        <View style={styles.coordCard}>
          <MaterialIcons name="location-on" size={14} color={C.textMuted} />
          <Text style={[styles.coordText, { color: C.textMuted }]}>
            {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
          </Text>
        </View>
      )}

      <View style={[styles.calibrateNote, { backgroundColor: `${C.info}10`, borderColor: `${C.info}20` }]}>
        <MaterialIcons name="info-outline" size={14} color={C.textMuted} />
        <Text style={[styles.calibrateText, { color: C.textMuted }]}>
          Move device in figure-8 to calibrate compass. Keep away from metal objects.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 15 },
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
  refreshBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  compassArea: { height: 280, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl },
  errorArea: { alignItems: 'center', gap: 12 },
  errorText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: Radius.md },
  retryText: { fontWeight: '600' },
  compassRose: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassPoint: { position: 'absolute', top: 8, alignItems: 'center', width: 30 },
  compassLetter: { fontSize: 14, fontWeight: '700' },
  degreeMark: { position: 'absolute', top: 0, width: 2, borderRadius: 1 },
  needleContainer: { position: 'absolute', alignItems: 'center', height: 200, justifyContent: 'center' },
  needleUp: { width: 6, height: 80, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  needleCenter: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  needleDown: { width: 6, height: 60, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  kaabaIcon: { position: 'absolute', top: -20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  kaabaEmoji: { fontSize: 28 },
  infoRow: { flexDirection: 'row', gap: 12, paddingHorizontal: Spacing.md, marginTop: Spacing.xl },
  infoCard: { flex: 1, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1 },
  infoLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 },
  infoValue: { fontSize: 22, fontWeight: '700', marginTop: 4 },
  infoSub: { fontSize: 11, marginTop: 2 },
  coordCard: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.md, marginTop: Spacing.md },
  coordText: { fontSize: 12 },
  calibrateNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, margin: Spacing.md, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1 },
  calibrateText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
