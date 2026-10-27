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
    serverUrl: 'https://server6.mp3quran.net/balila/',
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
    serverUrl: 'https://server10.mp3quran.net/nourin/',
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
    serverUrl: 'https://server11.mp3quran.net/jazaery/',
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
    serverUrl: 'https://server6.mp3quran.net/wdee/',
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
  }
];

/**
 * Returns full URL to the MP3 file of a Surah for a given Reciter
 */
export function getSurahAudioUrl(reciter: Reciter, surahId: number): string {
  const paddedId = surahId.toString().padStart(3, '0');
  let base = reciter.serverUrl;
  if (!base.endsWith('/')) {
    base += '/';
  }
  return `${base}${paddedId}.mp3`;
}

export function getReciterById(id: string): Reciter {
  const found = RECITERS.find(r => r.id === id);
  return found || RECITERS[0];
}
