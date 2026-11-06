export interface TajweedRuleDetail {
  id: string;
  name: string;
  arabicName: string;
  category: 'Noon & Meem' | 'Madd (Elongation)' | 'Echo (Qalqalah)' | 'Makharij (Articulation)' | 'Waqf (Stops)' | 'Heavy & Light';
  definition: string;
  whenItHappens: string;
  timingRule: string;
  letters: string[];
  examples: {
    verse: string;
    word: string;
    explanation: string;
    surahNumber?: number;
    ayahNumber?: number;
    wordIndex?: number;
  }[];
  audioDemoUrl?: string;
  practiceExercise: string;
  glossaryTip: string;
  colorBadge: string;
}

export const TAJWEED_RULES: TajweedRuleDetail[] = [
  {
    id: 'izhar-halqi',
    name: 'Izhar Halqi (Clear Throat Pronunciation)',
    arabicName: 'الإظهار الحَلْقِي',
    category: 'Noon & Meem',
    definition: 'Pronouncing the letter Noon Sakinah (نْ) or Tanween (ً ٍ ٌ) completely clearly and distinctly without extra nasal hum (Ghunnah), merging, or pausing.',
    whenItHappens: 'When a Noon Sakinah or Tanween is followed by any of the 6 throat letters (حروف الحلق): ء هـ ع ح غ خ.',
    timingRule: 'Natural single count without holding or stretching.',
    letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
    examples: [
      { 
        verse: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', 
        word: 'أَنْعَمْتَ', 
        explanation: 'The Noon Sakin is followed by the throat letter Ayn (ع). Pronounce the Noon crisply without holding.',
        surahNumber: 1,
        ayahNumber: 7,
        wordIndex: 3
      },
      { 
        verse: 'مِنْ خَوْفٍ', 
        word: 'مِنْ خَوْفٍ', 
        explanation: 'Noon Sakin followed by the throat letter Khaa (خ). Articulate clearly from the throat.',
        surahNumber: 106,
        ayahNumber: 4,
        wordIndex: 4
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/001_007_003.mp3',
    practiceExercise: 'Recite "An`amta" (Surah Al-Fatihah: 7). Ensure your tongue tip touches behind your front upper teeth for Noon, then transitions cleanly into Ayn without pausing or humming.',
    glossaryTip: 'Izhar means "to make clear". Halqi means "from the throat". You pronounce the N sound cleanly because the next letter comes from deep or middle throat.',
    colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
  },
  {
    id: 'idgham-bi-ghunnah',
    name: 'Idgham bi Ghunnah (Merging with Nasalization)',
    arabicName: 'الإدغام بغُنَّة',
    category: 'Noon & Meem',
    definition: 'Merging Noon Sakinah or Tanween into the following letter while producing a melodic, resonant nasal hum (Ghunnah) from the nose.',
    whenItHappens: 'When Noon Sakinah or Tanween is followed by one of the 4 letters of (ينمو): Yaa (ي), Noon (ن), Meem (م), or Waw (و).',
    timingRule: 'Held steadily for 2 harakat (approx. 1 to 1.5 seconds) through the nasal cavity.',
    letters: ['ي', 'ن', 'م', 'و'],
    examples: [
      { 
        verse: 'وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ', 
        word: 'مَن يَعْمَلْ', 
        explanation: 'The Noon blends smoothly into Yaa, sounding like "May-ya`mal" with a continuous 2-beat nasal resonance.',
        surahNumber: 99,
        ayahNumber: 7,
        wordIndex: 2
      },
      { 
        verse: 'مِّن وَالٍ', 
        word: 'مِّن وَالٍ', 
        explanation: 'The Noon blends into Waw: "Miw-waal" with 2 counts of nasal resonance.',
        surahNumber: 13,
        ayahNumber: 11,
        wordIndex: 12
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/099_007_002.mp3',
    practiceExercise: 'Practice saying "May-ya`mal" without fully releasing the tongue tip, directing half the air through the nose for 2 full beats.',
    glossaryTip: 'Idgham means "to merge" or "insert one thing into another". Bi Ghunnah means "with a nasal buzz".',
    colorBadge: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
  },
  {
    id: 'idgham-bila-ghunnah',
    name: 'Idgham bila Ghunnah (Merging without Nasalization)',
    arabicName: 'الإدغام بغير غُنَّة',
    category: 'Noon & Meem',
    definition: 'Completely absorbing Noon Sakinah or Tanween into the next letter so that no trace of the Noon sound or nasal hum remains.',
    whenItHappens: 'When Noon Sakinah or Tanween is followed by Lam (ل) or Raa (ر).',
    timingRule: 'Immediate, complete merger into the doubled (Mushaddad) letter without extra holding.',
    letters: ['ل', 'ر'],
    examples: [
      { 
        verse: 'مِّن رَّبِّهِمْ', 
        word: 'مِّن رَّبِّهِمْ', 
        explanation: 'The Noon completely vanishes into the Raa, pronounced as "Mir-rabbihim" with a firm doubled Raa.',
        surahNumber: 2,
        ayahNumber: 5,
        wordIndex: 3
      },
      { 
        verse: 'هُدًى لِّلْمُتَّقِينَ', 
        word: 'هُدًى لِّلْمُتَّقِينَ', 
        explanation: 'Tanween blends completely into Lam: "Hudal-lil-muttaqeen".',
        surahNumber: 2,
        ayahNumber: 2,
        wordIndex: 5
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/002_005_003.mp3',
    practiceExercise: 'Pronounce "Mir-Rabbihim" without any "n" sound escaping through your nose. The transition from Meem to Raa should be instantaneous.',
    glossaryTip: 'Bila Ghunnah means "without nasal hum". The N simply disappears into the following L or R.',
    colorBadge: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
  },
  {
    id: 'iqlab',
    name: 'Iqlab (Conversion of Noon to Meem)',
    arabicName: 'الإِقْلَاب',
    category: 'Noon & Meem',
    definition: 'Transforming Noon Sakinah or Tanween into a concealed letter Meem (م) with nasal Ghunnah before the letter Baa.',
    whenItHappens: 'Whenever Noon Sakinah or Tanween is immediately followed by the letter Baa (ب). Look for the small Meem symbol (ۘ or ۢ) in the Mushaf text.',
    timingRule: 'Held for 2 counts with soft lip contact (no hard clamping).',
    letters: ['ب'],
    examples: [
      { 
        verse: 'مِن بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَاتُ', 
        word: 'مِن بَعْدِ', 
        explanation: 'The Noon transforms into a soft Meem: "Mim-ba`di" with 2 counts of nasal Ghunnah.',
        surahNumber: 2,
        ayahNumber: 213,
        wordIndex: 19
      },
      { 
        verse: 'عَلِيمٌ بِذَاتِ الصُّدُورِ', 
        word: 'عَلِيمٌ بِذَاتِ', 
        explanation: 'The Tanween turns into Meem before Baa: "`Aleemum-bi-dhaati".',
        surahNumber: 3,
        ayahNumber: 119,
        wordIndex: 14
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/002_213_019.mp3',
    practiceExercise: 'Practice saying "Mim-ba`di" by lightly bringing your lips together without pressing them tightly. Let the nasal sound vibrate for 2 beats.',
    glossaryTip: 'Iqlab means "to turn over or convert". It is easier for the human vocal tract to convert N into M before the lip-sound B.',
    colorBadge: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
  },
  {
    id: 'ikhfa-haqiqi',
    name: 'Ikhfa Haqiqi (Concealment with Nasalization)',
    arabicName: 'الإِخْفَاء الحَقِيقِي',
    category: 'Noon & Meem',
    definition: 'Concealing the Noon Sakinah or Tanween by positioning the mouth near the exit point of the next letter while directing sound through the nose.',
    whenItHappens: 'When Noon Sakinah or Tanween is followed by any of the 15 Ikhfa letters: ص، ذ، ث، ك، ج، ش، ق، س، د، ط، ز، ف، ت، ض، ظ.',
    timingRule: 'Held for 2 counts. If followed by a heavy letter (ص ض ط ظ ق), the Ghunnah is thick (Tafkhim); if light, the Ghunnah is thin (Tarqiq).',
    letters: ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'],
    examples: [
      { 
        verse: 'مِن قَبْلِكَ', 
        word: 'مِن قَبْلِكَ', 
        explanation: 'Heavy Ikhfa before Qaf. Prepare your tongue at the back palate with deep nasal Ghunnah for 2 counts.',
        surahNumber: 2,
        ayahNumber: 4,
        wordIndex: 4
      },
      { 
        verse: 'كُنتُمْ خَيْرَ أُمَّةٍ', 
        word: 'كُنتُمْ', 
        explanation: 'Light Ikhfa before Taa. Tongue rests near upper teeth without touching while nasal sound flows.',
        surahNumber: 3,
        ayahNumber: 110,
        wordIndex: 1
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/002_004_004.mp3',
    practiceExercise: 'Notice how "Min Qablik" sounds thicker than "Kuntum". Keep the tongue hovering just before the letter without making full contact.',
    glossaryTip: 'Ikhfa means "to hide". You hide the N sound halfway between clear pronunciation and complete merging.',
    colorBadge: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
  },
  {
    id: 'ikhfa-shafawi',
    name: 'Ikhfa Shafawi (Concealment of Meem Sakinah)',
    arabicName: 'الإِخْفَاء الشَّفَوِي',
    category: 'Noon & Meem',
    definition: 'Concealing the letter Meem Sakinah (مْ) with nasal Ghunnah when followed by the letter Baa.',
    whenItHappens: 'Whenever a Meem Sakinah is followed immediately by the letter Baa (ب).',
    timingRule: 'Held for 2 counts with soft lip contact.',
    letters: ['ب'],
    examples: [
      { 
        verse: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', 
        word: 'تَرْمِيهِم بِحِجَارَةٍ', 
        explanation: 'Meem Sakin on "Tarmeehim" followed by Baa in "Bihijaarah". Soft lip touch with 2-count Ghunnah.',
        surahNumber: 105,
        ayahNumber: 4,
        wordIndex: 1
      },
      { 
        verse: 'وَمَا هُم بِمُؤْمِنِينَ', 
        word: 'هُم بِمُؤْمِنِينَ', 
        explanation: 'Meem Sakin before Baa: "Hum-bi-mu\'mineen" held for 2 counts.',
        surahNumber: 2,
        ayahNumber: 8,
        wordIndex: 4
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/105_004_001.mp3',
    practiceExercise: 'In Surah Al-Fil: "Tarmeehim bihijaarah", do not press the lips together hard. Let the Meem buzz softly for 2 counts before releasing into the Baa.',
    glossaryTip: 'Shafawi means "from the lips". Both M and B are lip letters, so the Meem is concealed smoothly on the lips.',
    colorBadge: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800'
  },
  {
    id: 'idgham-shafawi',
    name: 'Idgham Shafawi / Idgham Mithlayn (Meem into Meem)',
    arabicName: 'الإدغام الشَّفَوِي / إدغام مثلين صغير',
    category: 'Noon & Meem',
    definition: 'Merging a Meem Sakinah (مْ) completely into a second vowelled Meem (مَ مِ مُ), creating a single doubled Meem with full Ghunnah.',
    whenItHappens: 'Whenever Meem Sakinah is followed by another Meem.',
    timingRule: 'Held for 2 full counts with complete lip closure and nasal resonance.',
    letters: ['م'],
    examples: [
      { 
        verse: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ', 
        word: 'أَطْعَمَهُم مِّن', 
        explanation: 'Meem Sakin merges into the next Meem: "At`amahum-min" with resonant 2-beat hum.',
        surahNumber: 106,
        ayahNumber: 4,
        wordIndex: 2
      },
      { 
        verse: 'فِي قُلُوبِهِم مَّرَضٌ', 
        word: 'قُلُوبِهِم مَّرَضٌ', 
        explanation: 'Meem merges into Meem: "Quloobihim-maradun".',
        surahNumber: 2,
        ayahNumber: 10,
        wordIndex: 2
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/106_004_002.mp3',
    practiceExercise: 'Say "At`amahum-min" in Surah Quraysh. Hold both lips closed while the sound resonates through the nose for 2 counts.',
    glossaryTip: 'Mithlayn means "identical twins". When two identical letters meet (first quiet, second vowelled), they merge effortlessly.',
    colorBadge: 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800'
  },
  {
    id: 'izhar-shafawi',
    name: 'Izhar Shafawi (Clear Meem Sakinah)',
    arabicName: 'الإظهار الشَّفَوِي',
    category: 'Noon & Meem',
    definition: 'Pronouncing Meem Sakinah (مْ) clearly and crisply from the lips without extra prolongation or nasal hum.',
    whenItHappens: 'When Meem Sakinah is followed by any of the 26 Arabic letters EXCEPT Baa (ب) and Meem (م). Take extra care before Waw (و) and Faa (ف) so the Meem does not accidentally disappear.',
    timingRule: '1 natural beat with immediate release.',
    letters: ['All 26 letters except ب and م'],
    examples: [
      { 
        verse: 'أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ', 
        word: 'عَلَيْهِمْ غَيْرِ', 
        explanation: 'Meem Sakin followed by Ghayn. Close lips crisply and release into Ghayn without extra buzzing.',
        surahNumber: 1,
        ayahNumber: 7,
        wordIndex: 4
      },
      { 
        verse: 'هُمْ فِيهَا خَالِدُونَ', 
        word: 'هُمْ فِيهَا', 
        explanation: 'Meem Sakin followed by Faa. Articulate the Meem firmly so it does not blend into the Faa.',
        surahNumber: 2,
        ayahNumber: 25,
        wordIndex: 12
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/001_007_004.mp3',
    practiceExercise: 'In Al-Fatihah Ayah 7: recite "`Alayhim ghayril" with a clean, snap-like lip closure on Meem, then open directly into Ghayn.',
    glossaryTip: 'Izhar Shafawi keeps the Meem distinct and clear. The lips close and open crisply without dragging.',
    colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
  },
  {
    id: 'madd-tabeee',
    name: "Madd Tabee'i (Natural 2-Count Elongation)",
    arabicName: 'المَدّ الطَّبِيعِي / الأصلي',
    category: 'Madd (Elongation)',
    definition: 'The foundational elongation of the Arabic vowel letters (Alif preceded by Fathah, Waw preceded by Dammah, Yaa preceded by Kasrah) when not followed by Hamzah or Sukoon.',
    whenItHappens: 'Whenever a Madd letter is present without any following Hamzah or Sukoon to trigger longer elongation.',
    timingRule: 'Exactly 2 harakat (equal to folding or unfolding one finger at a normal pace, ~1 second). Neither shortened to 1 beat nor dragged to 3.',
    letters: ['ـَا', 'ـُو', 'ـِي'],
    examples: [
      { 
        verse: 'قَالَ يَا مُوسَىٰ', 
        word: 'قَالَ', 
        explanation: 'Alif after Qaf gives exactly 2 rhythmic counts: "Qaa-la".',
        surahNumber: 20,
        ayahNumber: 17,
        wordIndex: 1
      },
      { 
        verse: 'نُوحِيهَا إِلَيْكَ', 
        word: 'نُوحِيهَا', 
        explanation: 'Contains all three natural Madd letters in one word: Noo (Waw), hee (Yaa), haa (Alif) - each 2 counts.',
        surahNumber: 11,
        ayahNumber: 49,
        wordIndex: 2
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/020_017_001.mp3',
    practiceExercise: 'Recite "Qoola" and "Qeela". Avoid clipping them too short like English short vowels, and avoid stretching them past 2 counts.',
    glossaryTip: 'Tabee`i means "natural". A native Arabic speaker naturally prolongs these vowels for 2 beats without extra effort.',
    colorBadge: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800'
  },
  {
    id: 'madd-muttasil',
    name: 'Madd Muttasil (Connected Obligatory Elongation)',
    arabicName: 'المَدّ المُتَّصِل',
    category: 'Madd (Elongation)',
    definition: 'Occurs when a Madd letter and a Hamzah (ء) appear together inside the very SAME single Arabic word.',
    whenItHappens: 'Look for the wavy Madd sign (~) over the letter followed immediately by Hamzah in the same word (e.g., جَآءَ, السَّمَآء).',
    timingRule: 'Mandatory 4 or 5 harakat in Hafs recitation (approx. 2 to 2.5 seconds).',
    letters: ['آء', 'وْء', 'يْء'],
    examples: [
      { 
        verse: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', 
        word: 'جَاءَ', 
        explanation: 'Madd letter Alif and Hamzah are inside "Jaa\'a". Must be held for 4 to 5 counts.',
        surahNumber: 110,
        ayahNumber: 1,
        wordIndex: 2
      },
      { 
        verse: 'وَالسَّمَاءِ وَالطَّارِقِ', 
        word: 'وَالسَّمَاءِ', 
        explanation: 'Alif followed by Hamzah in "As-Samaaa\'i". Elongate smoothly for 4 to 5 beats.',
        surahNumber: 86,
        ayahNumber: 1,
        wordIndex: 1
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/110_001_002.mp3',
    practiceExercise: 'In Surah An-Nasr: hold "Jaaa-\'a" for 4 to 5 steady beats, then deliver the crisp Hamzah sound at the end.',
    glossaryTip: 'Muttasil means "connected". The vowel and the Hamzah are connected in the exact same word, making elongation obligatory.',
    colorBadge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
  },
  {
    id: 'madd-munfasil',
    name: 'Madd Munfasil (Separated Permissible Elongation)',
    arabicName: 'المَدّ المُنْفَصِل',
    category: 'Madd (Elongation)',
    definition: 'Occurs when a Madd letter is at the end of one word, and the very next word begins with a Hamzah (ء).',
    whenItHappens: 'Two separate words meet: Word 1 ends with Alif/Waw/Yaa, Word 2 begins with Hamzah (e.g., إِنَّآ أَعْطَيْنَاكَ, يَا أَيُّهَا).',
    timingRule: 'Permissible 4 or 5 counts in standard Shatibiyyah Tareeq (or 2 counts in Tayyibah shortcut).',
    letters: ['ـا # أَ', 'ـو # إِ', 'ـي # أُ'],
    examples: [
      { 
        verse: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', 
        word: 'إِنَّا أَعْطَيْنَاكَ', 
        explanation: 'The Alif at the end of "Innaa" meets the Hamzah of "A`taynaak". Prolong for 4 to 5 counts.',
        surahNumber: 108,
        ayahNumber: 1,
        wordIndex: 1
      },
      { 
        verse: 'يَا أَيُّهَا الَّذِينَ آمَنُوا', 
        word: 'يَا أَيُّهَا', 
        explanation: '"Yaa" calling particle meets "Ayyuha". Prolong for 4 to 5 counts.',
        surahNumber: 2,
        ayahNumber: 153,
        wordIndex: 1
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/108_001_001.mp3',
    practiceExercise: 'In Surah Al-Kawthar: stretch "Innaaaa" for 4 full beats before starting "A`taynaak al-Kawthar". Keep your breath steady.',
    glossaryTip: 'Munfasil means "separated". The vowel and Hamzah belong to two separate words.',
    colorBadge: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
  },
  {
    id: 'madd-lazim',
    name: 'Madd Lazim (Compulsory 6-Count Elongation)',
    arabicName: 'المَدّ اللَّازِم',
    category: 'Madd (Elongation)',
    definition: 'The longest and most powerful elongation in the Quran. Occurs when a Madd letter is followed by a permanent original Sukoon or Shaddah (doubled letter).',
    whenItHappens: 'Found in words like الضَّآلِّينَ and in Quranic opening letters (Huruf Muqatta`ah) like الم, يس, ق.',
    timingRule: 'Strictly compulsory 6 full harakat (approx. 3 seconds) across ALL Riwayat without exception.',
    letters: ['ـآلّـ', 'الم', 'كهيعص', 'حم'],
    examples: [
      { 
        verse: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', 
        word: 'الضَّالِّينَ', 
        explanation: 'The Alif is followed by Lam with Shaddah. You MUST hold the elongation for 6 full beats before pressing into the Lam (Nabrah).',
        surahNumber: 1,
        ayahNumber: 7,
        wordIndex: 8
      },
      { 
        verse: 'الْحَاقَّةُ', 
        word: 'الْحَاقَّةُ', 
        explanation: 'Madd Lazim Kalimi Muthaqqal: hold the Alif for 6 full beats before the doubled Qaf.',
        surahNumber: 69,
        ayahNumber: 1,
        wordIndex: 1
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/001_007_008.mp3',
    practiceExercise: 'Recite "Wala-Dhaaaaaalleen" in Al-Fatihah. Count slowly 1, 2, 3, 4, 5, 6 on your fingers while maintaining full vocal resonance, then lock onto the Lam.',
    glossaryTip: 'Lazim means "compulsory / mandatory". Every Quranic recitation tradition agrees on this 6-count elongation.',
    colorBadge: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
  },
  {
    id: 'madd-arid',
    name: "Madd 'Arid li-s-Sukun (Temporary Stop Elongation)",
    arabicName: 'المَدّ العَارِض لِلسُّكُون',
    category: 'Madd (Elongation)',
    definition: 'Occurs at the end of verses or pauses where a Madd letter precedes the final letter that becomes sakin due to stopping (Waqf).',
    whenItHappens: 'Whenever you stop on a word whose second-to-last letter is a Madd letter (e.g., الرَّحِيمْ, العَالَمِينْ, نَسْتَعِينْ). This creates the harmonious Quranic cadence.',
    timingRule: 'Flexible choice of 2, 4, or 6 harakat. Whichever length you choose, you must keep it consistent throughout your recitation.',
    letters: ['ـينْ', 'ـونْ', 'ـالْ', 'ـيمْ'],
    examples: [
      { 
        verse: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 
        word: 'الْعَالَمِينَ', 
        explanation: 'Stopping on "al-`Alameen" turns the final Noon into sakin. Hold the Yaa for 2, 4, or 6 counts.',
        surahNumber: 1,
        ayahNumber: 2,
        wordIndex: 4
      },
      { 
        verse: 'الرَّحْمَٰنِ الرَّحِيمِ', 
        word: 'الرَّحِيمِ', 
        explanation: 'Stopping on "ar-Raheem" turns Meem sakin. Match the exact duration chosen in Ayah 2.',
        surahNumber: 1,
        ayahNumber: 3,
        wordIndex: 2
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/001_002_004.mp3',
    practiceExercise: 'Recite the first 4 Ayat of Al-Fatihah, stopping at the end of each with exactly 4 counts on the final vowel. Feel the consistent, melodic rhyme.',
    glossaryTip: 'Arid means "temporary or incidental". The pause created a temporary Sukoon, allowing you to extend the vowel musically.',
    colorBadge: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (Echo / Vibrant Bouncing Letters)',
    arabicName: 'القَلْقَلَة',
    category: 'Echo (Qalqalah)',
    definition: 'A crisp, vibrant bounce or echo produced when pronouncing one of the five Qalqalah letters when they carry a Sukoon or when stopping on them.',
    whenItHappens: 'Whenever one of the letters of (قُطْبُ جَدٍّ) — Qaf (ق), Taa (ط), Baa (ب), Jeem (ج), Daal (د) — is sakin or stopped upon.',
    timingRule: 'Instantaneous crisp release without adding a vowel (Fathah, Kasrah, or Dammah).',
    letters: ['ق', 'ط', 'ب', 'ج', 'د'],
    examples: [
      { 
        verse: 'قُلْ هُوَ اللَّهُ أَحَدٌ', 
        word: 'أَحَدٌ', 
        explanation: 'Stopping on "Ahad" makes the Daal sakin: strong bounce (Qalqalah Kubra) without sounding like "Ahada".',
        surahNumber: 112,
        ayahNumber: 1,
        wordIndex: 4
      },
      { 
        verse: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ', 
        word: 'حَبْلٌ', 
        explanation: 'Baa in the middle of a word carrying Sukoon: quick minor bounce (Qalqalah Sughra).',
        surahNumber: 111,
        ayahNumber: 5,
        wordIndex: 3
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/112_001_004.mp3',
    practiceExercise: 'In Surah Al-Ikhlas: recite "Ahad", "As-Samad", "Yalid", "Yoolad", "Ahad". Release the tongue tip crisply on each ending Daal for a sharp, echoing finish.',
    glossaryTip: 'Qalqalah literally means "shaking or agitation". Because these 5 letters block the sound and air completely, they need an energetic release to be heard clearly.',
    colorBadge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
  },
  {
    id: 'ghunnah-mushaddadah',
    name: 'Ghunnah Mushaddadah (Nasalization on Noon & Meem with Shaddah)',
    arabicName: 'الغُنَّة المُشَدَّدَة',
    category: 'Noon & Meem',
    definition: 'A melodic, ringing nasal resonance produced in the nasal cavity whenever Noon or Meem carries a Shaddah (نّ or مّ).',
    whenItHappens: 'Any time you encounter a Noon with Shaddah (نّ) or a Meem with Shaddah (مّ) in any word.',
    timingRule: 'Strictly held for 2 full counts (1 to 1.5 seconds) with sweet, steady resonance.',
    letters: ['نّ', 'مّ'],
    examples: [
      { 
        verse: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', 
        word: 'النَّاسِ', 
        explanation: 'Noon with Shaddah in "An-Naas": hold the nasal hum for 2 counts before the Alif.',
        surahNumber: 114,
        ayahNumber: 1,
        wordIndex: 4
      },
      { 
        verse: 'عَمَّ يَتَسَاءَلُونَ', 
        word: 'عَمَّ', 
        explanation: 'Meem with Shaddah in "`Amma": hold lips closed with resonant nasal buzz for 2 full beats.',
        surahNumber: 78,
        ayahNumber: 1,
        wordIndex: 1
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/114_001_004.mp3',
    practiceExercise: 'Recite Surah An-Nas: "An-Naas", "Malikin-Naas", "Ilaahin-Naas". Give each Noon Mushaddadah a full 2-beat hum before completing the word.',
    glossaryTip: 'Ghunnah is the unique musical trademark of Quran recitation. It comes entirely from the nasal cavity (Khayshoom).',
    colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
  },
  {
    id: 'tafkhim-tarqiq',
    name: 'Tafkhim & Tarqiq (Heavy and Light Letters)',
    arabicName: 'التَّفْخِيم والتَّرْقِيق',
    category: 'Heavy & Light',
    definition: 'Tafkhim makes the letter sound full, heavy, and thick by raising the back of the tongue. Tarqiq keeps the sound light, flat, and thin with a gentle smile posture.',
    whenItHappens: '7 letters are ALWAYS heavy (خُصَّ ضَغْطٍ قِظْ: Khaa, Saad, Dhad, Ghayn, Taa, Qaf, Zhaa). The Lam in "Allah" is heavy after Fathah/Dammah, but light after Kasrah. The letter Raa is heavy with Fathah/Dammah, and light with Kasrah.',
    timingRule: 'Vocal quality distinction maintained throughout the duration of the letter.',
    letters: ['خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ', 'ل (لفظ الجلالة)', 'ر'],
    examples: [
      { 
        verse: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 
        word: 'اللَّهِ', 
        explanation: 'The Lam of Allah is light (Muraqqaq) here because it is preceded by Kasrah on "Bismi": "Bismillaahi" (thin, not "Bismol-lah").',
        surahNumber: 1,
        ayahNumber: 1,
        wordIndex: 2
      },
      { 
        verse: 'قُلْ هُوَ اللَّهُ أَحَدٌ', 
        word: 'اللَّهُ', 
        explanation: 'The Lam of Allah is heavy (Mufakhkham) here because it is preceded by Dammah on "Huwa": "Huwal-Laahu".',
        surahNumber: 112,
        ayahNumber: 1,
        wordIndex: 3
      }
    ],
    audioDemoUrl: 'https://audio.qurancdn.com/wbw/001_001_002.mp3',
    practiceExercise: 'Compare: "Bismillaah" (thin Lam) vs "Nasrullaah" (thick Lam). Notice how your mouth feels wider and smiling for thin, and deeper and rounded for heavy.',
    glossaryTip: 'Tafkhim means "fattening / making thick". Tarqiq means "thinning / lightening". This contrast gives the Quran its rich vocal texture.',
    colorBadge: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800'
  }
];

export interface TajweedPracticeTarget {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  transliteration: string;
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
