import React from 'react';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import type { Mosque } from './MosqueMapRenderer.types';

interface Props {
  mapRef: React.RefObject<MapView | null>;
  location: { lat: number; lng: number };
  mosques: Mosque[];
  selectedRadius: number;
  gold: string;
  onMarkerPress: (mosque: Mosque) => void;
  getMarkerColor: (type: Mosque['type']) => string;
}

export function MosqueMapRenderer({
  mapRef, location, mosques, selectedRadius, gold, onMarkerPress, getMarkerColor,
}: Props) {
  return (
    <MapView
      ref={mapRef as any}
      style={{ flex: 1 }}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
      showsUserLocation
      showsMyLocationButton={false}
    >
      <Circle
        center={{ latitude: location.lat, longitude: location.lng }}
        radius={selectedRadius * 1000}
        strokeColor={`${gold}40`}
        fillColor={`${gold}08`}
        strokeWidth={1}
      />
      {mosques.map(mosque => (
        <Marker
          key={mosque.id}
          coordinate={{ latitude: mosque.lat, longitude: mosque.lng }}
          title={mosque.name}
          description={mosque.address || ''}
          pinColor={getMarkerColor(mosque.type)}
          onPress={() => onMarkerPress(mosque)}
        />
      ))}
    </MapView>
  );
}
