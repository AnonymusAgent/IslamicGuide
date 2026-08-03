/**
 * Notification Service — Prayer reminders, daily Ayah/Hadith, Azkar & Islamic events.
 * Supports GPS-based dynamic prayer time scheduling from AlAdhan API.
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationSettings } from '../contexts/AppContext';

const GPS_UPDATE_KEY = 'prayer_gps_last_update';
const GPS_UPDATE_INTERVAL = 23 * 60 * 60 * 1000; // 23 hours

// ── Configure notification handler ──────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Permission ───────────────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

// ── Schedule helpers ─────────────────────────────────────────────────────────

async function scheduleDaily(
  identifier: string,
  title: string,
  body: string,
  hour: number,
  minute: number
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: { title, body, sound: true, data: { type: identifier } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch { /* silent */ }
}

async function cancelNotification(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch { /* silent */ }
}

// ── Prayer Time Helpers ───────────────────────────────────────────────────────

function parsePrayerTime(timeStr: string): { hour: number; minute: number } | null {
  if (!timeStr) return null;
  // AlAdhan returns "HH:MM" or "HH:MM (BST)" — take first part
  const clean = timeStr.split(' ')[0];
  const parts = clean.split(':');
  if (parts.length < 2) return null;
  const hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  if (isNaN(hour) || isNaN(minute)) return null;
  return { hour, minute };
}

function adjustForOffset(hour: number, minute: number, minsBefore: number): { hour: number; minute: number } {
  let totalMins = hour * 60 + minute - minsBefore;
  if (totalMins < 0) totalMins += 24 * 60;
  return { hour: Math.floor(totalMins / 60) % 24, minute: totalMins % 60 };
}

// ── GPS-based prayer notification scheduling ─────────────────────────────────

/**
 * Fetches real prayer times from GPS + AlAdhan API and schedules daily notifications.
 * Safe to call on every app open — rate-limited internally to once every ~23 hours.
 */
