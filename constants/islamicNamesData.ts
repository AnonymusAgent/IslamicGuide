export interface IslamicName {
  id: string;
  name: string;
  arabic: string;
  gender: 'boy' | 'girl';
  meaning: string;
  origin: string;
  popularity: 'very popular' | 'popular' | 'uncommon' | 'rare';
  relatedNames?: string[];
  quranRef?: string;
  propheticRef?: string;
  category: 'prophets' | 'companions' | 'quranic' | 'arabic' | 'persian' | 'turkish';
}

export const ISLAMIC_NAMES: IslamicName[] = [
  // Boys
  { id: 'muhammad', name: 'Muhammad', arabic: 'مُحَمَّد', gender: 'boy', meaning: 'Praiseworthy, the praised one', origin: 'Arabic', popularity: 'very popular', relatedNames: ['Ahmad', 'Mahmud', 'Hamid'], quranRef: 'Al-Ahzab 33:40', category: 'prophets' },
  { id: 'ahmad', name: 'Ahmad', arabic: 'أَحْمَد', gender: 'boy', meaning: 'Most praiseworthy', origin: 'Arabic', popularity: 'very popular', relatedNames: ['Muhammad', 'Mahmud'], quranRef: 'As-Saf 61:6', category: 'prophets' },
  { id: 'ibrahim', name: 'Ibrahim', arabic: 'إِبْرَاهِيم', gender: 'boy', meaning: 'Father of nations', origin: 'Hebrew/Arabic', popularity: 'very popular', quranRef: 'Al-Baqarah 2:124', category: 'prophets' },
  { id: 'yusuf', name: 'Yusuf', arabic: 'يُوسُف', gender: 'boy', meaning: 'God increases', origin: 'Arabic', popularity: 'very popular', quranRef: 'Yusuf 12:4', category: 'prophets' },
  { id: 'musa', name: 'Musa', arabic: 'مُوسَى', gender: 'boy', meaning: 'Drawn from the water', origin: 'Arabic/Hebrew', popularity: 'very popular', quranRef: 'Al-Baqarah 2:51', category: 'prophets' },
  { id: 'isa', name: 'Isa', arabic: 'عِيسَى', gender: 'boy', meaning: 'God is salvation', origin: 'Arabic', popularity: 'popular', quranRef: 'Ali Imran 3:45', category: 'prophets' },
  { id: 'yahya', name: 'Yahya', arabic: 'يَحْيَى', gender: 'boy', meaning: 'God is gracious / He will live', origin: 'Arabic', popularity: 'popular', quranRef: 'Ali Imran 3:39', category: 'prophets' },
  { id: 'dawud', name: 'Dawud', arabic: 'دَاوُد', gender: 'boy', meaning: 'Beloved', origin: 'Arabic/Hebrew', popularity: 'popular', quranRef: 'Al-Baqarah 2:251', category: 'prophets' },
  { id: 'sulayman', name: 'Sulayman', arabic: 'سُلَيْمَان', gender: 'boy', meaning: 'Man of peace', origin: 'Arabic/Hebrew', popularity: 'popular', quranRef: 'Al-Baqarah 2:102', category: 'prophets' },
  { id: 'nuh', name: 'Nuh', arabic: 'نُوح', gender: 'boy', meaning: 'Rest, quiet, repose', origin: 'Arabic', popularity: 'popular', quranRef: 'Nuh 71:26', category: 'prophets' },
  { id: 'ali', name: 'Ali', arabic: 'عَلِي', gender: 'boy', meaning: 'High, lofty, sublime', origin: 'Arabic', popularity: 'very popular', propheticRef: 'Cousin and son-in-law of Prophet Muhammad ﷺ', category: 'companions' },
  { id: 'umar', name: 'Umar', arabic: 'عُمَر', gender: 'boy', meaning: 'Life, long-lived', origin: 'Arabic', popularity: 'very popular', category: 'companions' },
  { id: 'uthman', name: 'Uthman', arabic: 'عُثْمَان', gender: 'boy', meaning: 'Son of a snake (brave)', origin: 'Arabic', popularity: 'popular', category: 'companions' },
  { id: 'abubakar', name: 'Abu Bakr', arabic: 'أَبُو بَكْر', gender: 'boy', meaning: 'Father of the young camel', origin: 'Arabic', popularity: 'popular', category: 'companions' },
  { id: 'hasan', name: 'Hasan', arabic: 'حَسَن', gender: 'boy', meaning: 'Good, handsome', origin: 'Arabic', popularity: 'very popular', category: 'companions' },
  { id: 'husayn', name: 'Husayn', arabic: 'حُسَيْن', gender: 'boy', meaning: 'Good, handsome (diminutive)', origin: 'Arabic', popularity: 'very popular', category: 'companions' },
  { id: 'khalid', name: 'Khalid', arabic: 'خَالِد', gender: 'boy', meaning: 'Eternal, immortal', origin: 'Arabic', popularity: 'very popular', category: 'arabic' },
  { id: 'bilal', name: 'Bilal', arabic: 'بِلَال', gender: 'boy', meaning: 'Moisture, freshness', origin: 'Arabic', popularity: 'very popular', propheticRef: 'First muezzin in Islam', category: 'companions' },
  { id: 'salman', name: 'Salman', arabic: 'سَلْمَان', gender: 'boy', meaning: 'Safe, peaceful', origin: 'Arabic', popularity: 'popular', category: 'companions' },
  { id: 'hamza', name: 'Hamza', arabic: 'حَمْزَة', gender: 'boy', meaning: 'Strong, steadfast, lion', origin: 'Arabic', popularity: 'popular', category: 'companions' },
  { id: 'zaid', name: 'Zaid', arabic: 'زَيْد', gender: 'boy', meaning: 'Growth, abundance', origin: 'Arabic', popularity: 'popular', quranRef: 'Al-Ahzab 33:37', category: 'companions' },
  { id: 'anas', name: 'Anas', arabic: 'أَنَس', gender: 'boy', meaning: 'Friendliness, affection', origin: 'Arabic', popularity: 'popular', category: 'companions' },
  { id: 'abdullah', name: 'Abdullah', arabic: 'عَبْدُالله', gender: 'boy', meaning: 'Servant of Allah', origin: 'Arabic', popularity: 'very popular', category: 'arabic' },
  { id: 'abdurrahman', name: 'Abdurrahman', arabic: 'عَبْدُالرَّحْمَن', gender: 'boy', meaning: 'Servant of the Most Merciful', origin: 'Arabic', popularity: 'very popular', category: 'arabic' },
  { id: 'adam', name: 'Adam', arabic: 'آدَم', gender: 'boy', meaning: 'Man, to make', origin: 'Arabic/Hebrew', popularity: 'very popular', quranRef: 'Al-Baqarah 2:31', category: 'prophets' },
  { id: 'idris', name: 'Idris', arabic: 'إِدْرِيس', gender: 'boy', meaning: 'Interpreter, studious', origin: 'Arabic', popularity: 'popular', quranRef: 'Maryam 19:56', category: 'prophets' },
  { id: 'salih', name: 'Salih', arabic: 'صَالِح', gender: 'boy', meaning: 'Righteous, virtuous', origin: 'Arabic', popularity: 'popular', quranRef: 'Hud 11:61', category: 'prophets' },
  { id: 'talha', name: 'Talha', arabic: 'طَلْحَة', gender: 'boy', meaning: 'Kind of tree', origin: 'Arabic', popularity: 'uncommon', category: 'companions' },
  { id: 'zubayr', name: 'Zubayr', arabic: 'زُبَيْر', gender: 'boy', meaning: 'Strong, brave', origin: 'Arabic', popularity: 'uncommon', category: 'companions' },
  { id: 'muaz', name: 'Muadh', arabic: 'مُعَاذ', gender: 'boy', meaning: 'Protected, one who is protected', origin: 'Arabic', popularity: 'popular', category: 'companions' },
  { id: 'luqman', name: 'Luqman', arabic: 'لُقْمَان', gender: 'boy', meaning: 'Wise man', origin: 'Arabic', popularity: 'popular', quranRef: 'Luqman 31:12', category: 'quranic' },
  { id: 'yunus', name: 'Yunus', arabic: 'يُونُس', gender: 'boy', meaning: 'Dove, peace', origin: 'Arabic', popularity: 'popular', quranRef: 'Yunus 10:98', category: 'prophets' },
  { id: 'haroon', name: 'Haroon', arabic: 'هَارُون', gender: 'boy', meaning: 'High mountain, exalted', origin: 'Arabic/Hebrew', popularity: 'popular', quranRef: 'Ta-Ha 20:30', category: 'prophets' },
  { id: 'taha', name: 'Taha', arabic: 'طَه', gender: 'boy', meaning: 'One of the names of Prophet Muhammad ﷺ', origin: 'Arabic', popularity: 'popular', quranRef: 'Ta-Ha 20:1', category: 'quranic' },
  { id: 'yaseen', name: 'Yaseen', arabic: 'يَس', gender: 'boy', meaning: 'One of the names of Prophet Muhammad ﷺ', origin: 'Arabic', popularity: 'popular', quranRef: 'Ya-Sin 36:1', category: 'quranic' },
  { id: 'ilyas', name: 'Ilyas', arabic: 'إِلْيَاس', gender: 'boy', meaning: 'Yahweh is my God', origin: 'Arabic/Hebrew', popularity: 'uncommon', quranRef: 'Al-Anam 6:85', category: 'prophets' },
  { id: 'ayyub', name: 'Ayyub', arabic: 'أَيُّوب', gender: 'boy', meaning: 'To return to God, patient', origin: 'Arabic', popularity: 'popular', quranRef: 'An-Nisa 4:163', category: 'prophets' },
  { id: 'shuayb', name: 'Shuayb', arabic: 'شُعَيْب', gender: 'boy', meaning: 'Who shows the right path', origin: 'Arabic', popularity: 'uncommon', quranRef: 'Hud 11:84', category: 'prophets' },
  { id: 'umar2', name: 'Imran', arabic: 'عِمْرَان', gender: 'boy', meaning: 'Prosperity, long life', origin: 'Arabic', popularity: 'popular', quranRef: 'Ali Imran 3:33', category: 'quranic' },
  { id: 'rayyan', name: 'Rayyan', arabic: 'رَيَّان', gender: 'boy', meaning: 'Luxuriant, gate of paradise', origin: 'Arabic', popularity: 'popular', propheticRef: 'One of the gates of Paradise', category: 'arabic' },

  // Girls
  { id: 'maryam', name: 'Maryam', arabic: 'مَرْيَم', gender: 'girl', meaning: 'Beloved, exalted', origin: 'Arabic/Hebrew', popularity: 'very popular', quranRef: 'Maryam 19:16', category: 'quranic' },
  { id: 'fatima', name: 'Fatimah', arabic: 'فَاطِمَة', gender: 'girl', meaning: 'One who abstains, captivating', origin: 'Arabic', popularity: 'very popular', propheticRef: 'Daughter of Prophet Muhammad ﷺ', category: 'companions' },
  { id: 'aisha', name: 'Aisha', arabic: 'عَائِشَة', gender: 'girl', meaning: 'Living, life, alive', origin: 'Arabic', popularity: 'very popular', propheticRef: 'Wife of Prophet Muhammad ﷺ', category: 'companions' },
  { id: 'khadijah', name: 'Khadijah', arabic: 'خَدِيجَة', gender: 'girl', meaning: 'Early baby, premature child', origin: 'Arabic', popularity: 'very popular', propheticRef: 'First wife of Prophet Muhammad ﷺ', category: 'companions' },
  { id: 'zainab', name: 'Zainab', arabic: 'زَيْنَب', gender: 'girl', meaning: 'Fragrant flower, adorned', origin: 'Arabic', popularity: 'very popular', category: 'companions' },
  { id: 'sarah', name: 'Sarah', arabic: 'سَارَة', gender: 'girl', meaning: 'Princess, noble lady', origin: 'Arabic/Hebrew', popularity: 'very popular', quranRef: 'Hud 11:71', category: 'quranic' },
  { id: 'hajar', name: 'Hajar', arabic: 'هَاجَر', gender: 'girl', meaning: 'Emigrant, flight', origin: 'Arabic', popularity: 'popular', propheticRef: 'Wife of Prophet Ibrahim ﷺ', category: 'companions' },
  { id: 'asiyah', name: 'Asiyah', arabic: 'آسِيَة', gender: 'girl', meaning: 'She who heals the weak', origin: 'Arabic', popularity: 'popular', propheticRef: 'Wife of Pharaoh who believed in Musa ﷺ', category: 'quranic' },
  { id: 'sumayya', name: 'Sumayya', arabic: 'سُمَيَّة', gender: 'girl', meaning: 'High, elevated', origin: 'Arabic', popularity: 'popular', propheticRef: 'First martyr in Islam', category: 'companions' },
  { id: 'ruqayyah', name: 'Ruqayyah', arabic: 'رُقَيَّة', gender: 'girl', meaning: 'Rise, charm, incantation', origin: 'Arabic', popularity: 'popular', propheticRef: 'Daughter of Prophet Muhammad ﷺ', category: 'companions' },
  { id: 'umkulthum', name: 'Umm Kulthum', arabic: 'أُمُّ كُلْثُوم', gender: 'girl', meaning: 'Mother of a chubby-cheeked child', origin: 'Arabic', popularity: 'popular', propheticRef: 'Daughter of Prophet Muhammad ﷺ', category: 'companions' },
  { id: 'safiyya', name: 'Safiyyah', arabic: 'صَفِيَّة', gender: 'girl', meaning: 'Pure, untroubled', origin: 'Arabic', popularity: 'popular', category: 'companions' },
  { id: 'hafsa', name: 'Hafsa', arabic: 'حَفْصَة', gender: 'girl', meaning: 'Lioness, gathering', origin: 'Arabic', popularity: 'popular', propheticRef: 'Wife of Prophet Muhammad ﷺ', category: 'companions' },
  { id: 'noor', name: 'Noor', arabic: 'نُور', gender: 'girl', meaning: 'Light, glow', origin: 'Arabic', popularity: 'very popular', quranRef: 'An-Nur 24:35', category: 'arabic' },
  { id: 'layla', name: 'Layla', arabic: 'لَيْلَى', gender: 'girl', meaning: 'Night, dark beauty', origin: 'Arabic', popularity: 'very popular', category: 'arabic' },
  { id: 'amina', name: 'Aminah', arabic: 'آمِنَة', gender: 'girl', meaning: 'Trustworthy, honest, faithful', origin: 'Arabic', popularity: 'very popular', propheticRef: 'Mother of Prophet Muhammad ﷺ', category: 'arabic' },
  { id: 'yasmin', name: 'Yasmin', arabic: 'يَاسْمِين', gender: 'girl', meaning: 'Jasmine flower', origin: 'Persian/Arabic', popularity: 'very popular', category: 'persian' },
  { id: 'rania', name: 'Rania', arabic: 'رَانِيَة', gender: 'girl', meaning: 'Gazing, looking', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'sara', name: 'Sara', arabic: 'سَارَا', gender: 'girl', meaning: 'Princess, pure', origin: 'Arabic/Persian', popularity: 'very popular', category: 'arabic' },
  { id: 'hana', name: 'Hana', arabic: 'هَنَاء', gender: 'girl', meaning: 'Happiness, bliss', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'dina', name: 'Dina', arabic: 'دِينَا', gender: 'girl', meaning: 'Judged, obedient to religion', origin: 'Arabic/Hebrew', popularity: 'popular', category: 'arabic' },
  { id: 'huda', name: 'Huda', arabic: 'هُدَى', gender: 'girl', meaning: 'Right guidance', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'iman', name: 'Iman', arabic: 'إِيمَان', gender: 'girl', meaning: 'Faith, belief', origin: 'Arabic', popularity: 'very popular', category: 'arabic' },
  { id: 'sana', name: 'Sana', arabic: 'سَنَاء', gender: 'girl', meaning: 'Radiance, brilliance', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'reem', name: 'Reem', arabic: 'رِيم', gender: 'girl', meaning: 'White gazelle', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'marwa', name: 'Marwa', arabic: 'مَرْوَة', gender: 'girl', meaning: 'A fragrant plant, a hill in Mecca', origin: 'Arabic', popularity: 'popular', quranRef: 'Al-Baqarah 2:158', category: 'quranic' },
  { id: 'safa', name: 'Safa', arabic: 'صَفَاء', gender: 'girl', meaning: 'Clarity, purity, serenity', origin: 'Arabic', popularity: 'popular', quranRef: 'Al-Baqarah 2:158', category: 'quranic' },
  { id: 'malak', name: 'Malak', arabic: 'مَلَاك', gender: 'girl', meaning: 'Angel', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'jinan', name: 'Jinan', arabic: 'جِنَان', gender: 'girl', meaning: 'Gardens of paradise', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'jenna', name: 'Jenna', arabic: 'جَنَّة', gender: 'girl', meaning: 'Heaven, paradise', origin: 'Arabic', popularity: 'very popular', category: 'arabic' },
  { id: 'zahra', name: 'Zahra', arabic: 'زَهْرَاء', gender: 'girl', meaning: 'Radiant, white, shining', origin: 'Arabic', popularity: 'very popular', propheticRef: 'Title of Fatimah RA', category: 'arabic' },
  { id: 'rahma', name: 'Rahma', arabic: 'رَحْمَة', gender: 'girl', meaning: 'Mercy, compassion', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'arwa', name: 'Arwa', arabic: 'أَرْوَى', gender: 'girl', meaning: 'Satisfied, mountain gazelle', origin: 'Arabic', popularity: 'uncommon', category: 'companions' },
  { id: 'nawwal', name: 'Nawal', arabic: 'نَوَال', gender: 'girl', meaning: 'Gift, prize', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'salma', name: 'Salma', arabic: 'سَلْمَى', gender: 'girl', meaning: 'Safe, peaceful', origin: 'Arabic', popularity: 'popular', category: 'arabic' },
  { id: 'bushra', name: 'Bushra', arabic: 'بُشْرَى', gender: 'girl', meaning: 'Good news, glad tidings', origin: 'Arabic', popularity: 'popular', quranRef: 'Yunus 10:64', category: 'quranic' },
  { id: 'tahira', name: 'Tahira', arabic: 'طَاهِرَة', gender: 'girl', meaning: 'Pure, virtuous, chaste', origin: 'Arabic', popularity: 'popular', propheticRef: 'Title given to Khadijah RA', category: 'arabic' },
];

export const NAME_CATEGORIES = [
  { id: 'all', label: 'All Names', color: '#C9A84C' },
  { id: 'prophets', label: 'Prophets', color: '#2D6B57' },
  { id: 'companions', label: 'Companions', color: '#4A9BE8' },
  { id: 'quranic', label: 'Quranic', color: '#9B59B6' },
  { id: 'arabic', label: 'Arabic', color: '#E8803A' },
  { id: 'persian', label: 'Persian', color: '#4CAF7D' },
];
