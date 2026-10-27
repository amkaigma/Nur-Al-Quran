export interface TajweedRuleDetail {
  id: string;
  name: string;
  arabicName: string;
  category: 'Noon & Meem' | 'Madd (Elongation)' | 'Echo (Qalqalah)' | 'Makharij (Articulation)' | 'Waqf (Stops)';
  definition: string;
  timingRule: string;
  letters: string[];
  examples: {
    verse: string;
    word: string;
    explanation: string;
  }[];
  colorBadge: string;
}

export const TAJWEED_RULES: TajweedRuleDetail[] = [
  {
    id: 'ghunnah',
    name: 'Ghunnah (Nasalization)',
    arabicName: 'الغُنَّة',
    category: 'Noon & Meem',
    definition: 'A melodic sound resonating through the nasal passage (Khayshoom), required whenever Noon or Meem carries a Shaddah (نّ or مّ).',
    timingRule: 'Strictly held for 2 harakat (equal to roughly 1 to 1.5 seconds in Murattal).',
    letters: ['نّ', 'مّ'],
    examples: [
      { verse: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', word: 'النَّاسِ', explanation: 'Noon Mushaddadah held with nasal resonance for 2 counts.' },
      { verse: 'عَمَّ يَتَسَاءَلُونَ', word: 'عَمَّ', explanation: 'Meem Mushaddadah held with resonant Ghunnah for 2 counts.' }
    ],
    colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (Echo / Bouncing letters)',
    arabicName: 'القَلْقَلَة',
    category: 'Echo (Qalqalah)',
    definition: 'An echo-like bounce or vibrant disturbance produced when pronouncing one of the five Qalqalah letters when they carry a Sukoon or when stopping upon them.',
    timingRule: 'Instantaneous crisp release without altering the inherent vowel.',
    letters: ['ق', 'ط', 'ب', 'ج', 'د'],
    examples: [
      { verse: 'قُلْ هُوَ اللَّهُ أَحَدٌ', word: 'أَحَدْ', explanation: 'Dal at the end of the verse stopped with clear Qalqalah Kubra (major echo).' },
      { verse: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ', word: 'حَبْلٌ', explanation: 'Baa in the middle of a word with sukoon: Qalqalah Sughra (minor echo).' }
    ],
    colorBadge: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'madd-wajib',
    name: "Madd Muttasil (Connected Obligatory Prolongation)",
    arabicName: 'المَدّ المُتَّصِل',
    category: 'Madd (Elongation)',
    definition: 'Occurs when a Madd letter (Alif, Waw, Yaa) is immediately followed by a Hamzah inside the very SAME word.',
    timingRule: 'Prolonged for 4 to 5 counts (harakat).',
    letters: ['آء', 'وْء', 'يْء'],
    examples: [
      { verse: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', word: 'جَاءَ', explanation: 'Madd letter Alif followed by Hamzah inside "Jaa-a", elongated 4 to 5 counts.' },
      { verse: 'وَالسَّمَاءِ وَالطَّارِقِ', word: 'السَّمَاءِ', explanation: 'Madd letter Alif followed by Hamzah inside "As-Samaa-i".' }
    ],
    colorBadge: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'madd-jaiz',
    name: "Madd Munfasil (Separated Permissible Prolongation)",
    arabicName: 'المَدّ المُنْفَصِل',
    category: 'Madd (Elongation)',
    definition: 'Occurs when a Madd letter ends a word, and the very next word begins with a Hamzah.',
    timingRule: 'Can be read with 2, 4, or 5 counts depending on the reader’s Tareeq in Hafs.',
    letters: ['ـا # أَ', 'ـو # إِ', 'ـي # أُ'],
    examples: [
      { verse: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', word: 'إِنَّا أَعْطَيْنَاكَ', explanation: 'Alif at end of Inna, Hamzah at start of A`taynaak.' }
    ],
    colorBadge: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'madd-arid',
    name: "Madd 'Arid li-s-Sukoon (Temporary Stop Prolongation)",
    arabicName: 'المَدّ العَارِض لِلسُّكُون',
    category: 'Madd (Elongation)',
    definition: 'Occurs at the end of verses or stop points where a Madd letter precedes the final letter that becomes sakin due to stopping (Waqf). This is what creates the famous musical Quranic rhyme!',
    timingRule: 'Flexible choice of 2, 4, or 6 counts. Must remain consistent throughout the recitation.',
    letters: ['ـينْ', 'ـونْ', 'ـالْ'],
    examples: [
      { verse: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', word: 'الْعَالَمِينَ', explanation: 'Stopping at al-`Alameen creates Madd Arid. Matching the Sheikh’s 4 or 6 count creates the harmonious rhyme.' },
      { verse: 'الرَّحْمَنِ الرَّحِيمِ', word: 'الرَّحِيمِ', explanation: 'Stopping at ar-Raheem prolongs the Ya before Meem.' }
    ],
    colorBadge: 'bg-sky-100 text-sky-800 border-sky-300'
  },
  {
    id: 'ikhfa',
    name: 'Ikhfa Haqiqi (Concealment with Nasalization)',
    arabicName: 'الإِخْفَاء الحَقِيقِي',
    category: 'Noon & Meem',
    definition: 'Pronouncing Noon Sakinah or Tanween in an intermediate state between clear articulation (Izhar) and merging (Idgham), accompanied by nasal Ghunnah before 15 specific letters.',
    timingRule: 'Held for 2 counts while positioning tongue near the articulation point of the subsequent letter.',
    letters: ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'],
    examples: [
      { verse: 'مِن قَبْلِكَ', word: 'مِن قَبْلِكَ', explanation: 'Noon concealed before Qaf with heavy (mufakhkham) nasalization.' },
      { verse: 'كُنتُمْ خَيْرَ أُمَّةٍ', word: 'كُنتُمْ', explanation: 'Noon concealed before Ta with light (muraqqaq) nasalization.' }
    ],
    colorBadge: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  {
    id: 'idgham',
    name: 'Idgham (Merging of Letters)',
    arabicName: 'الإِدْغَام',
    category: 'Noon & Meem',
    definition: 'Merging Noon Sakinah or Tanween into one of the six letters of (يرملون). With Ghunnah in (ينمو) or without Ghunnah in (ل، ر).',
    timingRule: 'With Ghunnah: held 2 counts. Without Ghunnah: rapid transition into the Lam or Raa.',
    letters: ['ي', 'ر', 'م', 'ل', 'و', 'ن'],
    examples: [
      { verse: 'مَن يَقُولُ', word: 'مَن يَقُولُ', explanation: 'Noon merged into Ya with 2-count nasal ghunnah: "May-yaqool".' },
      { verse: 'مِّن رَّبِّهِمْ', word: 'مِّن رَّبِّهِمْ', explanation: 'Complete merger without Ghunnah into Raa: "Mir-rabbihim".' }
    ],
    colorBadge: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    id: 'iqlab',
    name: 'Iqlab (Conversion to Meem)',
    arabicName: 'الإِقْلَاب',
    category: 'Noon & Meem',
    definition: 'Turning Noon Sakinah or Tanween into a concealed Meem (م) with Ghunnah when followed by the letter Baa (ب).',
    timingRule: 'Held for 2 counts with slight gentle touching of lips without excessive clamping.',
    letters: ['ب'],
    examples: [
      { verse: 'مِن بَعْدِ', word: 'مِن بَعْدِ', explanation: 'Pronounced as "Mim-ba`d" with gentle nasalization.' }
    ],
    colorBadge: 'bg-orange-100 text-orange-800 border-orange-300'
  }
];

export interface TajweedPracticeTarget {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  transliteration: string;
  sheikhBenchmarkAudioSnippet?: string; // audio start/end or surah
  primaryRules: string[];
  rhymeEnding: string;
  tips: string;
  recommendedSheikhs: string[];
}

export const TAJWEED_PRACTICE_TARGETS: TajweedPracticeTarget[] = [
  {
    surahId: 1,
    surahName: 'Al-Fatihah',
    ayahNumber: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    transliteration: 'Bismillaahir-Rahmaanir-Raheem',
    primaryRules: ['Tarqeeq on Lam of Allah', 'Madd Arid li-s-Sukoon on "Raheem"', 'Tafkheem on letter Raa'],
    rhymeEnding: '-eem (Madd 2, 4, or 6 harakat)',
    tips: 'Ensure the "B" in Bismi is light. Thin the Lam in Allah because of the Kasrah on the Meem before it. At the end of "ar-Raheem", extend the prolongation smoothly to match the Sheikh’s breath.',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'mishary-alafasy', 'abdul-basit-murattal']
  },
  {
    surahId: 1,
    surahName: 'Al-Fatihah',
    ayahNumber: 2,
    arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: '[All] praise is [due] to Allah, Lord of the worlds -',
    transliteration: 'Alhamdu lillaahi Rabbil-`aalameen',
    primaryRules: ['Clear Izhar of Lam in Al-Hamdu', 'Haa from middle of throat', 'Madd Arid li-s-Sukoon on "al-`aalameen"'],
    rhymeEnding: '-een (Madd 2, 4, or 6 harakat)',
    tips: 'Pronounce the letter Haa (ح) from the center of the throat with soft breath. Open the Ayn (ع) clearly without choking. Match the ending rhyme length precisely with Ayah 1.',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'mohamed-siddiq-minshawi', 'maher-al-muaiqly']
  },
  {
    surahId: 1,
    surahName: 'Al-Fatihah',
    ayahNumber: 7,
    arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    transliteration: "Siraatal-ladheena an'amta 'alayhim ghayril-maghdoobi 'alayhim wa lad-daaaalleen",
    primaryRules: ['Tafkheem on Saad and Taa', 'Heavy letter Dhad (ض)', 'Madd Lazim Kalimi Muthaqqal (6 mandatory counts on Daalleen)'],
    rhymeEnding: '-een (Must hold 6 full counts before final Lam Shaddah)',
    tips: 'The culmination of Al-Fatiha! "Wala-Dhaaaalleen" contains Madd Lazim: you MUST hold the elongation for 6 full rhythmic beats, followed by a Nabrah (vocal pressure) on the Lam Mushaddadah.',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'abdul-basit-mujawwad', 'mishary-alafasy']
  },
  {
    surahId: 112,
    surahName: 'Al-Ikhlas',
    ayahNumber: 1,
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    translation: 'Say, "He is Allah, [who is] One,',
    transliteration: 'Qul Huwal-Laahu Ahad',
    primaryRules: ['Tafkheem on Qaf', 'Tafkheem on Lam of Allah', 'Qalqalah Kubra on Daal when stopping'],
    rhymeEnding: '-ad (Strong Qalqalah bounce)',
    tips: 'Articulate Qaf from the deepest part of the tongue against the soft palate. When stopping on "Ahad", release the tongue tip from the teeth ridge with a resonant, crisp echo (Qalqalah).',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'saad-al-ghamdi', 'yasser-al-dosari']
  },
  {
    surahId: 112,
    surahName: 'Al-Ikhlas',
    ayahNumber: 2,
    arabicText: 'اللَّهُ الصَّمَدُ',
    translation: 'Allah, the Eternal Refuge.',
    transliteration: 'Allaahus-Samad',
    primaryRules: ['Saad with whistling (Safeer) and elevation (Isti`la)', 'Qalqalah Kubra on Daal'],
    rhymeEnding: '-ad (Harmonious rhyme with Ayah 1)',
    tips: 'The letter Saad must be pronounced with fullness (thick) while avoiding rounding the lips into an English "o" sound. Maintain the identical Qalqalah cadence as Ayah 1.',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'mishary-alafasy']
  },
  {
    surahId: 113,
    surahName: 'Al-Falaq',
    ayahNumber: 1,
    arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    translation: 'Say, "I seek refuge in the Lord of daybreak',
    transliteration: "Qul a'oodhu bi-Rabbil-falaq",
    primaryRules: ['Makhraj of Dhal (ذ) between teeth', 'Qalqalah Kubra on Qaf'],
    rhymeEnding: '-aq (Deep throat resonant Qalqalah bounce)',
    tips: 'Stick the tip of the tongue gently between the front teeth for Dhal. The final Qaf bounce must be deep and crisp.',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'mohamed-siddiq-minshawi']
  },
  {
    surahId: 114,
    surahName: 'An-Nas',
    ayahNumber: 1,
    arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    translation: 'Say, "I seek refuge in the Lord of mankind,',
    transliteration: "Qul a'oodhu bi-Rabbin-naas",
    primaryRules: ['Noon Mushaddadah Ghunnah (2 counts)', 'Madd Arid li-s-Sukoon', 'Safeer (hissing) on Seen'],
    rhymeEnding: '-aas (Extended 2, 4, or 6 counts ending with soft Seen breath)',
    tips: 'Hold the nasal hum (Ghunnah) on "An-Naas" for 2 full beats before transitioning into the Alif elongation. End with clear, soft hissing on the Seen.',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'mishary-alafasy', 'abdul-rahman-al-sudais']
  },
  {
    surahId: 67,
    surahName: 'Al-Mulk',
    ayahNumber: 1,
    arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation: 'Blessed is He in whose hand is dominion, and He is over all things competent -',
    transliteration: "Tabaarakal-ladhee biyadihil-mulku wa huwa 'alaa kulli shay-in Qadeer",
    primaryRules: ['Tafkheem on Raa of Tabaaraka', 'Ikhfa on Tanween of Shay-in before Qaf', 'Tarqeeq on Raa when stopping on Qadeer'],
    rhymeEnding: '-eer (Thin, silky Raa Murakh-khafa with Madd Arid)',
    tips: 'Notice the contrast: the Raa in "Tabaaraka" is thick and heavy, while the Raa in "Qadeer" is thin (Muraqqaq) because it follows a Sakin Ya! Hear how Sheikh Al-Husary and Sheikh Mishary pronounce this subtle distinction.',
    recommendedSheikhs: ['mahmoud-khalil-al-husary', 'mishary-alafasy', 'yasser-al-dosari']
  }
];
