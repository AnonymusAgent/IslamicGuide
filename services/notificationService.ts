/**
 * Notification Service — Prayer reminders, daily Ayah/Hadith, Azkar & Islamic events
 * Uses expo-notifications for scheduling local notifications
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationSettings } from '../contexts/AppContext';

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

// ── Schedule helper ──────────────────────────────────────────────────────────

async function scheduleDaily(
  identifier: string,
  title: string,
  body: string,
  hour: number,
  minute: number
): Promise<void> {
  try {
    // Cancel any existing notification with this identifier first
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        sound: true,
        data: { type: identifier },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch { /* silent — notifications might be disabled */ }
}

async function cancelNotification(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch { /* silent */ }
}

// ── Prayer Time Notifications ────────────────────────────────────────────────

export async function schedulePrayerNotification(
  prayer: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha',
  hour: number,
  minute: number,
  minutesBefore: number = 10
): Promise<void> {
  const adjustedMinutes = minute - minutesBefore;
  const adjustedHour = adjustedMinutes < 0 ? hour - 1 : hour;
  const finalMinute = adjustedMinutes < 0 ? 60 + adjustedMinutes : adjustedMinutes;
  const finalHour = adjustedHour < 0 ? 23 : adjustedHour;

  const prayerEmojis: Record<string, string> = {
    Fajr: '🌙', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌅', Isha: '🌃',
  };

  const bodies: Record<string, string> = {
    Fajr: 'The dawn prayer is approaching. Rise for Fajr.',
    Dhuhr: 'Time for the midday prayer, Dhuhr.',
    Asr: 'Asr prayer time is near.',
    Maghrib: 'Maghrib prayer is approaching as the sun sets.',
    Isha: 'The night prayer, Isha, is near.',
  };

  await scheduleDaily(
    `prayer_${prayer.toLowerCase()}`,
    `${prayerEmojis[prayer]} ${prayer} Prayer`,
    bodies[prayer],
    finalHour,
    finalMinute
  );
}

// ── Daily Islamic Reminders ──────────────────────────────────────────────────

export async function scheduleDailyAyah(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily(
      'daily_ayah',
      '📖 Verse of the Day',
      'Open the app for today\'s Quran verse and reflection.',
      7, 0
    );
  } else {
    await cancelNotification('daily_ayah');
  }
}

export async function scheduleDailyHadith(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily(
      'daily_hadith',
      '📚 Hadith of the Day',
      'A new hadith with authentic citation awaits you.',
      8, 0
    );
  } else {
    await cancelNotification('daily_hadith');
  }
}

export async function scheduleMorningAzkar(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily(
      'morning_azkar',
      '🌅 Morning Azkar',
      'Start your day with the morning remembrances.',
      6, 30
    );
  } else {
    await cancelNotification('morning_azkar');
  }
}

export async function scheduleEveningAzkar(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily(
      'evening_azkar',
      '🌆 Evening Azkar',
      'End your day with the evening remembrances.',
      17, 30
    );
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
          title: '🕌 Jumu\'ah Mubarak',
          body: 'Today is Friday — recite abundant Salawat and read Surah Al-Kahf.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: 6, // Friday (1=Sunday, 6=Friday)
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
    await scheduleDaily(
      'tahajjud_reminder',
      '🌌 Tahajjud Time',
      'Rise for the night prayer — the best voluntary prayer.',
      3, 30
    );
  } else {
    await cancelNotification('tahajjud_reminder');
  }
}

export async function scheduleFastingReminder(enabled: boolean): Promise<void> {
  if (enabled) {
    await scheduleDaily(
      'fasting_reminder',
      '🌙 Fast Tracker',
      "Don't forget to log today's fast in the Ramadan Companion.",
      20, 0
    );
  } else {
    await cancelNotification('fasting_reminder');
  }
}

// ── Apply all settings ────────────────────────────────────────────────────────

export async function applyAllNotificationSettings(
  notifSettings: NotificationSettings
): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  // Daily reminders
  await scheduleDailyAyah(notifSettings.dailyAyah);
  await scheduleDailyHadith(notifSettings.dailyHadith);
  await scheduleMorningAzkar(notifSettings.morningAzkar);
  await scheduleEveningAzkar(notifSettings.eveningAzkar);
  await scheduleFridayReminder(notifSettings.fridayReminder);
  await scheduleTahajjudReminder(notifSettings.tahajjudReminder);
  await scheduleFastingReminder(notifSettings.fastingReminder);

  // Prayer notifications — use default times (user can configure after enabling GPS)
  const defaultPrayerTimes: Record<string, [number, number]> = {
    Fajr: [5, 0],
    Dhuhr: [12, 30],
    Asr: [15, 30],
    Maghrib: [18, 15],
    Isha: [20, 0],
  };

  const prayerMap: Record<string, keyof NotificationSettings> = {
    Fajr: 'fajrReminder',
    Dhuhr: 'dhuhrReminder',
    Asr: 'asrReminder',
    Maghrib: 'maghribReminder',
    Isha: 'ishaReminder',
  };

  for (const [prayer, key] of Object.entries(prayerMap)) {
    if (notifSettings[key]) {
      const [h, m] = defaultPrayerTimes[prayer];
      await schedulePrayerNotification(
        prayer as any, h, m, notifSettings.reminderMinutesBefore
      );
    } else {
      await cancelNotification(`prayer_${prayer.toLowerCase()}`);
    }
  }
}

// ── Cancel all ───────────────────────────────────────────────────────────────

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch { /* silent */ }
}

// ── Get scheduled count ──────────────────────────────────────────────────────

export async function getScheduledCount(): Promise<number> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.length;
  } catch {
    return 0;
  }
}