export async function schedulePrayerNotificationsWithGPS(
  notifSettings: NotificationSettings,
  forceRefresh = false
): Promise<{ success: boolean; source: 'gps' | 'fallback' }> {
  // Rate-limit GPS updates
  if (!forceRefresh) {
    try {
      const lastRaw = await AsyncStorage.getItem(GPS_UPDATE_KEY);
      if (lastRaw) {
        const last = JSON.parse(lastRaw);
        if (Date.now() - last.timestamp < GPS_UPDATE_INTERVAL) {
          // Already scheduled recently — apply settings with last known times
          if (last.timings) {
            await _applyPrayerSchedule(last.timings, notifSettings);
            return { success: true, source: 'gps' };
          }
        }
      }
    } catch { /* ignore */ }
  }

  try {
    // Dynamic import to avoid issues in non-location contexts
    const Location = await import('expo-location');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      await applyAllNotificationSettings(notifSettings);
      return { success: true, source: 'fallback' };
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = pos.coords;

    const res = await Promise.race([
      fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${5}&school=0`
      ),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000)),
    ]) as Response;

    const json = await res.json();
    const timings = json.data?.timings as Record<string, string> | undefined;
    if (!timings) throw new Error('No timings in response');

    // Cache for rate-limiting
    await AsyncStorage.setItem(
      GPS_UPDATE_KEY,
      JSON.stringify({ timestamp: Date.now(), latitude, longitude, timings })
    );

    await _applyPrayerSchedule(timings, notifSettings);
    return { success: true, source: 'gps' };
  } catch {
    // GPS/API failed — fall back to static defaults
    await applyAllNotificationSettings(notifSettings);
    return { success: false, source: 'fallback' };
  }
}

async function _applyPrayerSchedule(
  timings: Record<string, string>,
  notifSettings: NotificationSettings
): Promise<void> {
  const prayerMap: Array<{
    alAdhanKey: string;
    settingKey: keyof NotificationSettings;
    emoji: string;
    label: string;
    body: string;
  }> = [
    {
      alAdhanKey: 'Fajr', settingKey: 'fajrReminder', emoji: '🌙',
      label: 'Fajr Prayer',
      body: 'The dawn prayer is approaching. Rise for Fajr — the prayer of the early risers.',
    },
    {
      alAdhanKey: 'Dhuhr', settingKey: 'dhuhrReminder', emoji: '☀️',
      label: 'Dhuhr Prayer',
      body: 'Time for the midday prayer. Step away and connect with Allah.',
    },
    {
      alAdhanKey: 'Asr', settingKey: 'asrReminder', emoji: '🌤️',
      label: 'Asr Prayer',
      body: 'Asr prayer is approaching. Guard your prayers carefully.',
    },
    {
      alAdhanKey: 'Maghrib', settingKey: 'maghribReminder', emoji: '🌅',
      label: 'Maghrib Prayer',
      body: 'The sun has set — time for Maghrib prayer.',
    },
    {
      alAdhanKey: 'Isha', settingKey: 'ishaReminder', emoji: '🌃',
      label: "Isha' Prayer",
      body: 'The night prayer, Isha, is near. End your day with remembrance.',
    },
  ];

  for (const { alAdhanKey, settingKey, emoji, label, body } of prayerMap) {
    const id = `prayer_${alAdhanKey.toLowerCase()}`;
    if (!notifSettings[settingKey]) {
      await cancelNotification(id);
      continue;
    }

    const parsed = parsePrayerTime(timings[alAdhanKey]);
    if (!parsed) continue;

    const adjusted = adjustForOffset(
      parsed.hour, parsed.minute, notifSettings.reminderMinutesBefore
    );
    await scheduleDaily(id, `${emoji} ${label}`, body, adjusted.hour, adjusted.minute);
  }
}

// ── Prayer Notification (fallback static) ───────────────────────────────────

export async function schedulePrayerNotification(
  prayer: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha',
  hour: number,
  minute: number,
  minutesBefore: number = 10
): Promise<void> {
  const adjusted = adjustForOffset(hour, minute, minutesBefore);
  const bodies: Record<string, string> = {
    Fajr: 'The dawn prayer is approaching. Rise for Fajr.',
    Dhuhr: 'Time for the midday prayer, Dhuhr.',
    Asr: 'Asr prayer time is near.',
    Maghrib: 'Maghrib prayer is approaching as the sun sets.',
    Isha: 'The night prayer, Isha, is near.',
  };
  const emojis: Record<string, string> = {
    Fajr: '🌙', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌅', Isha: '🌃',
  };
  await scheduleDaily(
    `prayer_${prayer.toLowerCase()}`,
    `${emojis[prayer]} ${prayer} Prayer`,
    bodies[prayer],
    adjusted.hour,
    adjusted.minute
  );
}

// ── Daily Islamic Reminders ──────────────────────────────────────────────────

export async function scheduleDailyAyah(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily('daily_ayah', '📖 Verse of the Day', "Open the app for today's Quran verse and reflection.", 7, 0);
  } else {
    await cancelNotification('daily_ayah');
  }
}

export async function scheduleDailyHadith(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily('daily_hadith', '📚 Hadith of the Day', 'A new hadith with authentic citation awaits you.', 8, 0);
  } else {
    await cancelNotification('daily_hadith');
  }
}

export async function scheduleMorningAzkar(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily('morning_azkar', '🌅 Morning Azkar', 'Start your day with the morning remembrances.', 6, 30);
  } else {
    await cancelNotification('morning_azkar');
  }
}

export async function scheduleEveningAzkar(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily('evening_azkar', '🌆 Evening Azkar', 'End your day with the evening remembrances.', 17, 30);
  } else {
    await cancelNotification('evening_azkar');
  }
}

export async function scheduleFridayReminder(enabled: boolean): Promise<void> {
  if (enabled) {
    try {
      await Notifications.cancelScheduledNotificationAsync('friday_reminder').catch(() => {});
      await Notifications.scheduleNotificationAsync({
        identifier: 'friday_reminder',
        content: {
          title: "🕌 Jumu'ah Mubarak",
          body: 'Today is Friday — recite abundant Salawat and read Surah Al-Kahf.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: 6,
          hour: 11,
          minute: 30,
        },
      });
    } catch { /* silent */ }
  } else {
    await cancelNotification('friday_reminder');
  }
}

export async function scheduleTahajjudReminder(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily('tahajjud_reminder', '🌌 Tahajjud Time', 'Rise for the night prayer — the best voluntary prayer.', 3, 30);
  } else {
    await cancelNotification('tahajjud_reminder');
  }
}

export async function scheduleFastingReminder(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily('fasting_reminder', '🌙 Fast Tracker', "Don't forget to log today's fast.", 20, 0);
  } else {
    await cancelNotification('fasting_reminder');
  }
}

// ── Apply all settings (static fallback) ─────────────────────────────────────

export async function applyAllNotificationSettings(
  notifSettings: NotificationSettings
): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  await scheduleDailyAyah(notifSettings.dailyAyah);
  await scheduleDailyHadith(notifSettings.dailyHadith);
  await scheduleMorningAzkar(notifSettings.morningAzkar);
  await scheduleEveningAzkar(notifSettings.eveningAzkar);
  await scheduleFridayReminder(notifSettings.fridayReminder);
  await scheduleTahajjudReminder(notifSettings.tahajjudReminder);
  await scheduleFastingReminder(notifSettings.fastingReminder);

  // Static fallback prayer times
  const fallbackTimes: Record<string, [number, number]> = {
    Fajr: [5, 0], Dhuhr: [12, 30], Asr: [15, 30], Maghrib: [18, 15], Isha: [20, 0],
  };
  const prayerSettingMap: Record<string, keyof NotificationSettings> = {
    Fajr: 'fajrReminder', Dhuhr: 'dhuhrReminder', Asr: 'asrReminder',
    Maghrib: 'maghribReminder', Isha: 'ishaReminder',
  };
  for (const [prayer, key] of Object.entries(prayerSettingMap)) {
    if (notifSettings[key]) {
      const [h, m] = fallbackTimes[prayer];
      await schedulePrayerNotification(prayer as any, h, m, notifSettings.reminderMinutesBefore);
    } else {
      await cancelNotification(`prayer_${prayer.toLowerCase()}`);
    }
  }
}

// ── Cancel all ───────────────────────────────────────────────────────────────

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(GPS_UPDATE_KEY);
  } catch { /* silent */ }
}

export async function getScheduledCount(): Promise<number> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.length;
  } catch {
    return 0;
  }
}
