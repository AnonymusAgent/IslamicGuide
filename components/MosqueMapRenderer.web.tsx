
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Mosque } from './MosqueMapRenderer.types';

interface Props {
  mapRef?: any;
  location: { lat: number; lng: number };
  mosques: Mosque[];
  selectedRadius: number;
  gold: string;
  onMarkerPress: (mosque: Mosque) => void;
  getMarkerColor: (type: Mosque['type']) => string;
}

// Web fallback: react-native-maps is mobile-only.
// Display an OpenStreetMap embed instead.
export function MosqueMapRenderer({ location, mosques, onMarkerPress, gold }: Props) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.05}%2C${location.lat - 0.05}%2C${location.lng + 0.05}%2C${location.lat + 0.05}&layer=mapnik&marker=${location.lat}%2C${location.lng}`;

  return (
    <View style={styles.container}>
      {/* The following comment is removed because the ESLint rule definition was not found. */}
      {/* @ts-ignore */}
      <iframe
        src={mapUrl}
        style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
        title="Mosque Map"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      {mosques.length > 0 && (
        <View style={[styles.countBadge, { backgroundColor: `${gold}20` }]}>
          <Text style={[styles.countText, { color: gold }]}>
            {mosques.length} mosque{mosques.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  countBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: { fontSize: 13, fontWeight: '600' },
});
