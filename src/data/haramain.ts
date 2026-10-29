export interface HaramainImam {
  id: string;
  name: string;
  arabicName: string;
  title: string;
  sanctuary: 'makkah' | 'madinah';
  sanctuaryName: string;
  sanctuaryArabic: string;
  radioUrl?: string;
  reciterId?: string; // links to RECITERS catalog
  bio: string;
  yearsOfImamate: string;
  audioFeatures: string[];
}

export const HARAMAIN_IMAMS: HaramainImam[] = [
  // ==========================================
  // MASJID AL-HARAM, MAKKAH (المسجد الحرام)
  // ==========================================
  {
    id: 'sudais',
    name: 'Sheikh Dr. Abdul Rahman Al-Sudais',
    arabicName: 'الشيخ د. عبد الرحمن السديس',
    title: 'General President for the Affairs of the Two Holy Mosques & Senior Imam',
    sanctuary: 'makkah',
    sanctuaryName: 'Masjid Al-Haram, Makkah',
    sanctuaryArabic: 'المسجد الحرام بمكة المكرمة',
    radioUrl: 'https://backup.qurango.net/radio/abdulrahman_alsudaes',
    reciterId: 'abdul-rahman-al-sudais',
    bio: 'Chief Imam of the Grand Mosque in Makkah since 1984 (1404 AH). His distinct, resonant tone and tearful supplications during Khatm Al-Quran in Ramadan are known to hundreds of millions across the globe.',
    yearsOfImamate: '1984 – Present',
    audioFeatures: ['24/7 Live Radio Feed', 'Taraweeh Recordings', 'Complete 114 Surahs Studio', 'Khatm Al-Quran Duas']
  },
  {
    id: 'shuraim',
    name: 'Sheikh Dr. Saud Al-Shuraim',
    arabicName: 'الشيخ د. سعود الشريم',
    title: 'Former Senior Imam & Khatib of the Grand Mosque',
    sanctuary: 'makkah',
    sanctuaryName: 'Masjid Al-Haram, Makkah',
    sanctuaryArabic: 'المسجد الحرام بمكة المكرمة',
    radioUrl: 'https://backup.qurango.net/radio/saud_alshuraim',
    reciterId: 'saud-al-shuraim',
    bio: 'Revered longtime Imam and Khatib of Masjid Al-Haram for over three decades (1991–2022). Renowned for his solemn, steady cadence, poetic eloquence, and iconic Taraweeh recitations alongside Sheikh Al-Sudais.',
    yearsOfImamate: '1991 – 2022',
    audioFeatures: ['24/7 Live Radio Stream', 'Historic Taraweeh Archives', 'Complete 114 Surahs']
  },
  {
    id: 'maher',
    name: 'Sheikh Dr. Maher Al-Muaiqly',
    arabicName: 'الشيخ د. ماهر المعيقلي',
    title: 'Imam & Khatib of the Grand Mosque in Makkah',
    sanctuary: 'makkah',
    sanctuaryName: 'Masjid Al-Haram, Makkah',
    sanctuaryArabic: 'المسجد الحرام بمكة المكرمة',
    radioUrl: 'https://backup.qurango.net/radio/maher',
    reciterId: 'maher-al-muaiqly',
    bio: 'Leading Imam of the Grand Mosque since 2007. Celebrated worldwide for his crystalline pronunciation, comforting emotional warmth, and crystal-clear stops that make listening and memorization serene.',
    yearsOfImamate: '2007 – Present',
    audioFeatures: ['24/7 Dedicated Radio Stream', 'Haramain Live Prayers', 'Complete 114 Surahs']
  },
  {
    id: 'dosari',
    name: 'Sheikh Dr. Yasser Al-Dosari',
    arabicName: 'الشيخ د. ياسر الدوسري',
    title: 'Imam & Khatib of the Grand Mosque in Makkah',
    sanctuary: 'makkah',
    sanctuaryName: 'Masjid Al-Haram, Makkah',
    sanctuaryArabic: 'المسجد الحرام بمكة المكرمة',
    radioUrl: 'https://backup.qurango.net/radio/yasser_aldosari',
    reciterId: 'yasser-al-dosari',
    bio: 'Appointed Imam of Masjid Al-Haram by royal decree in 2019. Renowned for his vocal power, poignant delivery, and emotional depth in leading Tahajjud and Taraweeh.',
    yearsOfImamate: '2019 – Present',
    audioFeatures: ['24/7 Live Radio Broadcast', 'Tahajjud & Taraweeh Master', 'Complete 114 Surahs']
  },
  {
    id: 'baleela',
    name: 'Sheikh Dr. Bandar Baleela',
    arabicName: 'الشيخ د. بندر بليلة',
    title: 'Imam & Khatib of the Grand Mosque & Senior Scholars Council Member',
    sanctuary: 'makkah',
    sanctuaryName: 'Masjid Al-Haram, Makkah',
    sanctuaryArabic: 'المسجد الحرام بمكة المكرمة',
    radioUrl: 'https://backup.qurango.net/radio/bandar_balilah',
    reciterId: 'bandar-baleela',
    bio: 'Born in Makkah and educated in its prestigious institutions, appointed Imam in 2013 and gave the Khutbah of Arafat in 2021. Revered for his soothing melody and disciplined Tajweed pacing.',
    yearsOfImamate: '2013 – Present',
    audioFeatures: ['24/7 Live Stream', 'Arafat Khutbah Archive', 'Complete 114 Surahs']
  },
  {
    id: 'juhany',
    name: 'Sheikh Dr. Abdullah Awad Al-Juhany',
    arabicName: 'الشيخ د. عبد الله عواد الجهني',
    title: 'Imam & Khatib of the Grand Mosque in Makkah',
    sanctuary: 'makkah',
    sanctuaryName: 'Masjid Al-Haram, Makkah',
    sanctuaryArabic: 'المسجد الحرام بمكة المكرمة',
    radioUrl: 'https://backup.qurango.net/radio/abdullah_aljohany',
    bio: 'Unique among contemporary Imams for having led prayers in all four major sacred mosques: Masjid Quba, Masjid Al-Qiblatayn, Masjid An-Nabawi, and Masjid Al-Haram.',
    yearsOfImamate: '2007 – Present',
    audioFeatures: ['24/7 Live Radio', 'Taraweeh Live Archives', 'Impeccable Tajweed Timing']
  },

  // ==========================================
  // MASJID AN-NABAWI, MADINAH (المسجد النبوي)
  // ==========================================
  {
    id: 'hudhaifi',
    name: 'Sheikh Dr. Ali Al-Hudhaify',
    arabicName: 'الشيخ د. علي بن عبد الرحمن الحذيفي',
    title: 'Chief Imam & Khatib of the Prophet’s Mosque in Madinah',
    sanctuary: 'madinah',
    sanctuaryName: 'Masjid An-Nabawi, Madinah',
    sanctuaryArabic: 'المسجد النبوي الشريف بالمدينة المنورة',
    radioUrl: 'https://backup.qurango.net/radio/ali_alhuthaifi',
    reciterId: 'ali-al-hudhaify',
    bio: 'The longest-serving active Imam of the Prophet’s Mosque (since 1979 / 1399 AH). Revered across the Muslim world as the gold standard of Tajweed precision, measured cadence, and classical pauses.',
    yearsOfImamate: '1979 – Present',
    audioFeatures: ['24/7 Live Radio Stream', 'Madinah Official Moshaf', 'Hafs, Qalun & Shu\'bah']
  },
  {
    id: 'budair',
    name: 'Sheikh Dr. Salah Al-Budair',
    arabicName: 'الشيخ د. صلاح البدير',
    title: 'Senior Imam & Khatib of the Prophet’s Mosque & Judge',
    sanctuary: 'madinah',
    sanctuaryName: 'Masjid An-Nabawi, Madinah',
    sanctuaryArabic: 'المسجد النبوي الشريف بالمدينة المنورة',
    radioUrl: 'https://backup.qurango.net/radio/salah_albudair',
    reciterId: 'salah-al-budair',
    bio: 'Imam of the Prophet’s Mosque since 1999 and Judge of the High Court of Madinah. Celebrated for his distinct, resonant baritone, deliberate stops, and moving Taraweeh prayers.',
    yearsOfImamate: '1999 – Present',
    audioFeatures: ['24/7 Live Radio Feed', 'Taraweeh Madinah Archives', 'Complete 114 Surahs']
  },
  {
    id: 'thubaiti',
    name: 'Sheikh Dr. Abdulbari Al-Thubaiti',
    arabicName: 'الشيخ د. عبد الباري الثبيتي',
    title: 'Imam & Khatib of the Prophet’s Mosque in Madinah',
    sanctuary: 'madinah',
    sanctuaryName: 'Masjid An-Nabawi, Madinah',
    sanctuaryArabic: 'المسجد النبوي الشريف بالمدينة المنورة',
    radioUrl: 'https://backup.qurango.net/radio/abdelbari_altoubayti',
    bio: 'Former Imam of Masjid Al-Haram and prominent Imam of Masjid An-Nabawi since 1994. Known for his emotional, tear-filled Friday Khutbahs and calm Quranic recitations.',
    yearsOfImamate: '1994 – Present',
    audioFeatures: ['24/7 Live Radio Broadcast', 'Friday Khutbahs', 'Complete Quran']
  },
  {
    id: 'ayyub',
    name: 'Sheikh Dr. Mohammed Ayyub (Late)',
    arabicName: 'الشيخ د. محمد أيوب (رحمه الله)',
    title: 'Legendary Former Imam of the Prophet’s Mosque',
    sanctuary: 'madinah',
    sanctuaryName: 'Masjid An-Nabawi, Madinah',
    sanctuaryArabic: 'المسجد النبوي الشريف بالمدينة المنورة',
    radioUrl: 'https://backup.qurango.net/radio/mohammed_ayyub',
    bio: 'One of the most beloved voices in modern Islamic history. His historic Madinah Taraweeh recitations in the 1990s introduced the distinctive Hijazi Maqam to millions worldwide.',
    yearsOfImamate: '1990 – 1997, 2015 – 2016',
    audioFeatures: ['24/7 Hijazi Master Stream', 'Historic 1990s Taraweeh', 'Complete Murattal Album']
  }
];
