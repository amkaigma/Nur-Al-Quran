import { Reciter } from '../types/quran';

/**
 * Worldwide catalog of renowned Quran reciters, Sheikhs, and scholars.
 * Servers stream high quality audio from Surah 001 to 114.
 */
export const RECITERS: Reciter[] = [
  {
    id: 'mishary-alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    country: 'Kuwait',
    countryCode: 'KW',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server8.mp3quran.net/afs/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam of the Grand Mosque of Kuwait. Famous globally for exquisite vocal resonance, clarity of Makharij, and emotional depth in recitation.',
    featured: true
  },
  {
    id: 'abdul-basit-murattal',
    name: 'Abdul Basit Abdul Samad',
    arabicName: 'عبد الباسط عبد الصمد (مرتل)',
    country: 'Egypt',
    countryCode: 'EG',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server7.mp3quran.net/basit/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'One of the greatest Qaris in modern Islamic history. Known as the Golden Throat and Voice of Mecca for unmatched breath control.',
    featured: true
  },
  {
    id: 'abdul-basit-mujawwad',
    name: 'Abdul Basit Abdul Samad (Mujawwad)',
    arabicName: 'عبد الباسط عبد الصمد (مجود)',
    country: 'Egypt',
    countryCode: 'EG',
    riwayah: "Hafs 'an 'Asim",
    style: 'Mujawwad',
    serverUrl: 'https://server7.mp3quran.net/basit/Mujawwad/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Legendary Mujawwad melodic recitation featuring extended Madds, dramatic maqamat shifts, and masterful classical breath capacity.',
    featured: true
  },
  {
    id: 'mahmoud-khalil-al-husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري (المعلم)',
    country: 'Egypt',
    countryCode: 'EG',
    riwayah: "Hafs 'an 'Asim",
    style: "Mu'allim (Tajweed Study)",
    serverUrl: 'https://server13.mp3quran.net/husr/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'The undisputed gold standard for Tajweed pedagogy worldwide. Former President of the Egyptian League of Quran Reciters, revered for letter-perfect pronunciation.',
    featured: true
  },
  {
    id: 'al-husary-warsh',
    name: 'Mahmoud Khalil Al-Husary (Warsh)',
    arabicName: 'محمود خليل الحصري (ورش عن نافع)',
    country: 'Egypt',
    countryCode: 'EG',
    riwayah: "Warsh 'an Nafi'",
    style: 'Murattal',
    serverUrl: 'https://server13.mp3quran.net/husr/warsh/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Canonical reading of the Quran according to the Riwayah of Imam Warsh from Imam Nafi of Madinah, prominent in North and West Africa.',
    featured: false
  },
  {
    id: 'mohamed-siddiq-minshawi',
    name: 'Mohamed Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    country: 'Egypt',
    countryCode: 'EG',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server10.mp3quran.net/minsh/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Known as "The Weeping Voice" for his deeply moving, soulful cadence and impeccable adherence to classical Tajweed rulings.',
    featured: true
  },
  {
    id: 'minshawi-mujawwad',
    name: 'Mohamed Siddiq Al-Minshawi (Mujawwad)',
    arabicName: 'محمد صديق المنشاوي (مجود)',
    country: 'Egypt',
    countryCode: 'EG',
    riwayah: "Hafs 'an 'Asim",
    style: 'Mujawwad',
    serverUrl: 'https://server10.mp3quran.net/minsh/Mujawwad/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Renowned Mujawwad style with majestic vocal dynamics and emotional sincerity, cherished by Quran students across the globe.',
    featured: false
  },
  {
    id: 'maher-al-muaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server12.mp3quran.net/maher/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam and Khatib of the Grand Mosque (Masjid Al-Haram) in Makkah. Known for his crisp, comforting tone and steady pace.',
    featured: true
  },
  {
    id: 'abdul-rahman-al-sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server11.mp3quran.net/sds/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'General President for the Affairs of the Two Holy Mosques and legendary Chief Imam of the Grand Mosque in Makkah for decades.',
    featured: true
  },
  {
    id: 'saud-al-shuraim',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server7.mp3quran.net/shur/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Former longtime Imam and Khatib of the Grand Mosque in Makkah, renowned for his distinct rhythmic tempo and solemn Taraweeh recitations.',
    featured: false
  },
  {
    id: 'abu-bakr-al-shatri',
    name: 'Abu Bakr Al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server11.mp3quran.net/shatri/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Distinguished Saudi Sheikh known for calm, deliberate, meditative recitations that assist listeners in memorization and reflection.',
    featured: false
  },
  {
    id: 'saad-al-ghamdi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server7.mp3quran.net/s_gmd/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam and scholar from Dammam, Saudi Arabia. His recitations are beloved worldwide for their gentle melody and soothing resonance.',
    featured: true
  },
  {
    id: 'yasser-al-dosari',
    name: 'Yasser Al-Dosari',
    arabicName: 'ياسر الدوسري',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server11.mp3quran.net/yasser/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam of the Grand Mosque in Makkah and faculty member at King Saud University. Powerful voice that captivates millions in prayer.',
    featured: true
  },
  {
    id: 'nasser-al-qatami',
    name: 'Nasser Al-Qatami',
    arabicName: 'ناصر القطامي',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server6.mp3quran.net/qtm/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Prominent Imam of the Princess Latifa bint Sultan Mosque in Riyadh, celebrated for melodious cadence and emotive recitation.',
    featured: false
  },
  {
    id: 'ali-al-hudhaify',
    name: 'Ali Al-Hudhaify',
    arabicName: 'علي بن عبد الرحمن الحذيفي',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: "Mu'allim (Tajweed Study)",
    serverUrl: 'https://server9.mp3quran.net/hthfi/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Senior Imam and Khatib of the Prophet’s Mosque (Al-Masjid An-Nabawi) in Madinah. Renowned for strict adherence to Tajweed timing.',
    featured: false
  },
  {
    id: 'idris-abkar',
    name: 'Idris Abkar',
    arabicName: 'إدريس أبكر',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server6.mp3quran.net/abkr/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Celebrated Qari from Jeddah with a distinct, soulful tone and touching supplications that have resonated with youth worldwide.',
    featured: false
  },
  {
    id: 'hani-ar-rifai',
    name: 'Hani Ar-Rifai',
    arabicName: 'هاني الرفاعي',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server8.mp3quran.net/rifai/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam of the Anani Mosque in Jeddah, respected for his deeply contemplative, tearful recitations and heartfelt tone.',
    featured: false
  },
  {
    id: 'abdullah-basfar',
    name: 'Abdullah Basfar',
    arabicName: 'عبد الله بصفر',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: "Mu'allim (Tajweed Study)",
    serverUrl: 'https://server6.mp3quran.net/bsfr/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Secretary-General of the International Islamic Holy Quran Memorization Organization, highly regarded teacher of Qira’at.',
    featured: false
  },
  {
    id: 'salah-al-budair',
    name: 'Salah Al-Budair',
    arabicName: 'صلاح البدير',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server6.mp3quran.net/s_bud/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam of the Prophet’s Mosque in Madinah and Judge of the High Court of Madinah, known for his resonant baritone and clear stops.',
    featured: false
  },
  {
    id: 'bandar-baleela',
    name: 'Bandar Baleela',
    arabicName: 'بندر بليلة',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://cdn.mp3quran.net/audio/bandar-baleela/r1/',
    backupServerUrl: 'https://server6.mp3quran.net/balila/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam and Khatib of the Grand Mosque in Makkah, and member of the Council of Senior Scholars in Saudi Arabia.',
    featured: false
  },
  {
    id: 'noreen-siddiq',
    name: 'Noreen Muhammad Siddiq',
    arabicName: 'نورين محمد صديق',
    country: 'Sudan',
    countryCode: 'SD',
    riwayah: "Al-Duri 'an Abi 'Amr",
    style: 'Murattal',
    serverUrl: 'https://cdn.mp3quran.net/audio/noreen-siddiq/r1/',
    backupServerUrl: 'https://archive.org/download/islamicloud-quran-noreen-mohamed-siddiq/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Beloved Sudanese reciter known for the distinct pentatonic African Maqamat and the rare canonical Riwayah of Al-Duri.',
    featured: true
  },
  {
    id: 'yassin-al-jazaery',
    name: 'Yassin Al-Jazaery',
    arabicName: 'ياسين الجزائري',
    country: 'Algeria',
    countryCode: 'DZ',
    riwayah: "Warsh 'an Nafi'",
    style: 'Murattal',
    serverUrl: 'https://cdn.mp3quran.net/audio/yassen-jazairi/r1/',
    backupServerUrl: 'https://server11.mp3quran.net/jazaery/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Master of Warsh from Algeria, revered for traditional North African Quranic recitation with exceptional breath control.',
    featured: false
  },
  {
    id: 'wadee-al-yamani',
    name: 'Wadee Al-Yamani',
    arabicName: 'وديع اليمني',
    country: 'Yemen',
    countryCode: 'YE',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://cdn.mp3quran.net/audio/wadee-yamani/r1/',
    backupServerUrl: 'https://server6.mp3quran.net/wdee/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Imam from Yemen, recognized internationally for his crystalline high range, serene pacing, and peaceful delivery.',
    featured: false
  },
  {
    id: 'raad-al-kurdi',
    name: 'Raad Al-Kurdi',
    arabicName: 'رعد محمد الكردي',
    country: 'Iraq',
    countryCode: 'IQ',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://server6.mp3quran.net/kurdi/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Young master Qari from Kirkuk, Iraq, whose melodious and serene recitation style has gained acclaim across the Muslim world.',
    featured: false
  },
  // ==========================================
  // FAMOUS NIGERIAN SCHOLARS & QARIS
  // ==========================================
  {
    id: 'ahmad-sulaiman',
    name: 'Sheikh Ahmad Sulaiman (Kano)',
    arabicName: 'الشيخ أحمد سليمان الكنوي النيجيري',
    country: 'Nigeria',
    countryCode: 'NG',
    city: 'Kano',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://podcasts.qurancentral.com/ahmad-sulaiman/',
    backupServerUrl: 'https://archive.org/download/syaikh-ahmad-sulaiman/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'The undisputed premier Quran reciter of Nigeria. Based in Kano State, his deeply emotive, tear-evoking vocal cadence and classical West African rhythm are listened to by tens of millions across Nigeria and the global diaspora.',
    featured: true
  },
  {
    id: 'umar-idris',
    name: 'Qari Umar Idris (Sokoto)',
    arabicName: 'القارئ عمر بن إدريس السقطي',
    country: 'Nigeria',
    countryCode: 'NG',
    city: 'Sokoto',
    riwayah: "Hafs 'an 'Asim",
    style: 'Murattal',
    serverUrl: 'https://podcasts.qurancentral.com/umar-idris/',
    backupServerUrl: 'https://podcasts.qurancentral.com/ahmad-sulaiman/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Famous Nigerian reciter from the historic Caliphate city of Sokoto. Renowned for his soothing, crystalline vocal tone, gentle pacing, and exquisite articulation of Tajweed letters.',
    featured: true
  },
  {
    id: 'mukhtar-al-haaj',
    name: 'Sheikh Mukhtar Al-Haaj (Borno)',
    arabicName: 'الشيخ مختار الحاج النيجيري',
    country: 'Nigeria',
    countryCode: 'NG',
    city: 'Maiduguri, Borno',
    riwayah: "Hafs 'an 'Asim",
    style: 'Taraweeh / Live',
    serverUrl: 'https://archive.org/download/islamicloud-quran-mukhtar-al-haaj/mukhtar-al-haaj/',
    backupServerUrl: 'https://podcasts.qurancentral.com/ahmad-sulaiman/',
    availableSurahs: [1, 2, 7, 8, 12, 14, 16, 18, 23, 32, 35, 36, 39, 41, 42, 47, 55, 56, 59, 67, 68, 69],
    bio: 'Prominent Nigerian Qari originating from Borno State. Widely recognized in West Africa and the Gulf for his resonant, tearful Taraweeh prayers and soulful delivery.',
    featured: true
  },
  {
    id: 'okasha-kameny',
    name: 'Shaykh Okasha Kameny',
    arabicName: 'الشيخ عكاشة كميني',
    country: 'Nigeria & West Africa',
    countryCode: 'NG',
    city: 'West Africa',
    riwayah: "Al-Duri 'an Abi 'Amr",
    style: 'Murattal',
    serverUrl: 'https://archive.org/download/Okasha-Kameny/',
    backupServerUrl: 'https://podcasts.qurancentral.com/ahmad-sulaiman/',
    availableSurahs: [1, 2, 3, 4, 7, 9, 11, 17, 20, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
    bio: 'Beloved across Northern Nigeria and the Sahel for his soul-shaking recitations in the traditional African pentatonic Maqam and the Riwayah of Al-Duri.',
    featured: true
  },
  {
    id: 'alzain-ahmad',
    name: 'Alzain Mohammad Ahmad',
    arabicName: 'الزين محمد أحمد',
    country: 'Sudan & West Africa',
    countryCode: 'SD',
    riwayah: "Al-Duri 'an Abi 'Amr",
    style: 'Murattal',
    serverUrl: 'https://cdn.mp3quran.net/audio/zain-ahmad/r1/',
    backupServerUrl: 'https://podcasts.qurancentral.com/ahmad-sulaiman/',
    availableSurahs: Array.from({ length: 114 }, (_, i) => i + 1),
    bio: 'Celebrated African master Qari whose rhythmic, haunting Al-Duri recitation is broadcast daily across homes, radio stations, and markets in Northern Nigeria and West Africa.',
    featured: false
  }
];

/**
 * Returns full URL to the MP3 file of a Surah for a given Reciter
 */
export function getSurahAudioUrl(reciter: Reciter, surahId: number): string {
  const paddedId = surahId.toString().padStart(3, '0');
  
  // If the reciter does not have this specific surah, fallback cleanly to Sheikh Ahmad Sulaiman (Nigeria) or Alafasy
  if (reciter.availableSurahs && !reciter.availableSurahs.includes(surahId)) {
    return `https://podcasts.qurancentral.com/ahmad-sulaiman/${paddedId}.mp3`;
  }

  let base = reciter.serverUrl;
  if (!base.endsWith('/')) {
    base += '/';
  }
  return `${base}${paddedId}.mp3`;
}

/**
 * Returns a prioritized list of fallback audio URLs for failover protection
 */
export function getSurahAudioFallbacks(reciter: Reciter, surahId: number): string[] {
  const paddedId = surahId.toString().padStart(3, '0');
  const urls: string[] = [];

  // Primary server
  let primaryBase = reciter.serverUrl;
  if (!primaryBase.endsWith('/')) primaryBase += '/';
  urls.push(`${primaryBase}${paddedId}.mp3`);

  // Secondary / Backup server if specified
  if (reciter.backupServerUrl) {
    let backupBase = reciter.backupServerUrl;
    if (!backupBase.endsWith('/')) backupBase += '/';
    urls.push(`${backupBase}${paddedId}.mp3`);
  }

  // Reliable mirrors
  urls.push(`https://podcasts.qurancentral.com/ahmad-sulaiman/${paddedId}.mp3`);
  urls.push(`https://server8.mp3quran.net/afs/${paddedId}.mp3`);

  return Array.from(new Set(urls));
}

export function getReciterById(id: string): Reciter {
  const found = RECITERS.find(r => r.id === id);
  return found || RECITERS[0];
}
