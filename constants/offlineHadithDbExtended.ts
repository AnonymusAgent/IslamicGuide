/**
 * Extended Hadith Database — Additional authentic hadiths across all collections.
 * Import is merged automatically in offlineHadithDb.ts exports.
 */

// Inline the interface to avoid circular import
interface HadithEntry {
  id: string;
  collection: string;
  number: number;
  bookName: string;
  chapterName: string;
  arabic: string;
  english: string;
  narrator: string;
  grade: string;
  reference: string;
}

export const EXTENDED_HADITHS: HadithEntry[] = [
  // ── Bukhari Extended ──────────────────────────────────────────────────────
  { id: 'bx_1', collection: 'bukhari', number: 6465,
    bookName: 'Book of Riqaq', chapterName: 'Best deeds are consistent ones',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    english: 'The most beloved deeds to Allah are those done consistently, even if they are few.',
    narrator: 'Aisha (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 6465' },

  { id: 'bx_2', collection: 'bukhari', number: 1887,
    bookName: 'Book of Fasting', chapterName: 'Virtue of Ramadan fasting',
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَاناً وَاحْتِسَاباً غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    english: 'Whoever fasts Ramadan with faith and seeking reward, all his past sins will be forgiven.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 38' },

  { id: 'bx_3', collection: 'bukhari', number: 527,
    bookName: 'Book of Prayer Times', chapterName: 'Virtue of Fajr prayer',
    arabic: 'مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
    english: 'Whoever prays Fajr is under the protection of Allah.',
    narrator: 'Jundab ibn Abdillah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 657' },

  { id: 'bx_4', collection: 'bukhari', number: 5190,
    bookName: 'Book of Marriage', chapterName: 'Good treatment of women',
    arabic: 'اسْتَوْصُوا بِالنِّسَاءِ خَيْراً',
    english: 'Treat women well (be good to women).',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 5186' },

  { id: 'bx_5', collection: 'bukhari', number: 7485,
    bookName: 'Book of Tawhid', chapterName: "Allah's love reaches creation",
    arabic: 'إِذَا أَحَبَّ اللَّهُ عَبْداً نَادَى جِبْرِيلَ: إِنَّ اللَّهَ يُحِبُّ فُلَاناً فَأَحْبِبْهُ',
    english: 'When Allah loves a servant, He calls out to Jibreel: Allah loves so-and-so, so love him.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 7485' },

  { id: 'bx_6', collection: 'bukhari', number: 6014,
    bookName: 'Book of Good Manners', chapterName: 'Rights of the neighbor',
    arabic: 'مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ',
    english: 'Jibreel kept recommending the neighbor to me until I thought he would make him an heir.',
    narrator: 'Aisha (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 6014' },

  { id: 'bx_7', collection: 'bukhari', number: 1417,
    bookName: 'Book of Zakat', chapterName: 'Protect yourself with sadaqah',
    arabic: 'اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ',
    english: 'Protect yourself from the Fire even with half a date (in charity).',
    narrator: 'Adi ibn Hatim (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 1417' },

  { id: 'bx_8', collection: 'bukhari', number: 6407,
    bookName: 'Book of Riqaq', chapterName: 'Dhikr is life of the heart',
    arabic: 'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُ مَثَلُ الْحَيِّ وَالْمَيِّتِ',
    english: 'The example of the one who remembers his Lord vs. one who does not is like the living and the dead.',
    narrator: 'Abu Musa al-Ashari (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 6407' },

  { id: 'bx_9', collection: 'bukhari', number: 6682,
    bookName: 'Book of Riqaq', chapterName: 'Virtues of SubhanAllah',
    arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    english: 'Two phrases are light on the tongue, heavy on the Scale, and beloved to the Most Merciful: SubhanAllahi wa bihamdih, SubhanAllahi al-Azim.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 6682' },

  { id: 'bx_10', collection: 'bukhari', number: 6307,
    bookName: 'Book of Supplications', chapterName: 'Seeking forgiveness',
    arabic: 'إِنِّي لَأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً',
    english: 'I seek forgiveness from Allah and turn to Him in repentance more than seventy times a day.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 6307' },

  // ── Muslim Extended ────────────────────────────────────────────────────────
  { id: 'mx_1', collection: 'muslim', number: 2664,
    bookName: 'Book of Destiny', chapterName: 'The strong believer',
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ',
    english: 'The strong believer is better and more beloved to Allah than the weak believer, though both are good.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 2664' },

  { id: 'mx_2', collection: 'muslim', number: 804,
    bookName: 'Book of Prayer', chapterName: 'Virtue of reciting Quran',
    arabic: 'اقْرَؤُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعاً لِأَصْحَابِهِ',
    english: 'Recite the Quran, for it will come on the Day of Resurrection as an intercessor for its companions.',
    narrator: 'Abu Umamah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 804' },

  { id: 'mx_3', collection: 'muslim', number: 54,
    bookName: 'Book of Faith', chapterName: 'Brotherhood in faith',
    arabic: 'لَا تَدْخُلُوا الْجَنَّةَ حَتَّى تُؤْمِنُوا وَلَا تُؤْمِنُوا حَتَّى تَحَابُّوا',
    english: 'You will not enter Paradise until you believe, and you will not believe until you love one another.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 54' },

  { id: 'mx_4', collection: 'muslim', number: 2956,
    bookName: 'Book of Piety', chapterName: 'This world is a prison for the believer',
    arabic: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
    english: 'This world is a prison for the believer and a paradise for the disbeliever.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 2956' },

  { id: 'mx_5', collection: 'muslim', number: 244,
    bookName: 'Book of Purification', chapterName: 'Wudu purifies sins',
    arabic: 'إِذَا تَوَضَّأَ الْعَبْدُ الْمُسْلِمُ فَغَسَلَ وَجْهَهُ خَرَجَ مِنْ وَجْهِهِ كُلُّ خَطِيئَةٍ',
    english: 'When a Muslim performs wudu and washes his face, every sin he committed with his eyes leaves with the water.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 244' },

  // ── Riyad as-Salihin Extended ──────────────────────────────────────────────
  { id: 'rx_1', collection: 'riyadussaliheen', number: 150,
    bookName: 'Book of Miscellany', chapterName: 'Consistent good deeds',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    english: 'The most beloved deeds to Allah are those done consistently, even if they are small.',
    narrator: 'Aisha (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 6465, Muslim 782' },

  { id: 'rx_2', collection: 'riyadussaliheen', number: 280,
    bookName: 'Book of Miscellany', chapterName: 'Reciting Quran',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best of you are those who learn the Quran and teach it.',
    narrator: 'Uthman ibn Affan (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 5027' },

  { id: 'rx_3', collection: 'riyadussaliheen', number: 195,
    bookName: 'Book of Miscellany', chapterName: 'Rights of parents',
    arabic: 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدَيْنِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدَيْنِ',
    english: "The pleasure of Allah is in the pleasure of the parents, and His anger is in their anger.",
    narrator: 'Abdullah ibn Amr (RA)', grade: 'Sahih', reference: 'Al-Tirmidhi 1899' },

  { id: 'rx_4', collection: 'riyadussaliheen', number: 310,
    bookName: 'Book of Miscellany', chapterName: 'Best dhikr',
    arabic: 'أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ',
    english: 'The best remembrance is La ilaha illallah (There is no god but Allah).',
    narrator: 'Jabir ibn Abdillah (RA)', grade: 'Sahih', reference: 'Al-Tirmidhi 3383' },

  { id: 'rx_5', collection: 'riyadussaliheen', number: 370,
    bookName: 'Book of Miscellany', chapterName: 'Honoring the guest',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ',
    english: 'Whoever believes in Allah and the Last Day, let him honor his guest.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 6018' },

  { id: 'rx_6', collection: 'riyadussaliheen', number: 250,
    bookName: 'Book of Miscellany', chapterName: 'Istighfar',
    arabic: 'مَنْ لَزِمَ الاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجاً وَمِنْ كُلِّ هَمٍّ فَرَجاً',
    english: 'Whoever is constant in seeking forgiveness, Allah will make for him a way out of every distress and relief from every worry.',
    narrator: 'Abdullah ibn Abbas (RA)', grade: 'Sahih', reference: 'Abu Dawud 1518' },

  // ── Tirmidhi Extended ─────────────────────────────────────────────────────
  { id: 'tx_1', collection: 'tirmidhi', number: 2671,
    bookName: 'Book of Knowledge', chapterName: 'Pointing to good',
    arabic: 'الدَّالُّ عَلَى الْخَيْرِ كَفَاعِلِهِ',
    english: 'The one who guides others to good is like the one who does it.',
    narrator: 'Anas ibn Malik (RA)', grade: 'Sahih', reference: 'Al-Tirmidhi 2671' },

  { id: 'tx_2', collection: 'tirmidhi', number: 3383,
    bookName: 'Book of Supplication', chapterName: 'Best supplication',
    arabic: 'أَفْضَلُ الدُّعَاءِ الْحَمْدُ لِلَّهِ',
    english: 'The best supplication is Alhamdulillah (All praise be to Allah).',
    narrator: 'Jabir ibn Abdillah (RA)', grade: 'Hasan', reference: 'Al-Tirmidhi 3383' },

  { id: 'tx_3', collection: 'tirmidhi', number: 2509,
    bookName: 'Book of Righteousness', chapterName: 'Reconciling between people',
    arabic: 'أَلَا أُخْبِرُكُمْ بِأَفْضَلَ مِنْ دَرَجَةِ الصِّيَامِ وَالصَّلَاةِ وَالصَّدَقَةِ؟ إِصْلَاحُ ذَاتِ الْبَيْنِ',
    english: 'Shall I not inform you of what is better than fasting, prayer and charity? Reconciling between people (making peace).',
    narrator: 'Abu Darda (RA)', grade: 'Sahih', reference: 'Al-Tirmidhi 2509' },

  // ── Abu Dawood Extended ───────────────────────────────────────────────────
  { id: 'adx_1', collection: 'abudawood', number: 1518,
    bookName: 'Book of Prayer', chapterName: 'Virtue of istighfar',
    arabic: 'مَنْ لَزِمَ الاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجاً',
    english: 'Whoever holds fast to seeking forgiveness, Allah will make for him a way out of every distress.',
    narrator: 'Ibn Abbas (RA)', grade: 'Sahih', reference: 'Abu Dawud 1518' },

  { id: 'adx_2', collection: 'abudawood', number: 4919,
    bookName: 'Book of Good Manners', chapterName: 'Making peace between people',
    arabic: 'إِصْلَاحُ ذَاتِ الْبَيْنِ أَفْضَلُ مِنْ عَامَّةِ الصَّلَاةِ وَالصِّيَامِ',
    english: 'Reconciling between people is better than general (voluntary) prayer and fasting.',
    narrator: 'Abu Darda (RA)', grade: 'Sahih', reference: 'Abu Dawud 4919' },

  // ── Nasa'i Extended ───────────────────────────────────────────────────────
  { id: 'nx_1', collection: 'nasai', number: 1140,
    bookName: 'Book of Prayer', chapterName: 'Night prayer',
    arabic: 'عَلَيْكُمْ بِقِيَامِ اللَّيْلِ فَإِنَّهُ دَأَبُ الصَّالِحِينَ قَبْلَكُمْ وَقُرْبَةٌ إِلَى اللَّهِ',
    english: 'You must pray the night prayer, for it is the custom of the righteous before you and draws you close to Allah.',
    narrator: 'Abu Umamah (RA)', grade: 'Hasan', reference: 'Al-Tirmidhi 2549' },

  { id: 'nx_2', collection: 'nasai', number: 3102,
    bookName: 'Book of Marriage', chapterName: 'Fear Allah regarding women',
    arabic: 'اتَّقُوا اللَّهَ فِي النِّسَاءِ فَإِنَّكُمْ أَخَذْتُمُوهُنَّ بِأَمَانَةِ اللَّهِ',
    english: 'Fear Allah concerning women — you have taken them as a trust from Allah.',
    narrator: 'Jabir ibn Abdillah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 1218' },

  // ── Ibn Majah Extended ────────────────────────────────────────────────────
  { id: 'imx_1', collection: 'ibnmajah', number: 277,
    bookName: 'Book of Sunnah', chapterName: 'Path of knowledge leads to Paradise',
    arabic: 'مَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً سَهَّلَ اللَّهُ لَهُ طَرِيقاً إِلَى الْجَنَّةِ',
    english: 'Whoever takes a path seeking knowledge, Allah will ease for him a path to Paradise.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 2699' },

  { id: 'imx_2', collection: 'ibnmajah', number: 4260,
    bookName: 'Book of Zuhd', chapterName: 'Account yourself before you are accounted',
    arabic: 'الْكَيِّسُ مَنْ دَانَ نَفْسَهُ وَعَمِلَ لِمَا بَعْدَ الْمَوْتِ',
    english: 'The wise person is one who calls himself to account and works for what comes after death.',
    narrator: 'Shaddad ibn Aws (RA)', grade: 'Hasan', reference: 'Ibn Majah 4260' },

  // ── Muwatta Malik Extended ────────────────────────────────────────────────
  { id: 'mk_3', collection: 'malik', number: 1644,
    bookName: 'Book of Good Character', chapterName: 'Good manners in seeking provision',
    arabic: 'اتَّقُوا اللَّهَ وَأَجْمِلُوا فِي الطَّلَبِ',
    english: 'Fear Allah and be moderate (good) in your pursuit of provision.',
    narrator: 'Jabir ibn Abdillah (RA)', grade: 'Hasan Sahih', reference: 'Ibn Majah 2144' },

  // ── Bulugh al-Maram ────────────────────────────────────────────────────────
  { id: 'bl_1', collection: 'bulugh', number: 311,
    bookName: 'Book of Prayer', chapterName: 'Virtue of congregational prayer',
    arabic: 'صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً',
    english: 'The congregational prayer is twenty-seven degrees superior to the individual prayer.',
    narrator: 'Abdullah ibn Umar (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 645' },

  { id: 'bl_2', collection: 'bulugh', number: 554,
    bookName: 'Book of Fasting', chapterName: 'Gates of Paradise opened in Ramadan',
    arabic: 'إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ وَغُلِّقَتْ أَبْوَابُ النَّارِ',
    english: 'When Ramadan arrives, the gates of Paradise are opened and the gates of Hellfire are closed.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 1899' },

  { id: 'bl_3', collection: 'bulugh', number: 461,
    bookName: 'Book of Zakah', chapterName: 'Charity extinguishes sin',
    arabic: 'الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ',
    english: 'Charity extinguishes sin just as water extinguishes fire.',
    narrator: 'Muadh ibn Jabal (RA)', grade: 'Sahih', reference: 'Al-Tirmidhi 2616' },

  { id: 'bl_4', collection: 'bulugh', number: 893,
    bookName: 'Book of Marriage', chapterName: 'Criteria for choosing a spouse',
    arabic: 'فَاظْفَرْ بِذَاتِ الدِّينِ تَرِبَتْ يَدَاكَ',
    english: 'Choose the religious woman, may your hands prosper.',
    narrator: 'Abu Hurayrah (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 5090' },

  { id: 'bl_5', collection: 'bulugh', number: 621,
    bookName: 'Book of Fasting', chapterName: 'Laylat al-Qadr',
    arabic: 'تَحَرَّوْا لَيْلَةَ الْقَدْرِ فِي الْوِتْرِ مِنَ الْعَشْرِ الأَوَاخِرِ مِنْ رَمَضَانَ',
    english: 'Seek the Night of Power in the odd nights of the last ten nights of Ramadan.',
    narrator: 'Aisha (RA)', grade: 'Sahih', reference: 'Sahih al-Bukhari 2017' },

  { id: 'bl_6', collection: 'bulugh', number: 1002,
    bookName: 'Book of Financial Transactions', chapterName: 'Prohibition of usury',
    arabic: 'لَعَنَ رَسُولُ اللَّهِ آكِلَ الرِّبَا وَمُوكِلَهُ وَكَاتِبَهُ وَشَاهِدَيْهِ',
    english: 'The Prophet cursed the consumer of usury, the one who pays it, the one who records it, and the two witnesses.',
    narrator: 'Jabir ibn Abdillah (RA)', grade: 'Sahih', reference: 'Sahih Muslim 1598' },
];
