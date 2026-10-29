export interface AudioTranslation {
  id: string;
  language: string;
  nativeName: string;
  flag: string;
  translator: string;
  reciterVoice: string;
  radioUrl: string;
  description: string;
  popularRegions: string[];
}

export const AUDIO_TRANSLATIONS: AudioTranslation[] = [
  {
    id: 'english_walk',
    language: 'English',
    nativeName: 'English (Saheeh International)',
    flag: '🇬🇧',
    translator: 'Saheeh International',
    reciterVoice: 'Ibrahim Walk & Sheikh Abdul Basit',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_english_walk_basit',
    description: 'Clear, modern English translation recited by Ibrahim Walk paired verse-by-verse with classical Arabic recitation.',
    popularRegions: ['United Kingdom', 'United States', 'Nigeria', 'Canada', 'Australia']
  },
  {
    id: 'hausa',
    language: 'Hausa',
    nativeName: 'Harshen Hausa',
    flag: '🇳🇬',
    translator: 'Sheikh Abubakar Mahmoud Gumi & Scholars',
    reciterVoice: 'Hausa Islamic Audio Archive',
    radioUrl: 'https://backup.qurango.net/radio/Translation_Quran_Hausa',
    description: 'Complete translation of the meanings of the Holy Qur\'an into Hausa, listened to by tens of millions across Nigeria, Niger, Ghana, and the West African Sahel.',
    popularRegions: ['Nigeria', 'Niger', 'Ghana', 'Cameroon', 'Chad', 'Sudan']
  },
  {
    id: 'french',
    language: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    translator: 'Muhammad Hamidullah',
    reciterVoice: 'Studio Voix Française & Al-Minshawi',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_french',
    description: 'High-fidelity French spoken translation of the Qur\'an following the renowned translation of Dr. Muhammad Hamidullah.',
    popularRegions: ['France', 'Senegal', 'Mali', 'Côte d’Ivoire', 'Belgium', 'Canada (Quebec)']
  },
  {
    id: 'urdu',
    language: 'Urdu',
    nativeName: 'اردو ترجمہ',
    flag: '🇵🇰',
    translator: 'Fateh Muhammad Jalandhari',
    reciterVoice: 'Qari Muhammad Siddiq Al-Minshawi & Shamshad Ali Khan',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_urdu_sds_shur',
    description: 'Classical Urdu translation of the Holy Qur\'an with revered cadence and poetic reverence.',
    popularRegions: ['Pakistan', 'India', 'Bangladesh', 'United Kingdom', 'Gulf States']
  },
  {
    id: 'spanish',
    language: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    translator: 'Julio Cortes & Raúl González Bórnez',
    reciterVoice: 'Mishary Alafasy & Voz en Español',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_spanish_afs',
    description: 'Authentic Spanish audio translation paired with Mishary Rashid Alafasy\'s Murattal recitation.',
    popularRegions: ['Spain', 'Mexico', 'Colombia', 'Argentina', 'Latin America']
  },
  {
    id: 'german',
    language: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    translator: 'Frank Bubenheim & Nadeem Elyas',
    reciterVoice: 'Deutsche Koranrezitation',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_german',
    description: 'Comprehensive, scholarly German spoken translation of the meanings of the Quran.',
    popularRegions: ['Germany', 'Austria', 'Switzerland']
  },
  {
    id: 'turkish',
    language: 'Turkish',
    nativeName: 'Türkçe Meal',
    flag: '🇹🇷',
    translator: 'Diyanet İşleri Başkanlığı',
    reciterVoice: 'Türkçe Kur’an Meali',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_turkish',
    description: 'Accurate, inspiring Turkish spoken translation and commentary broadcast worldwide.',
    popularRegions: ['Turkey', 'Azerbaijan', 'Germany', 'Balkans']
  },
  {
    id: 'bosnian',
    language: 'Bosnian',
    nativeName: 'Bosanski Prijevod',
    flag: '🇧🇦',
    translator: 'Besim Korkut',
    reciterVoice: 'Bosanski Glas',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_bosnia',
    description: 'The standard and cherished Bosnian translation of Besim Korkut, rendered into clear spoken audio.',
    popularRegions: ['Bosnia and Herzegovina', 'Balkans', 'European Diaspora']
  },
  {
    id: 'persian',
    language: 'Persian',
    nativeName: 'ترجمه فارسی',
    flag: '🇮🇷',
    translator: 'Makarem Shirazi & Foladvand',
    reciterVoice: 'صدای گوینده فارسی',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_farsi',
    description: 'Eloquent Persian audio translation accompanied by beautiful Quranic recitation.',
    popularRegions: ['Iran', 'Afghanistan', 'Tajikistan']
  },
  {
    id: 'albanian',
    language: 'Albanian',
    nativeName: 'Shqip',
    flag: '🇦🇱',
    translator: 'H. Sherif Ahmeti',
    reciterVoice: 'Zëri Shqiptar',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_albanian',
    description: 'Continuous Albanian audio translation of the Holy Quran for the Balkans and diaspora.',
    popularRegions: ['Albania', 'Kosovo', 'North Macedonia']
  },
  {
    id: 'kurdish',
    language: 'Kurdish',
    nativeName: 'کوردی',
    flag: '☀️',
    translator: 'Burhan Muhammad Amin',
    reciterVoice: 'Dengê Kurdî',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_kurdish',
    description: 'Soulful Kurdish audio translation of the Holy Qur\'an in the Sorani dialect.',
    popularRegions: ['Kurdistan', 'Iraq', 'Turkey', 'Iran']
  },
  {
    id: 'tamazight',
    language: 'Tamazight',
    nativeName: 'Tamaziɣt (Amazigh)',
    flag: 'ⵣ',
    translator: 'Si Hadj Mohand Tayeb',
    reciterVoice: 'Tamazight Audio Master',
    radioUrl: 'https://backup.qurango.net/radio/translation_quran_tamazight',
    description: 'Rare and treasured audio translation of the Quran into the Berber/Amazigh language of North Africa.',
    popularRegions: ['Algeria', 'Morocco', 'Tunisia', 'Libya']
  }
];
