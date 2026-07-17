export interface HadithCollection {
  id: string;
  name: string;
  arabicName: string;
  scholar: string;
  description: string;
  totalHadiths: number;
  icon: string;
  color: string;
}

export interface Hadith {
  id: string;
  collection: string;
  bookNumber: number;
  bookName: string;
  chapterName: string;
  hadithNumber: number;
  arabic?: string;
  english: string;
  urdu?: string;
  narrator: string;
  grade?: string;
  reference: string;
}

export const HADITH_COLLECTIONS: HadithCollection[] = [
  {
    id: 'bukhari',
    name: 'Sahih al-Bukhari',
    arabicName: 'صحيح البخاري',
    scholar: 'Imam Muhammad ibn Ismail al-Bukhari (810-870 CE)',
    description: 'The most authentic book after the Holy Quran. Compiled by Imam Bukhari over 16 years.',
    totalHadiths: 7563,
    icon: '📗',
    color: '#2D6B57',
  },
  {
    id: 'muslim',
    name: 'Sahih Muslim',
    arabicName: 'صحيح مسلم',
    scholar: 'Imam Muslim ibn al-Hajjaj (815-875 CE)',
    description: 'Second most authentic hadith collection. One of the Kutub al-Sittah.',
    totalHadiths: 7500,
    icon: '📘',
    color: '#2D4A6B',
  },
  {
    id: 'abudawood',
    name: 'Sunan Abu Dawood',
    arabicName: 'سنن أبي داود',
    scholar: 'Imam Abu Dawood Sulaiman ibn al-Ash\'ath (817-889 CE)',
    description: 'One of the six major hadith collections, focused on legal matters.',
    totalHadiths: 5274,
    icon: '📙',
    color: '#6B4A2D',
  },
  {
    id: 'tirmidhi',
    name: "Jami' at-Tirmidhi",
    arabicName: 'جامع الترمذي',
    scholar: "Imam Muhammad ibn Isa at-Tirmidhi (824-892 CE)",
    description: 'Known for its unique classification of hadith grades.',
    totalHadiths: 3956,
    icon: '📕',
    color: '#6B2D2D',
  },
  {
    id: 'nasai',
    name: "Sunan an-Nasa'i",
    arabicName: 'سنن النسائي',
    scholar: "Imam Ahmad ibn Shu'ayb an-Nasa'i (829-915 CE)",
    description: 'Known for its high standards of hadith authenticity.',
    totalHadiths: 5761,
    icon: '📓',
    color: '#4A2D6B',
  },
  {
    id: 'ibnmajah',
    name: 'Sunan Ibn Majah',
    arabicName: 'سنن ابن ماجه',
    scholar: 'Imam Muhammad ibn Yazid ibn Majah (824-887 CE)',
    description: 'Sixth of the six major Sunni hadith collections.',
    totalHadiths: 4341,
    icon: '📔',
    color: '#2D6B4A',
  },
  {
    id: 'riyadussaliheen',
    name: 'Riyad-us-Saliheen',
    arabicName: 'رياض الصالحين',
    scholar: 'Imam Yahya ibn Sharaf an-Nawawi (1233-1277 CE)',
    description: 'Gardens of the Righteous - a popular collection of everyday guidance.',
    totalHadiths: 1896,
    icon: '🌿',
    color: '#3A6B2D',
  },
  {
    id: 'nawawi40',
    name: '40 Hadith Nawawi',
    arabicName: 'الأربعون النووية',
    scholar: 'Imam Yahya ibn Sharaf an-Nawawi (1233-1277 CE)',
    description: 'A collection of 42 hadith encompassing the fundamentals of Islam.',
    totalHadiths: 42,
    icon: '⭐',
    color: '#C9A84C',
  },
];

export const SAMPLE_HADITHS: Hadith[] = [
  {
    id: 'bukhari_1',
    collection: 'bukhari',
    bookNumber: 1,
    bookName: 'Revelation',
    chapterName: 'How the Divine Revelation started',
    hadithNumber: 1,
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    english: 'The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.',
    narrator: 'Umar ibn al-Khattab (RA)',
    grade: 'Sahih',
    reference: 'Sahih al-Bukhari 1, Book 1, Hadith 1',
  },
  {
    id: 'bukhari_2',
    collection: 'bukhari',
    bookNumber: 2,
    bookName: 'Belief',
    chapterName: 'Fundamentals of Faith',
    hadithNumber: 8,
    arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ',
    english: "Islam is based on five things: testifying that there is no god but Allah and that Muhammad is His messenger, performing the prayers, paying the Zakat, making the pilgrimage to the House, and fasting in Ramadan.",
    narrator: 'Ibn Umar (RA)',
    grade: 'Sahih',
    reference: 'Sahih al-Bukhari 8, Book 2, Hadith 1',
  },
  {
    id: 'muslim_1',
    collection: 'muslim',
    bookNumber: 1,
    bookName: 'Faith',
    chapterName: 'The Pillars of Islam',
    hadithNumber: 16,
    arabic: 'الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ',
    english: "Islam is that you testify that there is no god but Allah and that Muhammad is the messenger of Allah, and you establish prayer, and you pay the Zakat, and you observe the fast of Ramadan, and you perform the pilgrimage to the House if you have the means to do so.",
    narrator: 'Umar ibn al-Khattab (RA)',
    grade: 'Sahih',
    reference: 'Sahih Muslim 16a, Book 1, Hadith 5',
  },
  {
    id: 'nawawi40_1',
    collection: 'nawawi40',
    bookNumber: 1,
    bookName: '40 Hadith Nawawi',
    chapterName: 'Actions by Intentions',
    hadithNumber: 1,
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    english: 'Actions are judged by intentions, so each man will have what he intended.',
    narrator: 'Umar ibn al-Khattab (RA)',
    grade: 'Sahih',
    reference: 'Nawawi Hadith 1 - Al-Bukhari & Muslim',
  },
  {
    id: 'nawawi40_2',
    collection: 'nawawi40',
    bookNumber: 1,
    bookName: '40 Hadith Nawawi',
    chapterName: 'Definition of Islam, Iman and Ihsan',
    hadithNumber: 2,
    arabic: 'الإِيمَانُ أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ',
    english: 'Faith is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in divine destiny, both the good and the evil thereof.',
    narrator: 'Umar ibn al-Khattab (RA)',
    grade: 'Sahih',
    reference: 'Nawawi Hadith 2 - Muslim',
  },
  {
    id: 'nawawi40_3',
    collection: 'nawawi40',
    bookNumber: 1,
    bookName: '40 Hadith Nawawi',
    chapterName: 'Pillars of Islam',
    hadithNumber: 3,
    arabic: 'بُنِيَ الإِسْلامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لا إِلَهَ إلاَّ الله',
    english: 'Islam has been built on five things: Testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, performing prayers, paying Zakat, making the pilgrimage, and fasting Ramadan.',
    narrator: 'Ibn Umar (RA)',
    grade: 'Sahih',
    reference: 'Nawawi Hadith 3 - Al-Bukhari & Muslim',
  },
];
