import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import {
  fetchPrayerTimesByCoords,
  fetchPrayerTimesByCity,
  PrayerTimesData,
  getNextPrayer,
  formatPrayerTime,
  calculateQiblaDirection,
  calculateDistanceToKaaba,
} from '../services/prayerService';

export function usePrayerTimes(method: number = 3, school: number = 0) {
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadPrayerTimes();
  }, [method, school]);

  const loadPrayerTimes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = location.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        const [data, geocode] = await Promise.all([
          fetchPrayerTimesByCoords(latitude, longitude, method, school),
          Location.reverseGeocodeAsync({ latitude, longitude }),
        ]);

        setPrayerData(data);
        if (geocode.length > 0) {
          const g = geocode[0];
          setLocationName(`${g.city || g.subregion || ''}, ${g.country || ''}`);
        }
      } else {
        // Fallback to Makkah
        const data = await fetchPrayerTimesByCity('Makkah', 'Saudi Arabia', method, school);
        setPrayerData(data);
        setLocationName('Makkah, Saudi Arabia');
      }
    } catch (e) {
      setError('Unable to fetch prayer times. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const nextPrayer = prayerData ? getNextPrayer(prayerData.timings) : null;

  return {
    prayerData,
    loading,
    error,
    locationName,
    coordinates,
    nextPrayer,
    formatPrayerTime,
    reload: loadPrayerTimes,
  };
}

export function useQibla() {
  const [direction, setDirection] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getQiblaDirection();
  }, []);

  const getQiblaDirection = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = location.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setDirection(calculateQiblaDirection(latitude, longitude));
        setDistance(calculateDistanceToKaaba(latitude, longitude));
      } else {
        setError('Location permission required for Qibla direction');
      }
    } catch (e) {
      setError('Unable to determine Qibla direction');
    } finally {
      setLoading(false);
    }
  };

  return { direction, distance, loading, error, coordinates, reload: getQiblaDirection };
}
