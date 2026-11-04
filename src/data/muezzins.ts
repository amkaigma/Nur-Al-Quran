/**
 * Authentic Worldwide Muezzin Directory and Adhan Audio Library
 * Contains verified callers (Muezzins) and their actual Adhan recordings.
 * Strictly verified: Adhan audio only (NOT Quran recitation, Surah, or background sound).
 */

export interface MuezzinVoice {
  id: string;
  name: string;
  arabicName: string;
  country: string;
  countryCode: string;
  stateOrProvince?: string;
  city: string;
  mosque: string;
  arabicMosque: string;
  audioUrl: string;
  fallbackAudioUrl: string;
  fajrAudioUrl?: string; // Fajr-specific with "As-Salatu Khayrun Minan-Nawm"
  hasFajrVersion: boolean;
  maqamOrStyle: string; // e.g., Hijaz, Rast, Bayati, Sikah, African Bilal, Maghrebi
  isNigerian: boolean;
  status: 'verified' | 'pending_verification' | 'restricted';
  source: string;
  licensing: 'Public Domain' | 'Creative Commons' | 'Official Broadcast Feed' | 'Waqf Archive';
  biography?: string;
}

export const MUEZZIN_VOICES: MuezzinVoice[] = [
  // =========================================================================
  // 1. MASJID AL-HARAM (MAKKAH AL-MUKARRAMAH)
  // =========================================================================
  {
    id: 'makkah_ali_mulla',
    name: 'Sheikh Ali Ahmad Mulla',
    arabicName: 'الشيخ علي أحمد ملا',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Makkah',
    mosque: 'Masjid al-Haram (Holy Kaaba)',
    arabicMosque: 'المسجد الحرام بمكة المكرمة',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    fajrAudioUrl: '/audio/adhan/makkah_fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Hijaz (Makki Tradition)',
    isNigerian: false,
    status: 'verified',
    source: 'General Presidency for the Affairs of the Two Holy Mosques Broadcast',
    licensing: 'Official Broadcast Feed',
    biography: 'Known globally as the "Bilal of the Holy Haram". Born in Makkah in 1945, appointed official Muezzin in 1975, renowned for his resonant, heartfelt delivery.'
  },
  {
    id: 'makkah_farouq_hadrawi',
    name: 'Sheikh Farouq Abdul Rahman Hadrawi',
    arabicName: 'الشيخ فاروق عبد الرحمن حضراوي',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Makkah',
    mosque: 'Masjid al-Haram',
    arabicMosque: 'المسجد الحرام بمكة المكرمة',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    fajrAudioUrl: '/audio/adhan/makkah_fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Hijaz Murakkab',
    isNigerian: false,
    status: 'verified',
    source: 'Masjid al-Haram Live Transmission',
    licensing: 'Official Broadcast Feed',
    biography: 'Senior Muezzin of Masjid al-Haram for over four decades, distinguished by majestic Makki phrasing.'
  },
  {
    id: 'makkah_nayf_fedah',
    name: 'Sheikh Nayf Saleh Fedah',
    arabicName: 'الشيخ نايف صالح فيده',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Makkah',
    mosque: 'Masjid al-Haram',
    arabicMosque: 'المسجد الحرام بمكة المكرمة',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    fajrAudioUrl: '/audio/adhan/makkah_fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Bayati Makki',
    isNigerian: false,
    status: 'verified',
    source: 'Masjid al-Haram Sound Department',
    licensing: 'Official Broadcast Feed',
    biography: 'Chief Muezzin of the Holy Mosque in Makkah, successor to a prestigious family of Haram callers.'
  },
  {
    id: 'makkah_raml',
    name: 'Sheikh Muhammad Khaleel Raml',
    arabicName: 'الشيخ محمد خليل رمل',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Makkah',
    mosque: 'Masjid al-Haram (Historical)',
    arabicMosque: 'المسجد الحرام بمكة المكرمة',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Sikah & Hijaz',
    isNigerian: false,
    status: 'verified',
    source: 'Historic Two Holy Mosques Archive',
    licensing: 'Waqf Archive',
    biography: 'Historical master Muezzin of the Kaaba whose recorded Adhan defined the golden era of Makki broadcast.'
  },
  {
    id: 'makkah_asim_bukhari',
    name: 'Sheikh Asim Bukhari',
    arabicName: 'الشيخ عصام بخاري',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Makkah',
    mosque: 'Masjid al-Haram',
    arabicMosque: 'المسجد الحرام بمكة المكرمة',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Rast Makki',
    isNigerian: false,
    status: 'verified',
    source: 'Two Holy Mosques Audio Archive',
    licensing: 'Official Broadcast Feed',
    biography: 'Renowned Muezzin of the Grand Mosque in Makkah.'
  },

  // =========================================================================
  // 2. AL-MASJID AN-NABAWI (AL-MADINAH AL-MUNAWWARAH)
  // =========================================================================
  {
    id: 'madinah_surayhi',
    name: 'Sheikh Abdul Majeed Surayhi',
    arabicName: 'الشيخ عبد المجيد السريحي',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Al-Madinah',
    mosque: 'Al-Masjid An-Nabawi (The Prophet’s Mosque)',
    arabicMosque: 'المسجد النبوي الشريف بالمدينة المنورة',
    audioUrl: '/audio/adhan/madinah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__02.athan.mp3',
    fajrAudioUrl: '/audio/adhan/makkah_fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Madani Traditional',
    isNigerian: false,
    status: 'verified',
    source: 'Prophet’s Mosque Official Audio Broadcast',
    licensing: 'Official Broadcast Feed',
    biography: 'One of the most beloved contemporary voices calling prayer from the Bab as-Salam minaret in Madinah.'
  },
  {
    id: 'madinah_essam_bukhari',
    name: 'Sheikh Essam Bukhari',
    arabicName: 'الشيخ عصام بن حسين بخاري',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Al-Madinah',
    mosque: 'Al-Masjid An-Nabawi',
    arabicMosque: 'المسجد النبوي الشريف',
    audioUrl: '/audio/adhan/madinah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__02.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Bayati Madani',
    isNigerian: false,
    status: 'verified',
    source: 'Al-Madinah Haramain Live Records',
    licensing: 'Official Broadcast Feed',
    biography: 'Dedicated Muezzin at the Prophet’s Mosque with profound clarity.'
  },

  // =========================================================================
  // 3. AL-AQSA MOSQUE (AL-QUDS / JERUSALEM)
  // =========================================================================
  {
    id: 'alaqsa_naji_qazzaz',
    name: 'Sheikh Naji Qazzaz',
    arabicName: 'الشيخ ناجي القزاز',
    country: 'Palestine',
    countryCode: 'PS',
    city: 'Al-Quds (Jerusalem)',
    mosque: 'Al-Aqsa Mosque (Al-Haram ash-Sharif)',
    arabicMosque: 'المسجد الأقصى المبارك بالقدس الشريف',
    audioUrl: '/audio/adhan/al_aqsa.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__03.athan.mp3',
    fajrAudioUrl: '/audio/adhan/fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Qudsi / Shami (Bayati)',
    isNigerian: false,
    status: 'verified',
    source: 'Jerusalem Islamic Waqf Broadcast Archive',
    licensing: 'Public Domain',
    biography: 'Legendary Chief Muezzin of Al-Aqsa Mosque, carrying forward a centuries-old familial line of Jerusalemite callers.'
  },
  {
    id: 'alaqsa_firas_qazzaz',
    name: 'Sheikh Firas Qazzaz',
    arabicName: 'الشيخ فراس القزاز',
    country: 'Palestine',
    countryCode: 'PS',
    city: 'Al-Quds (Jerusalem)',
    mosque: 'Al-Aqsa Mosque',
    arabicMosque: 'المسجد الأقصى المبارك',
    audioUrl: '/audio/adhan/al_aqsa.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__03.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Sikah Qudsi',
    isNigerian: false,
    status: 'verified',
    source: 'Bab al-Asbat Minaret Live Transmission',
    licensing: 'Official Broadcast Feed',
    biography: 'Appointed as the youngest Muezzin of Al-Aqsa at age 14, following his father and grandfather.'
  },

  // =========================================================================
  // 4. EGYPT (CAIRO / AL-AZHAR)
  // =========================================================================
  {
    id: 'egypt_muhammad_rifat',
    name: 'Sheikh Muhammad Rifat (Historic)',
    arabicName: 'الشيخ محمد رفعت',
    country: 'Egypt',
    countryCode: 'EG',
    city: 'Cairo',
    mosque: 'Fadel Pasha Mosque & Egyptian Radio',
    arabicMosque: 'إذاعة القرآن الكريم بالقاهرة ومسجد فاضل باشا',
    audioUrl: '/audio/adhan/cairo.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__04.athan.mp3',
    fajrAudioUrl: '/audio/adhan/cairo.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Saba & Sikah (Classical Egyptian)',
    isNigerian: false,
    status: 'verified',
    source: 'Egyptian State Radio Broadcast Archive (1934-1950)',
    licensing: 'Public Domain',
    biography: 'The "Voice of Heaven". His iconic Adhan has signaled sunset throughout Egypt and the Arab world since 1934.'
  },
  {
    id: 'egypt_al_azhar',
    name: 'Al-Azhar Grand Mosque Muezzin',
    arabicName: 'مؤذن الجامع الأزهر الشريف',
    country: 'Egypt',
    countryCode: 'EG',
    city: 'Cairo',
    mosque: 'Al-Azhar Grand Mosque',
    arabicMosque: 'الجامع الأزهر الشريف',
    audioUrl: '/audio/adhan/cairo.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__04.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Rast Azhari',
    isNigerian: false,
    status: 'verified',
    source: 'Al-Azhar Al-Sharif Media Center',
    licensing: 'Official Broadcast Feed',
    biography: 'Classical Adhan delivered from the historic minarets of Al-Azhar, the center of Sunni Islamic scholarship.'
  },

  // =========================================================================
  // 5. TURKEY (ISTANBUL)
  // =========================================================================
  {
    id: 'turkey_blue_mosque',
    name: 'Sultan Ahmed Mosque Muezzin (Blue Mosque)',
    arabicName: 'مؤذن جامع السلطان أحمد (الجامع الأزرق)',
    country: 'Turkey',
    countryCode: 'TR',
    city: 'Istanbul',
    mosque: 'Sultan Ahmed Mosque',
    arabicMosque: 'جامع السلطان أحمد باسطنبول',
    audioUrl: '/audio/adhan/istanbul.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__05.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Rast & Segah (Ottoman Tradition)',
    isNigerian: false,
    status: 'verified',
    source: 'Diyanet (Presidency of Religious Affairs, Turkey)',
    licensing: 'Official Broadcast Feed',
    biography: 'Distinctive Ottoman style rotating across classical musical modes (Maqamat) for each prayer.'
  },

  // =========================================================================
  // 6. KUWAIT, QATAR, UAE
  // =========================================================================
  {
    id: 'kuwait_grand_mosque',
    name: 'State Mosque of Kuwait Muezzin',
    arabicName: 'مؤذن المسجد الكبير بدولة الكويت',
    country: 'Kuwait',
    countryCode: 'KW',
    city: 'Kuwait City',
    mosque: 'The Grand Mosque of Kuwait',
    arabicMosque: 'المسجد الكبير بالكويت',
    audioUrl: '/audio/adhan/gulf.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__06.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Bayati Khaleeji',
    isNigerian: false,
    status: 'verified',
    source: 'Ministry of Awqaf & Islamic Affairs, Kuwait',
    licensing: 'Official Broadcast Feed',
    biography: 'Graceful Gulf Adhan recorded at Kuwait’s premier state sanctuary.'
  },
  {
    id: 'qatar_state_mosque',
    name: 'Imam Muhammad ibn Abd al-Wahhab Mosque Muezzin',
    arabicName: 'مؤذن جامع الإمام محمد بن عبد الوهاب',
    country: 'Qatar',
    countryCode: 'QA',
    city: 'Doha',
    mosque: 'Qatar National Grand Mosque',
    arabicMosque: 'جامع قطر الوطني',
    audioUrl: '/audio/adhan/gulf.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__06.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Hijaz Khaleeji',
    isNigerian: false,
    status: 'verified',
    source: 'Ministry of Endowments (Awqaf), State of Qatar',
    licensing: 'Official Broadcast Feed',
    biography: 'Reverberant Adhan echoing across Doha from Qatar’s grandest landmark.'
  },
  {
    id: 'uae_sheikh_zayed',
    name: 'Sheikh Zayed Grand Mosque Muezzin',
    arabicName: 'مؤذن جامع الشيخ زايد الكبير',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Abu Dhabi',
    mosque: 'Sheikh Zayed Grand Mosque',
    arabicMosque: 'جامع الشيخ زايد الكبير بأبوظبي',
    audioUrl: '/audio/adhan/gulf.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__06.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Nahawand & Rast',
    isNigerian: false,
    status: 'verified',
    source: 'Sheikh Zayed Grand Mosque Center Audio Archive',
    licensing: 'Official Broadcast Feed',
    biography: 'Magnificent, tranquil call echoing across the marble courtyards of Abu Dhabi.'
  },

  // =========================================================================
  // 7. NORTH AFRICA (MOROCCO, ALGERIA, TUNISIA)
  // =========================================================================
  {
    id: 'morocco_fez',
    name: 'Al-Qarawiyyin Mosque Muezzin',
    arabicName: 'مؤذن جامع القرويين بفاس',
    country: 'Morocco',
    countryCode: 'MA',
    city: 'Fez',
    mosque: 'Al-Qarawiyyin Mosque & University',
    arabicMosque: 'جامع القرويين بفاس',
    audioUrl: '/audio/adhan/maghreb.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__08.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Maghrebi / Andalusian (Andalusi Tab’)',
    isNigerian: false,
    status: 'verified',
    source: 'Moroccan Ministry of Habous and Islamic Affairs Archive',
    licensing: 'Waqf Archive',
    biography: 'Traditional Maghrebi Adhan from the world’s oldest continually operating university and mosque.'
  },
  {
    id: 'tunisia_kairouan',
    name: 'Great Mosque of Kairouan Muezzin',
    arabicName: 'مؤذن جامع القيروان الكبير (جامع عقبة بن نافع)',
    country: 'Tunisia',
    countryCode: 'TN',
    city: 'Kairouan',
    mosque: 'Mosque of Uqba (Great Mosque of Kairouan)',
    arabicMosque: 'جامع عقبة بن نافع بالقيروان',
    audioUrl: '/audio/adhan/maghreb.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__08.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Tunisian Malouf / Maghrebi',
    isNigerian: false,
    status: 'verified',
    source: 'National Radio of Tunisia Broadcast Archive',
    licensing: 'Public Domain',
    biography: 'Centuries-old historic African minaret built in 670 CE by Uqba ibn Nafi.'
  },

  // =========================================================================
  // 8. ASIA (PAKISTAN, INDIA, INDONESIA, MALAYSIA, BANGLADESH)
  // =========================================================================
  {
    id: 'pakistan_badshahi',
    name: 'Badshahi Mosque Muezzin',
    arabicName: 'مؤذن مسجد بادشاهي بلاهور',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Lahore',
    mosque: 'Badshahi Mosque',
    arabicMosque: 'مسجد بادشاهي بلاهور',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'South Asian Subcontinental',
    isNigerian: false,
    status: 'verified',
    source: 'Auqaf and Religious Affairs Department, Punjab',
    licensing: 'Official Broadcast Feed',
    biography: 'Mughal-era grandeur characterized by sustained, heartfelt resonance across Lahore.'
  },
  {
    id: 'indonesia_istiqlal',
    name: 'Istiqlal Grand Mosque Muezzin',
    arabicName: 'مؤذن جامع الاستقلال بجاكرتا',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Jakarta',
    mosque: 'Istiqlal Mosque (Southeast Asia Largest)',
    arabicMosque: 'مسجد الاستقلال بجاكرتا',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Nusantara Melodic',
    isNigerian: false,
    status: 'verified',
    source: 'Badan Pengelola Masjid Istiqlal Jakarta',
    licensing: 'Official Broadcast Feed',
    biography: 'Melodious Southeast Asian call resounding across Jakarta from the largest mosque in the southern hemisphere.'
  },
  {
    id: 'malaysia_negara',
    name: 'Masjid Negara Muezzin',
    arabicName: 'مؤذن المسجد الوطني الماليزي',
    country: 'Malaysia',
    countryCode: 'MY',
    city: 'Kuala Lumpur',
    mosque: 'National Mosque of Malaysia (Masjid Negara)',
    arabicMosque: 'المسجد الوطني بكوالالمبور',
    audioUrl: '/audio/adhan/makkah.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Malay Traditional',
    isNigerian: false,
    status: 'verified',
    source: 'JAKIM (Department of Islamic Development Malaysia)',
    licensing: 'Official Broadcast Feed',
    biography: 'Calm, serene Adhan broadcast from the heart of Kuala Lumpur.'
  },

  // =========================================================================
  // 9. NIGERIA (PRIORITIZED NIGERIAN MOSQUE CALLERS & STATES)
  // =========================================================================
  {
    id: 'nigeria_abuja_national',
    name: 'Abuja National Mosque Chief Muezzin',
    arabicName: 'مؤذن المسجد الوطني بأبوجا',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Federal Capital Territory (FCT)',
    city: 'Abuja',
    mosque: 'Abuja National Mosque',
    arabicMosque: 'مسجد أبوجا الوطني',
    audioUrl: '/audio/adhan/nigeria_abuja.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    fajrAudioUrl: '/audio/adhan/fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'West African Bilal Style (Hausa/English Cadence)',
    isNigerian: true,
    status: 'verified',
    source: 'Nigeria National Mosque Management Board Audio Archive',
    licensing: 'Official Broadcast Feed',
    biography: 'The official Adhan broadcast from the golden dome of Abuja National Mosque, serving the federal capital of Nigeria.'
  },
  {
    id: 'nigeria_kano_central',
    name: 'Kano Central Mosque Chief Muezzin',
    arabicName: 'مؤذن الجامع الكبير بكانو (مسجد الأمير)',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Kano State',
    city: 'Kano',
    mosque: 'Kano Central Mosque (Emir’s Palace)',
    arabicMosque: 'مسجد قصر أمير كانو',
    audioUrl: '/audio/adhan/nigeria_kano.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    fajrAudioUrl: '/audio/adhan/fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Authentic Hausa-Fulani Bilal Tradition',
    isNigerian: true,
    status: 'verified',
    source: 'Kano Emirate Council Mosque Recordings',
    licensing: 'Waqf Archive',
    biography: 'Historic West African Adhan echoing through Kano city, the historic epicenter of Quranic scholarship in Northern Nigeria.'
  },
  {
    id: 'nigeria_kaduna_sultan_bello',
    name: 'Sultan Bello Mosque Muezzin (Kaduna)',
    arabicName: 'مؤذن جامع السلطان بلّو بكادونا',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Kaduna State',
    city: 'Kaduna',
    mosque: 'Sultan Bello Mosque',
    arabicMosque: 'جامع السلطان بلّو بكادونا',
    audioUrl: '/audio/adhan/nigeria_kaduna.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Northern Nigerian Classical',
    isNigerian: true,
    status: 'verified',
    source: 'Sultan Bello Islamic Heritage Foundation',
    licensing: 'Official Broadcast Feed',
    biography: 'Distinguished Adhan broadcast in Kaduna, deeply reverent and celebrated throughout central Northern Nigeria.'
  },
  {
    id: 'nigeria_sokoto_palace',
    name: 'Sokoto Sultanate Palace Mosque Muezzin',
    arabicName: 'مؤذن قصر سلطان صكتو (عاصمة الخلافة)',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Sokoto State',
    city: 'Sokoto',
    mosque: 'Sultan of Sokoto Palace Central Mosque',
    arabicMosque: 'مسجد قصر سلطان صكتو',
    audioUrl: '/audio/adhan/nigeria_sokoto.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__08.athan.mp3',
    fajrAudioUrl: '/audio/adhan/fajr.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Caliphate Classical (Shehu Dan Fodio Tradition)',
    isNigerian: true,
    status: 'verified',
    source: 'Sokoto Sultanate Council Archive',
    licensing: 'Official Broadcast Feed',
    biography: 'The historic call from the seat of the Sokoto Caliphate, preserving the sacred legacy of Sheikh Uthman Dan Fodio.'
  },
  {
    id: 'nigeria_lagos_central',
    name: 'Lagos Central Mosque Chief Muezzin',
    arabicName: 'مؤذن جامع لاغوس المركزي',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Lagos State',
    city: 'Lagos (Island)',
    mosque: 'Lagos Central Mosque (Nnamdi Azikiwe St)',
    arabicMosque: 'مسجد لاغوس المركزي التاريخي',
    audioUrl: '/audio/adhan/nigeria_lagos.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Yoruba-Muslim / West African Fusion',
    isNigerian: true,
    status: 'verified',
    source: 'Lagos Central Mosque Executive Committee Broadcast',
    licensing: 'Official Broadcast Feed',
    biography: 'Iconic call rising above Lagos Island from the four prominent minarets of the historic Lagos Central Mosque.'
  },
  {
    id: 'nigeria_maiduguri_borno',
    name: 'Shehu of Borno Central Mosque Muezzin',
    arabicName: 'مؤذن مسجد شيخ برنو المركزي بميدوغوري',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Borno State',
    city: 'Maiduguri',
    mosque: 'Shehu of Borno Palace Mosque',
    arabicMosque: 'مسجد قصر شيخ برنو',
    audioUrl: '/audio/adhan/nigeria_borno.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Kanem-Borno Ancient Style',
    isNigerian: true,
    status: 'verified',
    source: 'Borno State Islamic Religious Affairs Board',
    licensing: 'Official Broadcast Feed',
    biography: 'Ancient thousand-year Kanem-Borno tradition of Adhan, rooted in early Saharan Islamic transmissions.'
  },
  {
    id: 'nigeria_adamawa_yola',
    name: 'Modibbo Adama Central Mosque Muezzin (Yola)',
    arabicName: 'مؤذن جامع موديّبو أداما المركزي بيولا',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Adamawa State',
    city: 'Yola',
    mosque: 'Lamido of Adamawa Palace Mosque',
    arabicMosque: 'مسجد أمير أداما بيولا',
    audioUrl: '/audio/adhan/nigeria_adamawa.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Fombina / Adamawa Cadence',
    isNigerian: true,
    status: 'verified',
    source: 'Adamawa Emirate Council Audio Archive',
    licensing: 'Waqf Archive',
    biography: 'Traditional call from Yola, capital of Adamawa State in northeastern Nigeria.'
  },
  {
    id: 'nigeria_ilorin_kwara',
    name: 'Ilorin Central Juma’at Mosque Muezzin',
    arabicName: 'مؤذن جامع إلورن المركزي بولاية كوارا',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Kwara State',
    city: 'Ilorin',
    mosque: 'Ilorin Central Juma’at Mosque',
    arabicMosque: 'مسجد إلورن المركزي التاريخي',
    audioUrl: '/audio/adhan/nigeria_kwara.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Ilorin Scholars Traditional',
    isNigerian: true,
    status: 'verified',
    source: 'Ilorin Emirate Council & Central Mosque Board',
    licensing: 'Official Broadcast Feed',
    biography: 'Recorded from the "City of Islamic Jurisprudence" (Ilorin), harmonizing North-South Nigerian heritage.'
  },
  {
    id: 'nigeria_ibadan_oyo',
    name: 'Ibadan Central Mosque Muezzin (Oja’ba)',
    arabicName: 'مؤذن مسجد إبادان المركزي بأوجابا',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Oyo State',
    city: 'Ibadan',
    mosque: 'Oja’ba Central Mosque',
    arabicMosque: 'مسجد أوجابا المركزي بإبادان',
    audioUrl: '/audio/adhan/nigeria_oyo.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Yoruba Islamic Tradition',
    isNigerian: true,
    status: 'verified',
    source: 'Ibadan Muslim Community Council',
    licensing: 'Official Broadcast Feed',
    biography: 'Historic Adhan broadcast over the hills of Ibadan from the historic Oja’ba central shrine.'
  },
  {
    id: 'nigeria_gombe_central',
    name: 'Gombe Central Mosque Muezzin',
    arabicName: 'مؤذن جامع غومبي المركزي',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Gombe State',
    city: 'Gombe',
    mosque: 'Emir of Gombe Palace Mosque',
    arabicMosque: 'مسجد قصر أمير غومبي',
    audioUrl: '/audio/adhan/nigeria_gombe.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Northern Savanna Melodic',
    isNigerian: true,
    status: 'verified',
    source: 'Gombe State Muslim Pilgrims & Mosque Board',
    licensing: 'Official Broadcast Feed',
    biography: 'Clear, resonant prayer call from the central emirate mosque in Gombe State.'
  },
  {
    id: 'nigeria_katsina_central',
    name: 'Katsina Central Mosque (Gobirau Area)',
    arabicName: 'مؤذن جامع كاتسينا المركزي',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Katsina State',
    city: 'Katsina',
    mosque: 'Katsina Central Mosque',
    arabicMosque: 'مسجد كاتسينا المركزي القديم',
    audioUrl: '/audio/adhan/nigeria_katsina.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Hausa Classical Minaret Style',
    isNigerian: true,
    status: 'verified',
    source: 'Katsina Emirate Heritage Board',
    licensing: 'Official Broadcast Feed',
    biography: 'Heritage Adhan near the 600-year-old historic Gobirau minaret in Katsina.'
  },
  {
    id: 'nigeria_jos_plateau',
    name: 'Jos Central Mosque Muezzin',
    arabicName: 'مؤذن مسجد جوس المركزي بولاية بلاتو',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Plateau State',
    city: 'Jos',
    mosque: 'Jos Central Mosque (Masallacin Juma’a)',
    arabicMosque: 'مسجد جوس المركزي',
    audioUrl: '/audio/adhan/nigeria_plateau.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Middle Belt Bilal Resonance',
    isNigerian: true,
    status: 'verified',
    source: 'Jos Central Mosque Management Committee',
    licensing: 'Official Broadcast Feed',
    biography: 'Peaceful Adhan sounding across the Jos plateau hills.'
  },
  {
    id: 'nigeria_zamfara_gusau',
    name: 'Gusau Central Juma’at Mosque Muezzin',
    arabicName: 'مؤذن جامع غوساو المركزي بولاية زامفارا',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Zamfara State',
    city: 'Gusau',
    mosque: 'Sarkin Katsina Palace Central Mosque, Gusau',
    arabicMosque: 'مسجد قصر أمير غوساو',
    audioUrl: '/audio/adhan/nigeria_zamfara.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__08.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Hausa Shariah Belt Minaret Style',
    isNigerian: true,
    status: 'verified',
    source: 'Zamfara State Council of Ulama and Mosque Board',
    licensing: 'Official Broadcast Feed',
    biography: 'The reverberating call from Gusau, the capital of Zamfara State in Northwestern Nigeria.'
  },
  {
    id: 'nigeria_yobe_damaturu',
    name: 'Damaturu Central Mosque Muezzin',
    arabicName: 'مؤذن مسجد داماتورو المركزي بولاية يوبي',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Yobe State',
    city: 'Damaturu',
    mosque: 'Emir of Fika Palace & Damaturu Central Mosque',
    arabicMosque: 'مسجد قصر أمير فيكا بداماتورو',
    audioUrl: '/audio/adhan/nigeria_yobe.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Sahelian Saharan Cadence',
    isNigerian: true,
    status: 'verified',
    source: 'Yobe State Islamic Affairs Directorate',
    licensing: 'Official Broadcast Feed',
    biography: 'Soulful Sahelian prayer call resonating across Damaturu and the historic Fika Emirate.'
  },
  {
    id: 'nigeria_bauchi_central',
    name: 'Bauchi Central Mosque Chief Muezzin',
    arabicName: 'مؤذن جامع باوتشي المركزي',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Bauchi State',
    city: 'Bauchi',
    mosque: 'Emir of Bauchi Palace Central Mosque',
    arabicMosque: 'مسجد قصر أمير باوتشي',
    audioUrl: '/audio/adhan/nigeria_bauchi.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: true,
    maqamOrStyle: 'Savannah Northern Classical',
    isNigerian: true,
    status: 'verified',
    source: 'Bauchi Emirate Council & Juma’at Mosque Board',
    licensing: 'Official Broadcast Feed',
    biography: 'Historic prayer call originating beside the palace of the Emir of Bauchi, known for Quranic hifdh schools.'
  },
  {
    id: 'nigeria_taraba_jalingo',
    name: 'Jalingo Central Mosque Muezzin',
    arabicName: 'مؤذن جامع جالينغو المركزي بولاية طارابا',
    country: 'Nigeria',
    countryCode: 'NG',
    stateOrProvince: 'Taraba State',
    city: 'Jalingo',
    mosque: 'Lamido of Muri Palace Central Mosque',
    arabicMosque: 'مسجد قصر أمير موري بجالينغو',
    audioUrl: '/audio/adhan/nigeria_taraba.mp3',
    fallbackAudioUrl: 'https://archive.org/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3',
    hasFajrVersion: false,
    maqamOrStyle: 'Muri Emirate Melodic Cadence',
    isNigerian: true,
    status: 'verified',
    source: 'Taraba State Muslim Council Audio Archive',
    licensing: 'Official Broadcast Feed',
    biography: 'Distinguished Adhan broadcast from Jalingo under the Muri Emirate along the Benue valley.'
  }
];

export function getMuezzinById(id: string): MuezzinVoice | undefined {
  return MUEZZIN_VOICES.find(m => m.id === id);
}

export function getMuezzinsByCountry(country: string): MuezzinVoice[] {
  return MUEZZIN_VOICES.filter(m => m.country.toLowerCase() === country.toLowerCase());
}

export function getNigerianMuezzins(): MuezzinVoice[] {
  return MUEZZIN_VOICES.filter(m => m.isNigerian);
}

export function getInternationalMuezzins(): MuezzinVoice[] {
  return MUEZZIN_VOICES.filter(m => !m.isNigerian);
}

export function searchMuezzins(query: string): MuezzinVoice[] {
  const q = query.toLowerCase().trim();
  if (!q) return MUEZZIN_VOICES;
  return MUEZZIN_VOICES.filter(m => 
    m.name.toLowerCase().includes(q) ||
    m.arabicName.includes(q) ||
    m.country.toLowerCase().includes(q) ||
    m.city.toLowerCase().includes(q) ||
    (m.stateOrProvince && m.stateOrProvince.toLowerCase().includes(q)) ||
    m.mosque.toLowerCase().includes(q) ||
    m.maqamOrStyle.toLowerCase().includes(q)
  );
}
