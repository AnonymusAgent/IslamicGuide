export const CALCULATION_METHODS = [
  { id: 2, name: 'Islamic Society of North America (ISNA)', region: 'North America' },
  { id: 1, name: 'University of Islamic Sciences, Karachi', region: 'Pakistan/South Asia' },
  { id: 3, name: 'Muslim World League', region: 'Global' },
  { id: 4, name: 'Umm Al-Qura University, Makkah', region: 'Saudi Arabia' },
  { id: 5, name: 'Egyptian General Authority of Survey', region: 'Egypt' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran', region: 'Iran' },
  { id: 8, name: 'Gulf Region', region: 'Gulf Countries' },
  { id: 9, name: 'Kuwait', region: 'Kuwait' },
  { id: 10, name: 'Qatar', region: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore', region: 'Singapore' },
  { id: 12, name: 'Union Organization islamic de France', region: 'France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey', region: 'Turkey' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia', region: 'Russia' },
];

export const MADHABS = [
  { id: 0, name: 'Shafi, Maliki and Hanbali', description: 'Shadow = object length' },
  { id: 1, name: 'Hanafi', description: 'Shadow = 2 x object length' },
];

export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌙',
  Sunrise: '🌅',
  Dhuhr: '☀️',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌃',
};

export const PRAYER_COLORS: Record<string, string> = {
  Fajr: '#4A6B8A',
  Sunrise: '#E8C87A',
  Dhuhr: '#F5A623',
  Asr: '#E8803A',
  Maghrib: '#C96B4A',
  Isha: '#2D3B7A',
};
