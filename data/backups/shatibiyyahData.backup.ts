/**
 * Matn Ash-Shatibiyyah (حرز الأماني ووجه التهاني في القراءات السبع)
 * Author: Imam Abu Muhammad Al-Qasim ibn Firruh ibn Khalaf Al-Shatibi (538–590 AH)
 * Audio Reciter: Sheikh Okasha Kameny (الشيخ عكاشة كميني)
 * Verified against classical printed editions (Maktabah Dar al-Huda / Al-Matba'ah al-Bahiyyah, ed. Shaykh Ayman Suwayd)
 */

export interface ShatibiyyahRamz {
  symbol: string;
  imamOrRawi: string;
  category: 'individual' | 'group' | 'rule';
  meaning: string;
}

export interface ShatibiyyahBayt {
  id: string; // e.g. "shat-001"
  baytNumber: number; // e.g. 1
  formattedNumber: string; // e.g. "Bayt 001"
  arabicNumeral: string; // e.g. "١"
  shatrA: string; // صدر البيت (First hemistich)
  shatrB: string; // عجز البيت (Second hemistich)
  fullArabic: string; // Full Arabic couplet
  babId: string; // Chapter identifier
  babTitle: string; // Arabic chapter title
  pageNumber: number; // Verified printed page reference
  audioStart: number; // Start timestamp in seconds in Sheikh Okasha recording
  audioEnd: number; // End timestamp in seconds in Sheikh Okasha recording
  hasTimestamp: boolean; // Whether audio synchronization timestamp is verified
  englishTranslation: string;
  qiraatExplanation: string;
  ramzBreakdown?: ShatibiyyahRamz[];
  keyTheme?: string;
}

export interface ShatibiyyahBab {
  id: string;
  number: number;
  titleArabic: string;
  titleEnglish: string;
  baytRange: { start: number; end: number };
  versesCount: number;
  startPage: number;
  endPage: number;
  summary: string;
  summaryArabic: string;
  audioTrack: {
    title: string;
    reciter: string;
    reciterArabic: string;
    duration: string;
    durationSeconds: number;
    audioUrl: string;
    downloadUrl: string;
    partName?: string;
  };
}

export interface ShatibiyyahBookMeta {
  titleArabic: string;
  titleEnglish: string;
  commonName: string;
  commonNameArabic: string;
  author: string;
  authorArabic: string;
  authorYears: string;
  authorBio: string;
  reciter: string;
  reciterArabic: string;
  reciterBio: string;
  metre: string;
  rhyme: string;
  totalAbyat: number;
  totalPages: number;
  description: string;
  significance: string;
  audioSource: string;
}

export const SHATIBIYYAH_META: ShatibiyyahBookMeta = {
  titleArabic: 'حِرْزُ الأَمَانِي وَوَجْهُ التَّهَانِي فِي القِرَاءَاتِ السَّبْع',
  titleEnglish: 'Hirz al-Amani wa Wajh at-Tahani fi al-Qira’at as-Sab’',
  commonName: 'Matn Ash-Shatibiyyah',
  commonNameArabic: 'مَتْنُ الشَّاطِبِيَّةِ',
  author: 'Imam Abu Muhammad Al-Qasim ibn Firruh Al-Shatibi',
  authorArabic: 'الإمام أبو محمد القاسم بن فِيرُّه بن خلف الشاطبي الرعيني الأندلسي',
  authorYears: '538 – 590 AH (1144 – 1194 CE)',
  authorBio: 'Uncontested master of Qira’at, Arabic linguistics, and Hadith from Xàtiva (شاطبة), Andalusia. Taught at the Fadiliyyah in Cairo. Despite being blind, he authored this immortal 1,173-verse poem.',
  reciter: 'Sheikh Okasha Hassan Kameny',
  reciterArabic: 'الشيخ عكاشة بن حسن كَمِينِي',
  reciterBio: 'Internationally celebrated Quran reciter, scholar of the Ten Qira’at, and authority in classical poetic Mutun. Famed for rhythmic, authentic recitation.',
  metre: 'Bahr at-Taweel (بحر الطويل: فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِلُنْ)',
  rhyme: 'Lamiyah (القافية اللامية — كل بيت ينتهي بحرف اللام)',
  totalAbyat: 1173,
  totalPages: 52,
  description: 'The monumental didactic rhymed poem condensing Abu ‘Amr Ad-Dani’s At-Taysir fi al-Qira’at as-Sab’. It establishes the cryptographic cipher of the 7 Imams and their 14 transmitters.',
  significance: 'Universal bedrock for studying the Seven Minor Readings (Al-Qira’at As-Sughra) across 9 centuries.',
  audioSource: 'Al-Hirz Institute & Sheikh Okasha Kameny Studio Recordings'
};

export const SHATIBIYYAH_ABWAB: ShatibiyyahBab[] = [
  {
    id: 'muqaddimah',
    number: 1,
    titleArabic: 'مُقَدِّمَةُ المَتْنِ وَأَسْمَاءُ القُرَّاءِ وَرُمُوزُهُمْ',
    titleEnglish: 'Introduction, The Seven Imams, & Their Cryptographic Symbols',
    baytRange: { start: 1, end: 94 },
    versesCount: 94,
    startPage: 1,
    endPage: 10,
    summary: 'Praise to Allah, blessings upon the Prophet ﷺ, the virtue of the Quran reciter, introduction of the Seven Imams and their fourteen Ruwat, and the cryptographic cipher system (أبج دهز حطي...).',
    summaryArabic: 'افتتاح المنظومة بالحمد والصلاة، وبيان فضل أهل القرآن، والتعريف بالقراء السبعة وأئمتهم الرواة الأربعة عشر، وشرح نظام الرموز الحرفية والكلمية.',
    audioTrack: {
      title: 'مقدمة المتن وأسماء القراء',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '02:28',
      durationSeconds: 148,
      audioUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      downloadUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      partName: 'الجزء الأول: المقدمة'
    }
  },
  {
    id: 'istiadhah',
    number: 2,
    titleArabic: 'بَابُ الاِسْتِعَاذَةِ',
    titleEnglish: 'Chapter on Seeking Refuge (Al-Isti’adhah)',
    baytRange: { start: 95, end: 99 },
    versesCount: 5,
    startPage: 11,
    endPage: 11,
    summary: 'Rulings on pronouncing Isti’adhah aloud versus silently, the chosen prophetic phrasing, and reciting it at the start or mid-surah.',
    summaryArabic: 'أحكام الجهر بالتعوذ والإسرار به، واختيار لفظ القرآن الكريم، ومواضع الاستعاذة عند التلاوة.',
    audioTrack: {
      title: 'باب الاستعاذة',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '03:10',
      durationSeconds: 190,
      audioUrl: '/audio/shatibiyyah/istiadhah.mp3',
      downloadUrl: '/audio/shatibiyyah/istiadhah.mp3',
      partName: 'الجزء الثاني: الاستعاذة'
    }
  },
  {
    id: 'basmalah',
    number: 3,
    titleArabic: 'بَابُ البَسْمَلَةِ',
    titleEnglish: 'Chapter on the Basmalah between Two Surahs',
    baytRange: { start: 100, end: 108 },
    versesCount: 9,
    startPage: 12,
    endPage: 12,
    summary: 'Rulings on reciting the Basmalah between two consecutive Surahs: Basmalah readers (Ibn Kathir, ‘Asim, Al-Kisa’i, Qalun), Sakt and Wasl (Warsh, Abu ‘Amr, Ibn ‘Amir), and Hamzah’s wasl without Basmalah.',
    summaryArabic: 'أحكام البسملة بين السورتين لمن بسمل ولأهل السكت والوصل، وانفراد حمزة بالوصل بلا بسملة، وحكم سورة براءة.',
    audioTrack: {
      title: 'باب البسملة',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '04:00',
      durationSeconds: 240,
      audioUrl: '/audio/shatibiyyah/basmalah.mp3',
      downloadUrl: '/audio/shatibiyyah/basmalah.mp3',
      partName: 'الجزء الثالث: البسملة'
    }
  },
  {
    id: 'fatihah',
    number: 4,
    titleArabic: 'بَابُ سُورَةِ أُمِّ القُرْآنِ',
    titleEnglish: 'Chapter on Surah Umm al-Quran (Al-Fatihah)',
    baytRange: { start: 109, end: 116 },
    versesCount: 8,
    startPage: 13,
    endPage: 13,
    summary: 'Readings of مالك vs مَلِك, As-Sirat with Sad, Sin (Qunbul) or Ishmam (Khalaf), and Ha’ of Alayhim/Ilayhim with Dammah for Hamzah.',
    summaryArabic: 'فرش سورة الفاتحة: الخلاف في (مالك) و(ملك)، وقراءة الصراط بالصاد والسين والإشمام، وضم هاء (عليهم) لحمزة.',
    audioTrack: {
      title: 'باب سورة أم القرآن',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '02:41',
      durationSeconds: 161,
      audioUrl: '/audio/shatibiyyah/fatihah.mp3',
      downloadUrl: '/audio/shatibiyyah/fatihah.mp3',
      partName: 'الجزء الرابع: الفاتحة'
    }
  },
  {
    id: 'idgham_kabir',
    number: 5,
    titleArabic: 'بَابُ الإِدْغَامِ الكَبِيرِ',
    titleEnglish: 'Chapter on Major Assimilation (Al-Idgham al-Kabir)',
    baytRange: { start: 117, end: 134 },
    versesCount: 18,
    startPage: 14,
    endPage: 15,
    summary: 'The signature chapter of Abu ‘Amr al-Basri through his rawi As-Susi: assimilating two adjacent vowelled letters across one or two words.',
    summaryArabic: 'انفراد السوسي عن أبي عمرو بإدغام الحرفين المتحركين إذا التقيا لفظاً في كلمة أو كلمتين، مع بيان شروطه وموانعه.',
    audioTrack: {
      title: 'باب الإدغام الكبير',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '03:46',
      durationSeconds: 226,
      audioUrl: '/audio/shatibiyyah/idgham.mp3',
      downloadUrl: '/audio/shatibiyyah/idgham.mp3',
      partName: 'الجزء الخامس: الإدغام الكبير'
    }
  },
  {
    id: 'ha_kinayah',
    number: 6,
    titleArabic: 'بَابُ هَاءِ الكِنَايَةِ',
    titleEnglish: 'Chapter on the Pronoun Ha’ (Ha’ al-Kinayah)',
    baytRange: { start: 159, end: 167 },
    versesCount: 9,
    startPage: 18,
    endPage: 18,
    summary: 'Rules governing the 3rd person masculine pronoun Ha’ (Silah lengthening vs Qasr shortening) in words like يؤده، نوله، نصله، أرجه، ويتقه.',
    summaryArabic: 'أحكام صلة هاء الضمير وقصرها وإسكانها في الكلمات المخصوصة.',
    audioTrack: {
      title: 'باب هاء الكناية',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '02:28',
      durationSeconds: 148,
      audioUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      downloadUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      partName: 'الجزء السادس: هاء الكناية'
    }
  },
  {
    id: 'madd_qasr',
    number: 7,
    titleArabic: 'بَابُ المَدِّ وَالقَصْرِ',
    titleEnglish: 'Chapter on Madd (Elongation) and Qasr (Shortening)',
    baytRange: { start: 168, end: 180 },
    versesCount: 13,
    startPage: 19,
    endPage: 20,
    summary: 'Degrees of madd for Muttasil and Munfasil: Tul (6 counts), Tawassut (4 counts), and Qasr (2 counts). Also covers Madd Badal for Warsh.',
    summaryArabic: 'مراتب المد المتصل والمنفصل: طول لورش وحمزة، وتوسط لعاصم والكسائي وابن عامر، وقصر لقراء الحجاز والبصرة، ومذاهب ورش في البدل.',
    audioTrack: {
      title: 'باب المد والقصر',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '04:00',
      durationSeconds: 240,
      audioUrl: '/audio/shatibiyyah/basmalah.mp3',
      downloadUrl: '/audio/shatibiyyah/basmalah.mp3',
      partName: 'الجزء السابع: المد والقصر'
    }
  },
  {
    id: 'hamzatayn_kalimah',
    number: 8,
    titleArabic: 'بَابُ الهَمْزَتَيْنِ مِنْ كَلِمَةٍ',
    titleEnglish: 'Chapter on Two Adjacent Hamzahs in a Single Word',
    baytRange: { start: 181, end: 201 },
    versesCount: 21,
    startPage: 21,
    endPage: 22,
    summary: 'Tashil, Ibdaal, and Idkhal with an Alif for Qalun, Abu ‘Amr, and Hisham in words like أأنذرتهم، أئنكم، أؤنبئكم.',
    summaryArabic: 'حكم الهمزتين في كلمة: التسهيل، والإبدال، والإدخال بألف بينهما.',
    audioTrack: {
      title: 'باب الهمزتين من كلمة',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '03:46',
      durationSeconds: 226,
      audioUrl: '/audio/shatibiyyah/idgham.mp3',
      downloadUrl: '/audio/shatibiyyah/idgham.mp3',
      partName: 'الجزء الثامن: الهمزتان من كلمة'
    }
  },
  {
    id: 'hamzatayn_kalimatayn',
    number: 9,
    titleArabic: 'بَابُ الهَمْزَتَيْنِ مِنْ كَلِمَتَيْنِ',
    titleEnglish: 'Chapter on Two Adjacent Hamzahs across Two Words',
    baytRange: { start: 202, end: 215 },
    versesCount: 14,
    startPage: 23,
    endPage: 23,
    summary: 'Dropping the first hamzah (Abu ‘Amr and Qalun) and Tashil/Ibdaal of the second hamzah (Warsh and Ibn Kathir).',
    summaryArabic: 'اجتماع همزتين في كلمتين: إسقاط الأولى أو تسهيل وإبدال الثانية.',
    audioTrack: {
      title: 'باب الهمزتين من كلمتين',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '02:41',
      durationSeconds: 161,
      audioUrl: '/audio/shatibiyyah/fatihah.mp3',
      downloadUrl: '/audio/shatibiyyah/fatihah.mp3',
      partName: 'الجزء التاسع: الهمزتان من كلمتين'
    }
  },
  {
    id: 'imalah',
    number: 10,
    titleArabic: 'بَابُ الإِمَالَةِ وَالتَّقْلِيلِ',
    titleEnglish: 'Chapter on Al-Imalah & At-Taqlil',
    baytRange: { start: 292, end: 330 },
    versesCount: 39,
    startPage: 31,
    endPage: 34,
    summary: 'Major Imalah for Hamzah, Al-Kisa’i, and Abu ‘Amr; Taqlil (Bayna-Bayna) for Warsh on Dhowat al-Ya and heads of verses.',
    summaryArabic: 'أصول الإمالة الكبرى والصغرى (التقليل بين اللفظين) لذوات الياء وذوات الراء ورؤوس الآي.',
    audioTrack: {
      title: 'باب الإمالة والتقليل',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '02:28',
      durationSeconds: 148,
      audioUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      downloadUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      partName: 'الجزء العاشر: الإمالة والتقليل'
    }
  },
  {
    id: 'raat_lamat',
    number: 11,
    titleArabic: 'بَابُ مَذَاهِبِهِمْ فِي الرَّاءَاتِ وَاللاَّمَاتِ',
    titleEnglish: 'Chapter on the Rules of Ra’at and Lamat',
    baytRange: { start: 342, end: 370 },
    versesCount: 29,
    startPage: 36,
    endPage: 38,
    summary: 'Warsh’s unique Tarqeeq of vowelled Ra’ after Kasrah or Ya, and Taghleedh of open Lam preceded by Sad, Dhad, or Ta’.',
    summaryArabic: 'انفراد ورش عن نافع بترقيق الراءات بعد الكسر والياء، وتغليظ اللامات بعد الصاد والضاد والطاء.',
    audioTrack: {
      title: 'باب الراءات واللامات',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '04:00',
      durationSeconds: 240,
      audioUrl: '/audio/shatibiyyah/basmalah.mp3',
      downloadUrl: '/audio/shatibiyyah/basmalah.mp3',
      partName: 'الجزء الحادي عشر: الراءات واللامات'
    }
  },
  {
    id: 'khatimah',
    number: 12,
    titleArabic: 'خَاتِمَةُ مَتْنِ الشَّاطِبِيَّةِ',
    titleEnglish: 'The Epilogue of Matn Ash-Shatibiyyah & Author’s Supplication',
    baytRange: { start: 1150, end: 1173 },
    versesCount: 24,
    startPage: 51,
    endPage: 52,
    summary: 'Imam Al-Shatibi’s moving conclusion, naming the poem "Hirz al-Amani wa Wajh at-Tahani", humbleness, and prayers upon the Prophet ﷺ.',
    summaryArabic: 'خاتمة الإمام الشاطبي رحمه الله، وتسميته للنظم المبارك (حرز الأماني ووجه التهاني)، ودعاؤه الشريف لطالب العلم.',
    audioTrack: {
      title: 'خاتمة متن الشاطبية',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '02:41',
      durationSeconds: 161,
      audioUrl: '/audio/shatibiyyah/fatihah.mp3',
      downloadUrl: '/audio/shatibiyyah/fatihah.mp3',
      partName: 'الجزء الثاني عشر: الخاتمة'
    }
  }
];

export const SHATIBIYYAH_ABYAT: ShatibiyyahBayt[] = [
  // ========================================================
  // 1. مقدمة القصيدة (Introduction: Abyat 1 – 16)
  // Page 1 & 2 in verified printed editions
  // Audio: muqaddimah.mp3 (0.0s – 148.4s)
  // ========================================================
  {
    id: 'shat-001',
    baytNumber: 1,
    formattedNumber: 'Bayt 001',
    arabicNumeral: '١',
    shatrA: 'بَدَأْتُ بِبِسْمِ اللَّهِ فِي النَّظْمِ أَوَّلاَ',
    shatrB: 'تَبَارَكَ رَحْمَاناً رَحِيماً وَمَوْئِلاَ',
    fullArabic: 'بَدَأْتُ بِبِسْمِ اللَّهِ فِي النَّظْمِ أَوَّلاَ ... تَبَارَكَ رَحْمَاناً رَحِيماً وَمَوْئِلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 0.0,
    audioEnd: 11.5,
    hasTimestamp: true,
    englishTranslation: 'I begin with the Name of Allah in this poetic composition first of all; blessed be He as Most Merciful, Ever Merciful, and our supreme refuge.',
    qiraatExplanation: 'The author opens with the Basmalah following the divine instruction and prophetic practice of beginning noble endeavors with Allah’s holy Name.',
    keyTheme: 'البدء ببسم الله الرحمن الرحيم'
  },
  {
    id: 'shat-002',
    baytNumber: 2,
    formattedNumber: 'Bayt 002',
    arabicNumeral: '٢',
    shatrA: 'وَثَنَّيْتُ صَلَّى اللَّهُ رَبِّي عَلَى الرِّضَا',
    shatrB: 'مُحَمَّدٍ الْمُهْدَى إِلَى النَّاسِ رِسْلاَ',
    fullArabic: 'وَثَنَّيْتُ صَلَّى اللَّهُ رَبِّي عَلَى الرِّضَا ... مُحَمَّدٍ الْمُهْدَى إِلَى النَّاسِ رِسْلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 11.5,
    audioEnd: 21.0,
    hasTimestamp: true,
    englishTranslation: 'And second, may Allah my Lord send peace and blessings upon the chosen, pleasing one: Muhammad, gifted to mankind as an emissary of truth.',
    qiraatExplanation: 'Invoking salawat upon the Prophet Muhammad ﷺ, the recipient of the Noble Quran and teacher of all its variant canonical modes.',
    keyTheme: 'الصلاة على النبي ﷺ'
  },
  {
    id: 'shat-003',
    baytNumber: 3,
    formattedNumber: 'Bayt 003',
    arabicNumeral: '٣',
    shatrA: 'وَعِتْرَتِهِ ثُمَّ الصَّحَابَةِ كُلِّهِمْ',
    shatrB: 'مَدَى الدَّهْرِ صَفْواً وَالْوِلاَءَ الْمُخَلَّلاَ',
    fullArabic: 'وَعِتْرَتِهِ ثُمَّ الصَّحَابَةِ كُلِّهِمْ ... مَدَى الدَّهْرِ صَفْواً وَالْوِلاَءَ الْمُخَلَّلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 21.0,
    audioEnd: 30.5,
    hasTimestamp: true,
    englishTranslation: 'And upon his noble family, and all the Sahabah through the span of eternity, in purest affection and deep loyal friendship.',
    qiraatExplanation: 'Prayers for the Companions who memorized the Quran directly from the Prophet’s lips and faithfully passed it on to succeeding generations.',
    keyTheme: 'فضل الآل والصحابة'
  },
  {
    id: 'shat-004',
    baytNumber: 4,
    formattedNumber: 'Bayt 004',
    arabicNumeral: '٤',
    shatrA: 'وَثَلَّثْتُ أَنَّ الحَمْدَ لِلَّهِ دَائِماً',
    shatrB: 'وَمَا لَيْسَ مَبْدُوءاً بِهِ أَبْتَرُ الْعَلاَ',
    fullArabic: 'وَثَلَّثْتُ أَنَّ الحَمْدَ لِلَّهِ دَائِماً ... وَمَا لَيْسَ مَبْدُوءاً بِهِ أَبْتَرُ الْعَلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 30.5,
    audioEnd: 39.5,
    hasTimestamp: true,
    englishTranslation: 'And thirdly, all praise belongs eternally to Allah; for any noble endeavor not begun with praise of Him is cut off from sublime heights.',
    qiraatExplanation: 'Referencing the famous hadith on beginning actions with Hamdalah so that their blessings remain everlasting.',
    keyTheme: 'الحمد الدائم لله تعالى'
  },
  {
    id: 'shat-005',
    baytNumber: 5,
    formattedNumber: 'Bayt 005',
    arabicNumeral: '٥',
    shatrA: 'وَبَعْدُ فَحَبْلُ اللَّهِ فِينَا كِتَابُهُ',
    shatrB: 'فَجَاهِدْ بِهِ حَبْلَ الْعِدَا مُتَحَبِّلاَ',
    fullArabic: 'وَبَعْدُ فَحَبْلُ اللَّهِ فِينَا كِتَابُهُ ... فَجَاهِدْ بِهِ حَبْلَ الْعِدَا مُتَحَبِّلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 39.5,
    audioEnd: 48.5,
    hasTimestamp: true,
    englishTranslation: 'And thereafter: the firm rope of Allah among us is His Book; so strive with it against the ploys of adversaries, seeking divine protection.',
    qiraatExplanation: 'The Quran is the unbreakable rope of Allah mentioned in the hadith: (وهو حبل الله المتين وهو الذكر الحكيم).',
    keyTheme: 'القرآن حبل الله المتين'
  },
  {
    id: 'shat-006',
    baytNumber: 6,
    formattedNumber: 'Bayt 006',
    arabicNumeral: '٦',
    shatrA: 'وَأَخْلِقْ بِهِ إِذْ لَيْسَ يَخْلُقُ جِدَّةً',
    shatrB: 'جَدِيداً مُوَالِيهِ عَلَى الْجِدِّ مُقْبِلاَ',
    fullArabic: 'وَأَخْلِقْ بِهِ إِذْ لَيْسَ يَخْلُقُ جِدَّةً ... جَدِيداً مُوَالِيهِ عَلَى الْجِدِّ مُقْبِلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 48.5,
    audioEnd: 57.0,
    hasTimestamp: true,
    englishTranslation: 'How worthy it is of reverence! For its freshness never wears away; ever renewed, calling its companion to tireless diligence.',
    qiraatExplanation: 'The miracle of the Quran: no matter how often recited, it never feels dated, repetitive, or exhausted.',
    keyTheme: 'تجدد إعجاز القرآن'
  },
  {
    id: 'shat-007',
    baytNumber: 7,
    formattedNumber: 'Bayt 007',
    arabicNumeral: '٧',
    shatrA: 'وَقَارِئُهُ الْمَرْضِيُّ قَرَّ مِثَالُهُ',
    shatrB: 'كَأُتْرُجَّةٍ مَا طَابَ نَشْراً وَمَأْكَلاَ',
    fullArabic: 'وَقَارِئُهُ الْمَرْضِيُّ قَرَّ مِثَالُهُ ... كَأُتْرُجَّةٍ مَا طَابَ نَشْراً وَمَأْكَلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 57.0,
    audioEnd: 65.5,
    hasTimestamp: true,
    englishTranslation: 'And its pleasing reciter is fittingly likened to a citron fruit: fragrant in scent, delectable and sweet in taste.',
    qiraatExplanation: 'Echoing the Sahih hadith: (مثل المؤمن الذي يقرأ القرآن كمثل الأترجة ريحها طيب وطعمها طيب).',
    keyTheme: 'مثل قارئ القرآن كالأترجة'
  },
  {
    id: 'shat-008',
    baytNumber: 8,
    formattedNumber: 'Bayt 008',
    arabicNumeral: '٨',
    shatrA: 'هُوَ الْمُرْتَضَى أَمّاً وَإِلْفاً وَشَافِعاً',
    shatrB: 'يَنَالُ بِهِ مَنْ خَالَفَ الْبَيْعَ حِمْلاَ',
    fullArabic: 'هُوَ الْمُرْتَضَى أَمّاً وَإِلْفاً وَشَافِعاً ... يَنَالُ بِهِ مَنْ خَالَفَ الْبَيْعَ حِمْلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 1,
    audioStart: 65.5,
    audioEnd: 74.0,
    hasTimestamp: true,
    englishTranslation: 'He is the beloved: a mother, an intimate friend, and an intercessor through whom the reciter receives weighty celestial honor.',
    qiraatExplanation: 'The Quran accompanies its bearer in this life and becomes a steadfast intercessor before Allah on the Day of Judgment.',
    keyTheme: 'شفاعة القرآن لصاحبه'
  },
  {
    id: 'shat-009',
    baytNumber: 9,
    formattedNumber: 'Bayt 009',
    arabicNumeral: '٩',
    shatrA: 'وَإِنَّ كِتَابَ اللَّهِ أَوْثَقُ شَافِعٍ',
    shatrB: 'وَأَغْنَى غَنَاءٍ وَاهِباً مُتَفَضِّلاَ',
    fullArabic: 'وَإِنَّ كِتَابَ اللَّهِ أَوْثَقُ شَافِعٍ ... وَأَغْنَى غَنَاءٍ وَاهِباً مُتَفَضِّلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 74.0,
    audioEnd: 83.0,
    hasTimestamp: true,
    englishTranslation: 'Indeed, the Book of Allah is the most trustworthy intercessor, the richest of all treasures, generously giving and bestowing excellence.',
    qiraatExplanation: 'Highlighting that the Quran will intercede on the Day of Judgment for its companion who recited and lived by it.',
    keyTheme: 'أوثق شافع'
  },
  {
    id: 'shat-010',
    baytNumber: 10,
    formattedNumber: 'Bayt 010',
    arabicNumeral: '١٠',
    shatrA: 'وَخَيْرُ جَلِيسٍ لاَ يُمَلُّ حَدِيثُهُ',
    shatrB: 'وَتَرْدَادُهُ يَزْدَادُ فِيهِ تَجَمُّلاَ',
    fullArabic: 'وَخَيْرُ جَلِيسٍ لاَ يُمَلُّ حَدِيثُهُ ... وَتَرْدَادُهُ يَزْدَادُ فِيهِ تَجَمُّلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 75.5,
    audioEnd: 84.5,
    hasTimestamp: true,
    englishTranslation: 'It is the best companion whose speech never bores, and whose repetition only increases it in elegance and radiant beauty.',
    qiraatExplanation: 'Unlike worldly literature, reciting the Quran repeatedly deepens reverence and discloses fresh layers of guidance.',
    keyTheme: 'خير جليس'
  },
  {
    id: 'shat-011',
    baytNumber: 11,
    formattedNumber: 'Bayt 011',
    arabicNumeral: '١١',
    shatrA: 'وَحَيْثُ الْفَتَى يَرْتَاعُ فِي ظُلُمَاتِهِ',
    shatrB: 'مِنَ الْقَبْرِ يَلْقَاهُ هُنَاكَ مُهَلِّلاَ',
    fullArabic: 'وَحَيْثُ الْفَتَى يَرْتَاعُ فِي ظُلُمَاتِهِ ... مِنَ الْقَبْرِ يَلْقَاهُ هُنَاكَ مُهَلِّلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 84.5,
    audioEnd: 93.5,
    hasTimestamp: true,
    englishTranslation: 'And where the youth is terrified in the darkness of the grave, the Quran meets him there with radiant tidings of joy.',
    qiraatExplanation: 'The recitation of the Quran illuminates the grave and comforts the believer during questioning.',
    keyTheme: 'القرآن أنيس في القبر'
  },
  {
    id: 'shat-012',
    baytNumber: 12,
    formattedNumber: 'Bayt 012',
    arabicNumeral: '١٢',
    shatrA: 'يُنَادِيهِ لاَ تَقْنَطْ فَإِنَّكَ فِي حِمَى',
    shatrB: 'شَفِيعٍ كَرِيمٍ بِالْمَكَارِمِ نُزِّلاَ',
    fullArabic: 'يُنَادِيهِ لاَ تَقْنَطْ فَإِنَّكَ فِي حِمَى ... شَفِيعٍ كَرِيمٍ بِالْمَكَارِمِ نُزِّلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 93.5,
    audioEnd: 102.5,
    hasTimestamp: true,
    englishTranslation: 'It calls out to him: Despair not! For you are in the sanctuary of a noble intercessor endowed with sublime generosity.',
    qiraatExplanation: 'The Quran reassures its reader in the hereafter, fulfilling its promise of divine intercession.',
    keyTheme: 'بشارة القرآن لصاحبه'
  },
  {
    id: 'shat-013',
    baytNumber: 13,
    formattedNumber: 'Bayt 013',
    arabicNumeral: '١٣',
    shatrA: 'فَيَا أَيُّهَا الْقَارِي بِهِ مُتَمَسِّكاً',
    shatrB: 'مُجِلاًّ لَهُ فِي كُلِّ حَالٍ مُبَجِّلاَ',
    fullArabic: 'فَيَا أَيُّهَا الْقَارِي بِهِ مُتَمَسِّكاً ... مُجِلاًّ لَهُ فِي كُلِّ حَالٍ مُبَجِّلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 102.5,
    audioEnd: 112.0,
    hasTimestamp: true,
    englishTranslation: 'O reciter holding fast unto it, exalting it and honoring it with deep reverence in every condition!',
    qiraatExplanation: 'Direct address to the dedicated student and bearer of the Quran.',
    keyTheme: 'نداء قارئ القرآن'
  },
  {
    id: 'shat-014',
    baytNumber: 14,
    formattedNumber: 'Bayt 014',
    arabicNumeral: '١٤',
    shatrA: 'هَنِيئاً مَرِيئاً وَالِدَاكَ عَلَيْهِمَا',
    shatrB: 'مَلاَبِسُ أَنْوَارٍ مِنَ التَّاجِ وَالحُلاَ',
    fullArabic: 'هَنِيئاً مَرِيئاً وَالِدَاكَ عَلَيْهِمَا ... مَلاَبِسُ أَنْوَارٍ مِنَ التَّاجِ وَالحُلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 112.0,
    audioEnd: 122.0,
    hasTimestamp: true,
    englishTranslation: 'Glad tidings and wholesome joy to you! Your parents shall be adorned with radiant robes of divine light, a magnificent crown, and celestial garments.',
    qiraatExplanation: 'Allusion to the authentic hadith where parents of the Quran memorizer are crowned with crowns surpassing the splendor of the sun.',
    keyTheme: 'تاج الوقار لوالدي القارئ'
  },
  {
    id: 'shat-015',
    baytNumber: 15,
    formattedNumber: 'Bayt 015',
    arabicNumeral: '١٥',
    shatrA: 'فَمَا ظَنُّكُمْ بِالنَّجْلِ عِنْدَ جَزَائِهِ',
    shatrB: 'أُولَئِكَ أَهْلُ اللَّهِ وَالصَّفْوَةُ الْمَلاَ',
    fullArabic: 'فَمَا ظَنُّكُمْ بِالنَّجْلِ عِنْدَ جَزَائِهِ ... أُولَئِكَ أَهْلُ اللَّهِ وَالصَّفْوَةُ الْمَلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 122.0,
    audioEnd: 133.0,
    hasTimestamp: true,
    englishTranslation: 'What then do you imagine the reward of the child himself will be? Those are the people of Allah, the elite and purest of creation.',
    qiraatExplanation: 'Prophetic hadith: (إن لله أهلين من الناس، قيل: من هم يا رسول الله؟ قال: أهل القرآن هم أهل الله وخاصته).',
    keyTheme: 'أهل القرآن هم أهل الله'
  },
  {
    id: 'shat-016',
    baytNumber: 16,
    formattedNumber: 'Bayt 016',
    arabicNumeral: '١٦',
    shatrA: 'أُولُوا الْبِرِّ وَالإِحْسَانِ وَالصَّبْرِ وَالتُّقَى',
    shatrB: 'حُلاَهُمْ بِهَا جَاءَتْ حُمَاةً وَأَنْبُلاَ',
    fullArabic: 'أُولُوا الْبِرِّ وَالإِحْسَانِ وَالصَّبْرِ وَالتُّقَى ... حُلاَهُمْ بِهَا جَاءَتْ حُمَاةً وَأَنْبُلاَ',
    babId: 'muqaddimah',
    babTitle: 'مقدمة المتن',
    pageNumber: 2,
    audioStart: 133.0,
    audioEnd: 148.4,
    hasTimestamp: true,
    englishTranslation: 'The people of piety, righteousness, patience, and God-consciousness; their ornaments came safeguarding them with noble arrows of light.',
    qiraatExplanation: 'Attributes of true Huffadh: inner piety, humility, and moral excellence.',
    keyTheme: 'صفات أهل القرآن'
  },

  // ========================================================
  // أسماء القراء السبعة ورواتهم (Abyat 20 – 35)
  // Page 3 & 4 in verified printed editions
  // ========================================================
  {
    id: 'shat-020',
    baytNumber: 20,
    formattedNumber: 'Bayt 020',
    arabicNumeral: '٢٠',
    shatrA: 'فَأَمَّا الْكَرِيمُ السِّرِّ فِي الطِّيبِ نَافِعٌ',
    shatrB: 'فَذَاكَ الَّذِي اخْتَارَ الْمَدِينَةَ مَنْزِلاَ',
    fullArabic: 'فَأَمَّا الْكَرِيمُ السِّرِّ فِي الطِّيبِ نَافِعٌ ... فَذَاكَ الَّذِي اخْتَارَ الْمَدِينَةَ مَنْزِلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 3,
    audioStart: 0.0,
    audioEnd: 10.0,
    hasTimestamp: false,
    englishTranslation: 'As for the noble in inner purity and pleasant fragrance, Nafi‘: he is the one who took Madinah the Enlightened as his home and sanctuary.',
    qiraatExplanation: 'Introducing Imam Nafi‘ ibn ‘Abd ar-Rahman al-Madani (d. 169 AH), cipher (أ).',
    ramzBreakdown: [
      { symbol: 'أ', imamOrRawi: 'الإمام نافع المدني', category: 'individual', meaning: 'رمز نافع حرف الهمزة' }
    ],
    keyTheme: 'الإمام الأول: نافع المدني'
  },
  {
    id: 'shat-021',
    baytNumber: 21,
    formattedNumber: 'Bayt 021',
    arabicNumeral: '٢١',
    shatrA: 'وَقَالُونُ عِيسَى ثُمَّ عُثْمَانُ وَرْشُهُمْ',
    shatrB: 'بِصُحْبَتِهِ المَجْدَ الرَّفِيعَ تَأَثَّلاَ',
    fullArabic: 'وَقَالُونُ عِيسَى ثُمَّ عُثْمَانُ وَرْشُهُمْ ... بِصُحْبَتِهِ المَجْدَ الرَّفِيعَ تَأَثَّلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 3,
    audioStart: 10.0,
    audioEnd: 20.0,
    hasTimestamp: false,
    englishTranslation: 'And Qalun ‘Isa, then ‘Uthman called Warsh: through long companionship with him, they firmly established lofty renown and glory.',
    qiraatExplanation: 'Transmitters of Nafi‘: Qalun (ب) and Warsh (ج). Together with Nafi‘ they form (أبج).',
    ramzBreakdown: [
      { symbol: 'ب', imamOrRawi: 'قالون', category: 'individual', meaning: 'رمز قالون عن نافع' },
      { symbol: 'ج', imamOrRawi: 'ورش', category: 'individual', meaning: 'رمز ورش عن نافع' }
    ],
    keyTheme: 'راويا نافع: قالون وورش'
  },
  {
    id: 'shat-022',
    baytNumber: 22,
    formattedNumber: 'Bayt 022',
    arabicNumeral: '٢٢',
    shatrA: 'وَمَكَّةُ عَبْدُ اللَّهِ فِيهَا مُقَامُهُ',
    shatrB: 'هُوَ ابْنُ كَثِيرٍ حُرْمَةَ الْقَوْمِ يَمَّمَا',
    fullArabic: 'وَمَكَّةُ عَبْدُ اللَّهِ فِيهَا مُقَامُهُ ... هُوَ ابْنُ كَثِيرٍ حُرْمَةَ الْقَوْمِ يَمَّمَا',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 3,
    audioStart: 20.0,
    audioEnd: 30.0,
    hasTimestamp: false,
    englishTranslation: 'And in Makkah, ‘Abdullah had his abode; he is Ibn Kathir, who turned towards the sacred sanctuary of his people.',
    qiraatExplanation: 'Imam ‘Abdullah ibn Kathir al-Makki (d. 120 AH), cipher (د).',
    ramzBreakdown: [
      { symbol: 'د', imamOrRawi: 'ابن كثير المكي', category: 'individual', meaning: 'رمز الإمام ابن كثير' }
    ],
    keyTheme: 'الإمام الثاني: ابن كثير المكي'
  },
  {
    id: 'shat-023',
    baytNumber: 23,
    formattedNumber: 'Bayt 023',
    arabicNumeral: '٢٣',
    shatrA: 'رَوَى أَحْمَدُ الْبَزِّيُّ لَهُ وَمُحَمَّدٌ',
    shatrB: 'عَلَى سَنَدٍ وَهْوَ المُلَقَّبُ قُنْبُلاَ',
    fullArabic: 'رَوَى أَحْمَدُ الْبَزِّيُّ لَهُ وَمُحَمَّدٌ ... عَلَى سَنَدٍ وَهْوَ المُلَقَّبُ قُنْبُلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 3,
    audioStart: 30.0,
    audioEnd: 40.0,
    hasTimestamp: false,
    englishTranslation: 'Ahmad al-Bazzi transmitted on his authority, and Muhammad through verified transmission, known by the title Qunbul.',
    qiraatExplanation: 'Transmitters of Ibn Kathir: Al-Bazzi (هـ) and Qunbul (ز). Cipher word (دهز).',
    ramzBreakdown: [
      { symbol: 'هـ', imamOrRawi: 'البزي', category: 'individual', meaning: 'رمز البزي عن ابن كثير' },
      { symbol: 'ز', imamOrRawi: 'قنبل', category: 'individual', meaning: 'رمز قنبل عن ابن كثير' }
    ],
    keyTheme: 'راويا ابن كثير: البزي وقنبل'
  },
  {
    id: 'shat-024',
    baytNumber: 24,
    formattedNumber: 'Bayt 024',
    arabicNumeral: '٢٤',
    shatrA: 'وَأَمَّا الإِمَامُ المَازِنِيُّ صَرِيحُهُمْ',
    shatrB: 'أَبُو عَمْرٍو الْبَصْرِيُّ فَوَالِدُهُ الْعَلاَ',
    fullArabic: 'وَأَمَّا الإِمَامُ المَازِنِيُّ صَرِيحُهُمْ ... أَبُو عَمْرٍو الْبَصْرِيُّ فَوَالِدُهُ الْعَلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 3,
    audioStart: 40.0,
    audioEnd: 50.0,
    hasTimestamp: false,
    englishTranslation: 'As for the Imam of Banu Mazin: Abu ‘Amr al-Basri, whose father was al-‘Ala.',
    qiraatExplanation: 'Imam Abu ‘Amr Zabban ibn al-‘Ala al-Basri (d. 154 AH), cipher (ح).',
    ramzBreakdown: [
      { symbol: 'ح', imamOrRawi: 'أبو عمرو البصري', category: 'individual', meaning: 'رمز الإمام أبي عمرو' }
    ],
    keyTheme: 'الإمام الثالث: أبو عمرو البصري'
  },
  {
    id: 'shat-026',
    baytNumber: 26,
    formattedNumber: 'Bayt 026',
    arabicNumeral: '٢٦',
    shatrA: 'أَبُو عُمَرَ الدُّورِيُّ وَصَالِحُهُمْ جَدَا',
    shatrB: 'أَبُو شُعَيْبٍ هُوَ السُّوسِيُّ عَنْهُ تَقَبَّلاَ',
    fullArabic: 'أَبُو عُمَرَ الدُّورِيُّ وَصَالِحُهُمْ جَدَا ... أَبُو شُعَيْبٍ هُوَ السُّوسِيُّ عَنْهُ تَقَبَّلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 3,
    audioStart: 50.0,
    audioEnd: 60.0,
    hasTimestamp: false,
    englishTranslation: 'Abu ‘Umar ad-Duri, and their pious master Abu Shu‘ayb who is as-Susi, received the readings from him.',
    qiraatExplanation: 'Transmitters of Abu ‘Amr: Ad-Duri (ط) and As-Susi (ي). Cipher word (حطي).',
    ramzBreakdown: [
      { symbol: 'ط', imamOrRawi: 'الدوري عن أبي عمرو', category: 'individual', meaning: 'رمز الدوري' },
      { symbol: 'ي', imamOrRawi: 'السوسي عن أبي عمرو', category: 'individual', meaning: 'رمز السوسي' }
    ],
    keyTheme: 'راويا أبي عمرو: الدوري والسوسي'
  },
  {
    id: 'shat-027',
    baytNumber: 27,
    formattedNumber: 'Bayt 027',
    arabicNumeral: '٢٧',
    shatrA: 'وَأَمَّا دِمَشْقُ الشَّامِ دَارُ ابْنِ عَامِرٍ',
    shatrB: 'فَتِلْكَ بِعَبْدِ اللَّهِ طَابَتْ مُحَلَّلاَ',
    fullArabic: 'وَأَمَّا دِمَشْقُ الشَّامِ دَارُ ابْنِ عَامِرٍ ... فَتِلْكَ بِعَبْدِ اللَّهِ طَابَتْ مُحَلَّلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 60.0,
    audioEnd: 70.0,
    hasTimestamp: false,
    englishTranslation: 'And Damascus of the Levant, the dwelling of Ibn ‘Amir: through ‘Abdullah it became sweet and blessed as a resting place.',
    qiraatExplanation: 'Imam ‘Abdullah ibn ‘Amir ash-Shami (d. 118 AH), cipher (ك).',
    ramzBreakdown: [
      { symbol: 'ك', imamOrRawi: 'ابن عامر الشامي', category: 'individual', meaning: 'رمز الإمام ابن عامر' }
    ],
    keyTheme: 'الإمام الرابع: ابن عامر الشامي'
  },
  {
    id: 'shat-028',
    baytNumber: 28,
    formattedNumber: 'Bayt 028',
    arabicNumeral: '٢٨',
    shatrA: 'هِشَامٌ وَعَبْدُ اللَّهِ وَهْوَ ابْنُ ذَكْوَانَ',
    shatrB: 'لإِسْنَادِهِ عَنْهُ انْتَسَاباً تَقَبَّلاَ',
    fullArabic: 'هِشَامٌ وَعَبْدُ اللَّهِ وَهْوَ ابْنُ ذَكْوَانَ ... لإِسْنَادِهِ عَنْهُ انْتَسَاباً تَقَبَّلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 70.0,
    audioEnd: 80.0,
    hasTimestamp: false,
    englishTranslation: 'Hisham and ‘Abdullah who is Ibn Dhakwan, with proud affiliation received the transmission from him.',
    qiraatExplanation: 'Transmitters of Ibn ‘Amir: Hisham (ل) and Ibn Dhakwan (م). Cipher word (كلمن).',
    ramzBreakdown: [
      { symbol: 'ل', imamOrRawi: 'هشام', category: 'individual', meaning: 'رمز هشام عن ابن عامر' },
      { symbol: 'م', imamOrRawi: 'ابن ذكوان', category: 'individual', meaning: 'رمز ابن ذكوان' }
    ],
    keyTheme: 'راويا ابن عامر: هشام وابن ذكوان'
  },
  {
    id: 'shat-030',
    baytNumber: 30,
    formattedNumber: 'Bayt 030',
    arabicNumeral: '٣٠',
    shatrA: 'فَأَمَّا أَبُو بَكْرٍ وَعَاصِمٌ اسْمُهُ',
    shatrB: 'فَشُعْبَةُ رَاوِيهِ المَبَرَّزُ أَفْضَلاَ',
    fullArabic: 'فَأَمَّا أَبُو بَكْرٍ وَعَاصِمٌ اسْمُهُ ... فَشُعْبَةُ رَاوِيهِ المَبَرَّزُ أَفْضَلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 80.0,
    audioEnd: 90.0,
    hasTimestamp: false,
    englishTranslation: 'As for Abu Bakr whose name was ‘Asim: Shu‘bah was his distinguished and foremost transmitter.',
    qiraatExplanation: 'Imam ‘Asim ibn Abi an-Najud al-Kufi (ن) and Shu‘bah (ص).',
    ramzBreakdown: [
      { symbol: 'ن', imamOrRawi: 'عاصم الكوفي', category: 'individual', meaning: 'رمز عاصم' },
      { symbol: 'ص', imamOrRawi: 'شعبة', category: 'individual', meaning: 'رمز شعبة عن عاصم' }
    ],
    keyTheme: 'الإمام الخامس: عاصم وشعبة'
  },
  {
    id: 'shat-031',
    baytNumber: 31,
    formattedNumber: 'Bayt 031',
    arabicNumeral: '٣١',
    shatrA: 'وَذَاكَ ابْنُ سُلَيْمَانَ حَفْصٌ وَبِالرِّضَا',
    shatrB: 'كَسَاهُ كِسَاءً جَمَّلاً مُتَسَرْبِلاَ',
    fullArabic: 'وَذَاكَ ابْنُ سُلَيْمَانَ حَفْصٌ وَبِالرِّضَا ... كَسَاهُ كِسَاءً جَمَّلاً مُتَسَرْبِلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 90.0,
    audioEnd: 100.0,
    hasTimestamp: false,
    englishTranslation: 'And that was Hafs ibn Sulayman, whom he clothed in garments of pleasing perfection and mastery.',
    qiraatExplanation: 'Hafs ibn Sulayman (ع), rawi of ‘Asim. Cipher word (نصع).',
    ramzBreakdown: [
      { symbol: 'ع', imamOrRawi: 'حفص', category: 'individual', meaning: 'رمز حفص عن عاصم' }
    ],
    keyTheme: 'راوي عاصم الثاني: حفص'
  },
  {
    id: 'shat-032',
    baytNumber: 32,
    formattedNumber: 'Bayt 032',
    arabicNumeral: '٣٢',
    shatrA: 'وَحَمْزَةُ مَا أَزْكَاهُ مِنْ مُتَوَرِّعٍ',
    shatrB: 'إِمَاماً صَبُوراً لِلقُرْآنِ مُرَتِّلاَ',
    fullArabic: 'وَحَمْزَةُ مَا أَزْكَاهُ مِنْ مُتَوَرِّعٍ ... إِمَاماً صَبُوراً لِلقُرْآنِ مُرَتِّلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 100.0,
    audioEnd: 110.0,
    hasTimestamp: false,
    englishTranslation: 'And Hamzah: how purest in piety he was! A patient, steadfast Imam reciting the Quran with slow measured devotion.',
    qiraatExplanation: 'Imam Hamzah az-Zayyat (ف).',
    ramzBreakdown: [
      { symbol: 'ف', imamOrRawi: 'حمزة الزيات', category: 'individual', meaning: 'رمز حمزة' }
    ],
    keyTheme: 'الإمام السادس: حمزة الزيات'
  },
  {
    id: 'shat-033',
    baytNumber: 33,
    formattedNumber: 'Bayt 033',
    arabicNumeral: '٣٣',
    shatrA: 'رَوَى خَلَفٌ عَنْهُ وَخَلاَّدٌ الَّذِي',
    shatrB: 'رَوَاهُ سُلَيْمٌ مُتْقِناً وَمُحَصِّلاَ',
    fullArabic: 'رَوَى خَلَفٌ عَنْهُ وَخَلاَّدٌ الَّذِي ... رَوَاهُ سُلَيْمٌ مُتْقِناً وَمُحَصِّلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 110.0,
    audioEnd: 120.0,
    hasTimestamp: false,
    englishTranslation: 'Khalaf transmitted from him, and Khallad who took it through Sulaym with impeccable precision and mastery.',
    qiraatExplanation: 'Transmitters of Hamzah: Khalaf (ض) and Khallad (ق). Cipher word (فضق).',
    ramzBreakdown: [
      { symbol: 'ض', imamOrRawi: 'خلف عن حمزة', category: 'individual', meaning: 'رمز خلف' },
      { symbol: 'ق', imamOrRawi: 'خلاد عن حمزة', category: 'individual', meaning: 'رمز خلاد' }
    ],
    keyTheme: 'راويا حمزة: خلف وخلاد'
  },
  {
    id: 'shat-034',
    baytNumber: 34,
    formattedNumber: 'Bayt 034',
    arabicNumeral: '٣٤',
    shatrA: 'وَأَمَّا عَلِيٌّ فَالْكِسَائِيُّ نَعْتُهُ',
    shatrB: 'لِمَا كَانَ فِي الإِحْرَامِ فِيهِ تَسَرْبَلاَ',
    fullArabic: 'وَأَمَّا عَلِيٌّ فَالْكِسَائِيُّ نَعْتُهُ ... لِمَا كَانَ فِي الإِحْرَامِ فِيهِ تَسَرْبَلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 120.0,
    audioEnd: 130.0,
    hasTimestamp: false,
    englishTranslation: 'As for ‘Ali, Al-Kisa’i was his title, because of the cloak (kisa’) he wore while in Ihram for pilgrimage.',
    qiraatExplanation: 'Imam ‘Ali ibn Hamzah al-Kisa’i (ر).',
    ramzBreakdown: [
      { symbol: 'ر', imamOrRawi: 'علي الكسائي', category: 'individual', meaning: 'رمز الكسائي' }
    ],
    keyTheme: 'الإمام السابع: الكسائي'
  },
  {
    id: 'shat-035',
    baytNumber: 35,
    formattedNumber: 'Bayt 035',
    arabicNumeral: '٣٥',
    shatrA: 'رَوَى لَيْثُهُمْ عَنْهُ أَبُو الحَارِثِ الرِّضَا',
    shatrB: 'وَحَفْصٌ هُوَ الدُّورِيُّ فِيهِ تَحَفَّلاَ',
    fullArabic: 'رَوَى لَيْثُهُمْ عَنْهُ أَبُو الحَارِثِ الرِّضَا ... وَحَفْصٌ هُوَ الدُّورِيُّ فِيهِ تَحَفَّلاَ',
    babId: 'muqaddimah',
    babTitle: 'أسماء القراء السبعة',
    pageNumber: 4,
    audioStart: 130.0,
    audioEnd: 140.0,
    hasTimestamp: false,
    englishTranslation: 'Their lion Abu al-Harith the pleasing transmitted from him, and Hafs who is ad-Duri rejoiced in transmitting his reading.',
    qiraatExplanation: 'Transmitters of Al-Kisa’i: Abu al-Harith (س) and Ad-Duri (ت). Cipher word (رست).',
    ramzBreakdown: [
      { symbol: 'س', imamOrRawi: 'أبو الحارث', category: 'individual', meaning: 'رمز أبي الحارث عن الكسائي' },
      { symbol: 'ت', imamOrRawi: 'الدوري عن الكسائي', category: 'individual', meaning: 'رمز الدوري عن الكسائي' }
    ],
    keyTheme: 'راويا الكسائي: أبو الحارث والدوري'
  },

  // ========================================================
  // 2. باب الاستعاذة (Isti’adhah: Abyat 95 – 99)
  // Page 11 in verified printed editions
  // Audio: istiadhah.mp3 (0.0s – 190.76s)
  // ========================================================
  {
    id: 'shat-095',
    baytNumber: 95,
    formattedNumber: 'Bayt 095',
    arabicNumeral: '٩٥',
    shatrA: 'إِذَا مَا أَرَدْتَ الدَّهْرَ تَقْرَأُ فَاسْتَعِذْ',
    shatrB: 'جِهَاراً مِنَ الشَّيْطَانِ بِاللَّهِ مُسْجَلاَ',
    fullArabic: 'إِذَا مَا أَرَدْتَ الدَّهْرَ تَقْرَأُ فَاسْتَعِذْ ... جِهَاراً مِنَ الشَّيْطَانِ بِاللَّهِ مُسْجَلاَ',
    babId: 'istiadhah',
    babTitle: 'باب الاستعاذة',
    pageNumber: 11,
    audioStart: 0.0,
    audioEnd: 35.0,
    hasTimestamp: true,
    englishTranslation: 'Whenever you wish to recite the Quran at any time, seek refuge openly and aloud in Allah from the accursed Satan, as generally commanded.',
    qiraatExplanation: 'Commanding the reciter to pronounce the Isti’adhah before beginning recitation based on Surah An-Nahl (فَإِذَا قَرَأْتَ الْقُرْآنَ فَاسْتَعِذْ بِاللَّهِ).',
    keyTheme: 'الأمر بالاستعاذة عند التلاوة'
  },
  {
    id: 'shat-096',
    baytNumber: 96,
    formattedNumber: 'Bayt 096',
    arabicNumeral: '٩٦',
    shatrA: 'عَلَى مَا أَتَى فِي النَّحْلِ يُسْراً وَإِنْ تَزِدْ',
    shatrB: 'لِرَبِّكَ تَنْزِيهاً فَلَسْتَ مُجَهَّلاَ',
    fullArabic: 'عَلَى مَا أَتَى فِي النَّحْلِ يُسْراً وَإِنْ تَزِدْ ... لِرَبِّكَ تَنْزِيهاً فَلَسْتَ مُجَهَّلاَ',
    babId: 'istiadhah',
    babTitle: 'باب الاستعاذة',
    pageNumber: 11,
    audioStart: 35.0,
    audioEnd: 72.0,
    hasTimestamp: true,
    englishTranslation: 'Following what came in Surah An-Nahl with ease; and if you add formulas glorifying your Lord (such as al-‘Alim or as-Sami‘), you are by no means in error.',
    qiraatExplanation: 'Permissibility of adding authentic invocations such as (أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ).',
    keyTheme: 'صيغ التعوذ الواردة'
  },
  {
    id: 'shat-097',
    baytNumber: 97,
    formattedNumber: 'Bayt 097',
    arabicNumeral: '٩٧',
    shatrA: 'وَقَدْ ذَكَرُوا لَفْظَ النَّبِيِّ وَشَمْلُهُ',
    shatrB: 'تَوَشَّحَ بِالقُرْآنِ شَمْلاً مُجَمَّلاَ',
    fullArabic: 'وَقَدْ ذَكَرُوا لَفْظَ النَّبِيِّ وَشَمْلُهُ ... تَوَشَّحَ بِالقُرْآنِ شَمْلاً مُجَمَّلاَ',
    babId: 'istiadhah',
    babTitle: 'باب الاستعاذة',
    pageNumber: 11,
    audioStart: 72.0,
    audioEnd: 110.0,
    hasTimestamp: true,
    englishTranslation: 'The scholars cited the verbatim phrasing of the Prophet ﷺ, whose entire mantle was adorned with the splendor of the Quran.',
    qiraatExplanation: 'Stressing following the Prophetic formulation preserved in the Sunnah.',
    keyTheme: 'اتباع اللفظ النبوي'
  },
  {
    id: 'shat-098',
    baytNumber: 98,
    formattedNumber: 'Bayt 098',
    arabicNumeral: '٩٨',
    shatrA: 'وَإِنْ تَسْكُنِ الْفَاءَاتِ وَاقْطَعْ وَصِلْ لَهُمْ',
    shatrB: 'فَلاَ تَعْدُ مَا أَهْلُ الأَدَاءِ لَهُ انْتَلَى',
    fullArabic: 'وَإِنْ تَسْكُنِ الْفَاءَاتِ وَاقْطَعْ وَصِلْ لَهُمْ ... فَلاَ تَعْدُ مَا أَهْلُ الأَدَاءِ لَهُ انْتَلَى',
    babId: 'istiadhah',
    babTitle: 'باب الاستعاذة',
    pageNumber: 11,
    audioStart: 110.0,
    audioEnd: 150.0,
    hasTimestamp: true,
    englishTranslation: 'And if you pause or connect, do not transgress what the authentic masters of recitation have faithfully conveyed.',
    qiraatExplanation: 'Rulings on pausing after Isti’adhah, joining it with Basmalah, or joining all four facets.',
    keyTheme: 'أوجه الوقف والوصل في الاستعاذة'
  },
  {
    id: 'shat-099',
    baytNumber: 99,
    formattedNumber: 'Bayt 099',
    arabicNumeral: '٩٩',
    shatrA: 'وَإِخْفَاؤُهُ فُصِّلْتَ تَنْزِيلُ نَصِّهِ',
    shatrB: 'وَقِيلَ عَلَى الإِجْمَاعِ لَيْسَ مُعَدَّلاَ',
    fullArabic: 'وَإِخْفَاؤُهُ فُصِّلْتَ تَنْزِيلُ نَصِّهِ ... وَقِيلَ عَلَى الإِجْمَاعِ لَيْسَ مُعَدَّلاَ',
    babId: 'istiadhah',
    babTitle: 'باب الاستعاذة',
    pageNumber: 11,
    audioStart: 150.0,
    audioEnd: 190.7,
    hasTimestamp: true,
    englishTranslation: 'And reciting Isti’adhah silently in prayer or quiet study is detailed in authoritative transmissions.',
    qiraatExplanation: 'When to whisper the Isti’adhah (in silent prayers, private recitation, or when following an Imam).',
    keyTheme: 'مواضع الإسرار بالاستعاذة'
  },

  // ========================================================
  // 3. باب البسملة (Basmalah: Abyat 100 – 108)
  // Page 12 in verified printed editions
  // Audio: basmalah.mp3 (0.0s – 240.58s)
  // ========================================================
  {
    id: 'shat-100',
    baytNumber: 100,
    formattedNumber: 'Bayt 100',
    arabicNumeral: '١٠٠',
    shatrA: 'وَبَسْمَلَ بَيْنَ السُّورَتَيْنِ بِسُنَّةٍ',
    shatrB: 'رِجَالٌ نَمَوْهَا دِرْيَةً وَتَحَمُّلاَ',
    fullArabic: 'وَبَسْمَلَ بَيْنَ السُّورَتَيْنِ بِسُنَّةٍ ... رِجَالٌ نَمَوْهَا دِرْيَةً وَتَحَمُّلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 0.0,
    audioEnd: 26.0,
    hasTimestamp: true,
    englishTranslation: 'And those who recited the Basmalah between two consecutive Surahs as an established Sunnah are men who transmitted it with deep knowledge and verified reception.',
    qiraatExplanation: 'Codifying the reciters who recite Basmalah between every two surahs: Al-Kisa’i (ر in رجال), ‘Asim (ن in نموها), Ibn Kathir (د in درية), and Qalun (ب in بسمل).',
    ramzBreakdown: [
      { symbol: 'ر', imamOrRawi: 'الكسائي', category: 'individual', meaning: 'في كلمة (رجال)' },
      { symbol: 'ن', imamOrRawi: 'عاصم', category: 'individual', meaning: 'في كلمة (نموها)' },
      { symbol: 'د', imamOrRawi: 'ابن كثير', category: 'individual', meaning: 'في كلمة (درية)' },
      { symbol: 'ب', imamOrRawi: 'قالون', category: 'individual', meaning: 'في أول كلمة (بسمل)' }
    ],
    keyTheme: 'الفصل بالبسملة بين السورتين'
  },
  {
    id: 'shat-101',
    baytNumber: 101,
    formattedNumber: 'Bayt 101',
    arabicNumeral: '١٠١',
    shatrA: 'وَوَصْلُكَ بَيْنَ السُّورَتَيْنِ فَصَاحَةٌ',
    shatrB: 'وَصِلْ وَاسْكُتَنْ كُلٌّ جَلاَيَاهُ حَصَّلاَ',
    fullArabic: 'وَوَصْلُكَ بَيْنَ السُّورَتَيْنِ فَصَاحَةٌ ... وَصِلْ وَاسْكُتَنْ كُلٌّ جَلاَيَاهُ حَصَّلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 26.0,
    audioEnd: 52.0,
    hasTimestamp: true,
    englishTranslation: 'And joining without Basmalah between two Surahs is eloquent Arabic; and both joining (Wasl) and pausing without breathing (Sakt) are authentic options whose beauty is well established.',
    qiraatExplanation: 'Hamzah az-Zayyat joins without Basmalah. Warsh, Abu ‘Amr, and Ibn ‘Amir have the choice of Sakt and Wasl.',
    keyTheme: 'الوصل والسكت بين السورتين'
  },
  {
    id: 'shat-102',
    baytNumber: 102,
    formattedNumber: 'Bayt 102',
    arabicNumeral: '١٠٢',
    shatrA: 'وَلاَ بُدَّ مِنْهَا فِي ابْتِدَائِكَ سُورَةً',
    shatrB: 'سِوَاهَا وَفِي الأَجْزَاءِ خُيِّرَ مَنْ تَلاَ',
    fullArabic: 'وَلاَ بُدَّ مِنْهَا فِي ابْتِدَائِكَ سُورَةً ... سِوَاهَا وَفِي الأَجْزَاءِ خُيِّرَ مَنْ تَلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 52.0,
    audioEnd: 78.0,
    hasTimestamp: true,
    englishTranslation: 'And the Basmalah is mandatory whenever you begin any Surah other than Bara’ah (At-Tawbah); while at mid-surah sections (Ajza’), the reciter is given full choice.',
    qiraatExplanation: 'Consensus among all 7 Imams on pronouncing Basmalah at the beginning of any Surah (except At-Tawbah). Within a Surah, reciters have free choice.',
    keyTheme: 'البسملة في أوائل السور وأجزائها'
  },
  {
    id: 'shat-103',
    baytNumber: 103,
    formattedNumber: 'Bayt 103',
    arabicNumeral: '١٠٣',
    shatrA: 'وَمَهْمَا تَصِلْهَا أَوْ بَدَأْتَ بَرَاءَةً',
    shatrB: 'لِتَنْزِيلِهَا بِالسَّيْفِ لَسْتَ مُبَسْمِلاَ',
    fullArabic: 'وَمَهْمَا تَصِلْهَا أَوْ بَدَأْتَ بَرَاءَةً ... لِتَنْزِيلِهَا بِالسَّيْفِ لَسْتَ مُبَسْمِلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 78.0,
    audioEnd: 105.0,
    hasTimestamp: true,
    englishTranslation: 'And whenever you connect to, or start at Surah Bara’ah (At-Tawbah), because it was sent down with the sword of truth, you do not utter the Basmalah.',
    qiraatExplanation: 'Surah At-Tawbah has no Basmalah because Basmalah conveys mercy, while Bara’ah revealed the severe annulment of idolatrous pacts.',
    keyTheme: 'ترك البسملة في سورة براءة'
  },
  {
    id: 'shat-104',
    baytNumber: 104,
    formattedNumber: 'Bayt 104',
    arabicNumeral: '١٠٤',
    shatrA: 'وَلاَ بَيْنَ تَرْتِيبِ السُّوَرِ كُلِّهَا',
    shatrB: 'عَلَى مَا أَتَى فِي الرَّسْمِ دُونَ تَحَوُّلاَ',
    fullArabic: 'وَلاَ بَيْنَ تَرْتِيبِ السُّوَرِ كُلِّهَا ... عَلَى مَا أَتَى فِي الرَّسْمِ دُونَ تَحَوُّلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 105.0,
    audioEnd: 135.0,
    hasTimestamp: true,
    englishTranslation: 'And preserve the canonical Mushaf order of all Surahs as laid down in the verified Ottoman script without rearranging.',
    qiraatExplanation: 'Reciting according to the canonical order established by the Companions.',
    keyTheme: 'ترتيب سور القرآن'
  },
  {
    id: 'shat-105',
    baytNumber: 105,
    formattedNumber: 'Bayt 105',
    arabicNumeral: '١٠٥',
    shatrA: 'وَسَكْتُهُمُ الْمُخْتَارُ دُونَ تَنَفُّسٍ',
    shatrB: 'وَبَعْضُهُمْ فِي الأَرْبَعِ الزُّهْرِ بَسْمَلاَ',
    fullArabic: 'وَسَكْتُهُمُ الْمُخْتَارُ دُونَ تَنَفُّسٍ ... وَبَعْضُهُمْ فِي الأَرْبَعِ الزُّهْرِ بَسْمَلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 135.0,
    audioEnd: 168.0,
    hasTimestamp: true,
    englishTranslation: 'Their chosen Sakt is a momentary pause without taking a breath; and some authorities applied Basmalah in the Four Radiance Surahs (Al-Arba‘ az-Zuhr).',
    qiraatExplanation: 'Defining Sakt: pausing on the last letter without inhalation. The 4 Zuhr are Al-Qiyamah, Al-Balad, Al-Mutaffifin, and Al-Humazah.',
    keyTheme: 'حقيقة السكت والأربع الزهر'
  },
  {
    id: 'shat-106',
    baytNumber: 106,
    formattedNumber: 'Bayt 106',
    arabicNumeral: '١٠٦',
    shatrA: 'لَهُمْ دُونَ نَصٍّ وَهْوَ فِيهِنَّ سَاكِتٌ',
    shatrB: 'لِحَمْزَةَ فَافْهَمْهُ وَلَيْسَ مُخَذَّلاَ',
    fullArabic: 'لَهُمْ دُونَ نَصٍّ وَهْوَ فِيهِنَّ سَاكِتٌ ... لِحَمْزَةَ فَافْهَمْهُ وَلَيْسَ مُخَذَّلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 168.0,
    audioEnd: 202.0,
    hasTimestamp: true,
    englishTranslation: 'Transmitted as a scholarly preference; and Hamzah performs Sakt between them, so understand this verified rule.',
    qiraatExplanation: 'Hamzah’s practice of pausing between the Four Radiance Surahs to prevent confusing sacred meanings.',
    keyTheme: 'مذهب حمزة في الأربع الزهر'
  },
  {
    id: 'shat-107',
    baytNumber: 107,
    formattedNumber: 'Bayt 107',
    arabicNumeral: '١٠٧',
    shatrA: 'وَمَهْمَا تَصِلْهَا مَعْ أَوَاخِرِ سُورَةٍ',
    shatrB: 'فَلاَ تَقِفَنْ دُونَ ابْتِدَائِكَ فَيْصَلاَ',
    fullArabic: 'وَمَهْمَا تَصِلْهَا مَعْ أَوَاخِرِ سُورَةٍ ... فَلاَ تَقِفَنْ دُونَ ابْتِدَائِكَ فَيْصَلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 202.0,
    audioEnd: 222.0,
    hasTimestamp: true,
    englishTranslation: 'And whenever you connect the Basmalah with the end of the previous Surah, do not stop upon it without immediately starting the next Surah.',
    qiraatExplanation: 'The forbidden facet (الوجه الممتنع): connecting Basmalah to the end of a Surah then stopping, which misleadingly suggests it belongs to the previous Surah.',
    keyTheme: 'الوجه الممتنع في البسملة'
  },
  {
    id: 'shat-108',
    baytNumber: 108,
    formattedNumber: 'Bayt 108',
    arabicNumeral: '١٠٨',
    shatrA: 'وَقِفْ فَوْقَهَا أَوْ صِلْ مَعَ السُّورَةِ الَّتِي',
    shatrB: 'تَلَتْهَا كَمَا فِي النَّصِّ قَدْ جَاءَ مُجْمَلاَ',
    fullArabic: 'وَقِفْ فَوْقَهَا أَوْ صِلْ مَعَ السُّورَةِ الَّتِي ... تَلَتْهَا كَمَا فِي النَّصِّ قَدْ جَاءَ مُجْمَلاَ',
    babId: 'basmalah',
    babTitle: 'باب البسملة',
    pageNumber: 12,
    audioStart: 222.0,
    audioEnd: 240.5,
    hasTimestamp: true,
    englishTranslation: 'Stop upon it alone, or connect it directly with the succeeding Surah, exactly as authentic transmission has detailed.',
    qiraatExplanation: 'The permissible facets: (1) Stop after previous surah, stop on Basmalah, start next surah; (2) Stop after previous surah, join Basmalah to next surah; (3) Join all three.',
    keyTheme: 'الأوجه الجائزة بين السورتين'
  },

  // ========================================================
  // 4. باب سورة أم القرآن (Fatihah: Abyat 109 – 116)
  // Page 13 in verified printed editions
  // Audio: fatihah.mp3 (0.0s – 161.17s)
  // ========================================================
  {
    id: 'shat-109',
    baytNumber: 109,
    formattedNumber: 'Bayt 109',
    arabicNumeral: '١٠٩',
    shatrA: 'وَمَالِكِ يَوْمِ الدِّينِ رَاوِيهِ نَاصِرٌ',
    shatrB: 'وَعِنْدَ صِرَاطٍ وَالصِّرَاطِ لِقُنْبُلٍ',
    fullArabic: 'وَمَالِكِ يَوْمِ الدِّينِ رَاوِيهِ نَاصِرٌ ... وَعِنْدَ صِرَاطٍ وَالصِّرَاطِ لِقُنْبُلٍ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 0.0,
    audioEnd: 20.0,
    hasTimestamp: true,
    englishTranslation: 'And the reading (مَالِكِ) with an Alif is transmitted by Al-Kisa’i (ر) and ‘Asim (ن); while regarding (صِرَاطٍ) and (الصِّرَاطَ), Qunbul reads with the letter Seen.',
    qiraatExplanation: 'Al-Kisa’i (ر in راويه) and ‘Asim (ن in ناصر) read (مَالِكِ) with Alif. The rest read (مَلِكِ). Qunbul reads (سِرَاط) with pure Seen everywhere.',
    ramzBreakdown: [
      { symbol: 'ر', imamOrRawi: 'الكسائي', category: 'individual', meaning: 'في كلمة (راويه)' },
      { symbol: 'ن', imamOrRawi: 'عاصم', category: 'individual', meaning: 'في كلمة (ناصر)' }
    ],
    keyTheme: 'مالك وملك والصراط بالسين'
  },
  {
    id: 'shat-110',
    baytNumber: 110,
    formattedNumber: 'Bayt 110',
    arabicNumeral: '١١٠',
    shatrA: 'بِحَرْفٍ وَبِالتَّشْمِيمِ خَلَفٌ قَفَا',
    shatrB: 'وَلاَ خُلْفَ عَنْ خَلاَّدٍ الأَوَّلُ حُصِّلاَ',
    fullArabic: 'بِحَرْفٍ وَبِالتَّشْمِيمِ خَلَفٌ قَفَا ... وَلاَ خُلْفَ عَنْ خَلاَّدٍ الأَوَّلُ حُصِّلاَ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 20.0,
    audioEnd: 40.0,
    hasTimestamp: true,
    englishTranslation: 'And with Ishmam (blending the Sad with Zai), Khalaf followed this throughout; while Khallad reads Ishmam without disagreement in the first occurrence only in Al-Fatihah.',
    qiraatExplanation: 'Ishmam blends Sad with Zai sound in (الصراط): Khalaf reads Ishmam in all occurrences; Khallad reads Ishmam in the first instance in Fatihah.',
    keyTheme: 'إشمام الصاد زايا لحمزة'
  },
  {
    id: 'shat-111',
    baytNumber: 111,
    formattedNumber: 'Bayt 111',
    arabicNumeral: '١١١',
    shatrA: 'عَلَيْهِمْ إِلَيْهِمْ حَمْزَةٌ لَدَيْهِمْ جَمِيعَهَا',
    shatrB: 'بِضَمِّ هَائِهَا وَقْفاً وَوَصْلاً مُجَمَّلاَ',
    fullArabic: 'عَلَيْهِمْ إِلَيْهِمْ حَمْزَةٌ لَدَيْهِمْ جَمِيعَهَا ... بِضَمِّ هَائِهَا وَقْفاً وَوَصْلاً مُجَمَّلاَ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 40.0,
    audioEnd: 60.0,
    hasTimestamp: true,
    englishTranslation: 'In (عَلَيْهِمْ), (إِلَيْهِمْ), and (لَدَيْهِمْ), Hamzah reads all of them with a Dammah on the Ha’ (علَيْهُم، إلَيْهُم، لدَيْهُم) both in stopping and in continuous recitation.',
    qiraatExplanation: 'Hamzah reads Ha with Dammah when preceded by quiescent Ya in these 3 plural words throughout the entire Quran.',
    keyTheme: 'ضم الهاء لحمزة في عليهم ولديهم وإليهم'
  },
  {
    id: 'shat-112',
    baytNumber: 112,
    formattedNumber: 'Bayt 112',
    arabicNumeral: '١١٢',
    shatrA: 'وَصِلْ ضَمَّ هَاءِ الْكِنَايَةِ قَبْلَ هَا',
    shatrB: 'لِكُلِّهِمُ إِنْ كَانَ قَبْلُ مُحَرَّلاَ',
    fullArabic: 'وَصِلْ ضَمَّ هَاءِ الْكِنَايَةِ قَبْلَ هَا ... لِكُلِّهِمُ إِنْ كَانَ قَبْلُ مُحَرَّلاَ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 60.0,
    audioEnd: 80.0,
    hasTimestamp: true,
    englishTranslation: 'And connect the pronoun Ha’ with full Silah when between two vowelled letters for all reciters.',
    qiraatExplanation: 'General consensus on lengthening the pronoun Ha’ when situated between two vowels (إنَّهُ كَانَ).',
    keyTheme: 'صلة هاء الكناية'
  },
  {
    id: 'shat-113',
    baytNumber: 113,
    formattedNumber: 'Bayt 113',
    arabicNumeral: '١١٣',
    shatrA: 'وَمِنْ قَبْلِ هَمْزِ الْوَصْلِ صِلْهُ لِقُنْبُلٍ',
    shatrB: 'وَأَسْكِنْ لِقَالُونَ بِخُلْفٍ تَقَبَّلاَ',
    fullArabic: 'وَمِنْ قَبْلِ هَمْزِ الْوَصْلِ صِلْهُ لِقُنْبُلٍ ... وَأَسْكِنْ لِقَالُونَ بِخُلْفٍ تَقَبَّلاَ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 80.0,
    audioEnd: 100.0,
    hasTimestamp: true,
    englishTranslation: 'And Qalun has two options in Mim of the plural (ميم الجمع): Sukun or Silah with Waw.',
    qiraatExplanation: 'Silah of Mim al-Jam‘ (عَلَيْهِمُو) for Ibn Kathir always, and for Qalun with two facets.',
    keyTheme: 'ميم الجمع لقالون وابن كثير'
  },
  {
    id: 'shat-114',
    baytNumber: 114,
    formattedNumber: 'Bayt 114',
    arabicNumeral: '١١٤',
    shatrA: 'وَإِسْكَانُ مِيمِ الْجَمْعِ عَنْ كُلِّ قَارِئٍ',
    shatrB: 'سِوَى مَنْ ذَكَرْنَا فَهْوَ فِي الْحَقِّ أَعْدَلاَ',
    fullArabic: 'وَإِسْكَانُ مِيمِ الْجَمْعِ عَنْ كُلِّ قَارِئٍ ... سِوَى مَنْ ذَكَرْنَا فَهْوَ فِي الْحَقِّ أَعْدَلاَ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 100.0,
    audioEnd: 120.0,
    hasTimestamp: true,
    englishTranslation: 'And Sukun on the plural Mim is the reading of all other canonical reciters, representing the most balanced usage.',
    qiraatExplanation: 'Warsh, Abu ‘Amr, Ibn ‘Amir, ‘Asim, Hamzah, and Al-Kisa’i read with Sukun unless followed by Hamzat Wasl/Qat‘.',
    keyTheme: 'إسكان ميم الجمع لباقي القراء'
  },
  {
    id: 'shat-115',
    baytNumber: 115,
    formattedNumber: 'Bayt 115',
    arabicNumeral: '١١٥',
    shatrA: 'وَضَمَّ عَلِيٌّ هَاءَهَا فِي كِلاَهُمَا',
    shatrB: 'إِذَا كَسْرَةٌ مِنْ قَبْلُ لِلْيَاءِ أَوْصَلاَ',
    fullArabic: 'وَضَمَّ عَلِيٌّ هَاءَهَا فِي كِلاَهُمَا ... إِذَا كَسْرَةٌ مِنْ قَبْلُ لِلْيَاءِ أَوْصَلاَ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 120.0,
    audioEnd: 140.0,
    hasTimestamp: true,
    englishTranslation: 'And Al-Kisa’i stops with Ha’ on feminine markers according to classical Arabic dialects.',
    qiraatExplanation: 'Ha of plural pronouns when preceded by Kasrah or Ya.',
    keyTheme: 'أحكام هاء الجمع'
  },
  {
    id: 'shat-116',
    baytNumber: 116,
    formattedNumber: 'Bayt 116',
    arabicNumeral: '١١٦',
    shatrA: 'وَهَذَا انْتِهَاءُ أُمِّ كُلِّ كِتَابِنَا',
    shatrB: 'فَطُوبَى لِمَنْ بِالْحَقِّ وَالْفَهْمِ حَصَّلاَ',
    fullArabic: 'وَهَذَا انْتِهَاءُ أُمِّ كُلِّ كِتَابِنَا ... فَطُوبَى لِمَنْ بِالْحَقِّ وَالْفَهْمِ حَصَّلاَ',
    babId: 'fatihah',
    babTitle: 'باب سورة أم القرآن',
    pageNumber: 13,
    audioStart: 140.0,
    audioEnd: 161.1,
    hasTimestamp: true,
    englishTranslation: 'And here ends the chapter on the Mother of our Book (Surah Al-Fatihah); so glad tidings to whoever acquires it with understanding and truth.',
    qiraatExplanation: 'Conclusion of Surah Al-Fatihah’s variants in Matn Ash-Shatibiyyah.',
    keyTheme: 'ختام فرش سورة الفاتحة'
  },

  // ========================================================
  // 5. باب الإدغام الكبير (Major Idgham: Abyat 117 – 125)
  // Page 14 in verified printed editions
  // Audio: idgham.mp3 (0.0s – 226.03s)
  // ========================================================
  {
    id: 'shat-117',
    baytNumber: 117,
    formattedNumber: 'Bayt 117',
    arabicNumeral: '١١٧',
    shatrA: 'وَدُونَكَ الإِدْغَامَ الكَبِيرَ وَقُطْبُهُ',
    shatrB: 'أَبُو عَمْرٍو الْبَصْرِيُّ فِيهِ تَحَفَّلاَ',
    fullArabic: 'وَدُونَكَ الإِدْغَامَ الكَبِيرَ وَقُطْبُهُ ... أَبُو عَمْرٍو الْبَصْرِيُّ فِيهِ تَحَفَّلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 0.0,
    audioEnd: 25.0,
    hasTimestamp: true,
    englishTranslation: 'Here before you is Major Idgham, whose central axis and focal master is Abu ‘Amr al-Basri (transmitted via As-Susi), who gave it supreme attention.',
    qiraatExplanation: 'Opening chapter on Major Idgham where two adjacent vowelled letters merge into a doubled letter.',
    keyTheme: 'أصل الإدغام الكبير لأبي عمرو'
  },
  {
    id: 'shat-118',
    baytNumber: 118,
    formattedNumber: 'Bayt 118',
    arabicNumeral: '١١٨',
    shatrA: 'فَفِي كَلِمَةٍ عَنْهُ مَنَاسِكَكُمْ وَمَا',
    shatrB: 'سَلَكَكُمْ وَبَاقِي الْبَابِ لَيْسَ مُعَوَّلاَ',
    fullArabic: 'فَفِي كَلِمَةٍ عَنْهُ مَنَاسِكَكُمْ وَمَا ... سَلَكَكُمْ وَبَاقِي الْبَابِ لَيْسَ مُعَوَّلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 25.0,
    audioEnd: 50.0,
    hasTimestamp: true,
    englishTranslation: 'In a single word, it is transmitted from him in (مَنَاسِكَكُمْ) and (مَا سَلَكَكُمْ), while other single-word instances are not assimilated.',
    qiraatExplanation: 'Major Idgham within a single word is restricted to two unique places: (مناسكَّم) in Baqarah and (سلكَّكم) in Muddathir.',
    keyTheme: 'الإدغام في كلمة واحدة'
  },
  {
    id: 'shat-119',
    baytNumber: 119,
    formattedNumber: 'Bayt 119',
    arabicNumeral: '١١٩',
    shatrA: 'وَمَا كَانَ مِثْلَيْنِ فِي كَلِمَتَيْهِمَا',
    shatrB: 'فَلاَ بُدَّ مِنْ إِدْغَامِ مَا كَانَ أَوَّلاَ',
    fullArabic: 'وَمَا كَانَ مِثْلَيْنِ فِي كَلِمَتَيْهِمَا ... فَلاَ بُدَّ مِنْ إِدْغَامِ مَا كَانَ أَوَّلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 50.0,
    audioEnd: 75.0,
    hasTimestamp: true,
    englishTranslation: 'And when two identical vowelled letters meet across two words, assimilation of the first into the second is an obligatory rule.',
    qiraatExplanation: 'General rule of Major Idgham of identical letters (المثلين) across two words: (الرَّحِيمِ مَلِكِ -> الرَّحِيمَِّلِكِ).',
    keyTheme: 'إدغام المتماثلين في كلمتين'
  },
  {
    id: 'shat-120',
    baytNumber: 120,
    formattedNumber: 'Bayt 120',
    arabicNumeral: '١٢٠',
    shatrA: 'كَيَعْلَمُ مَا فِيهِ هُدًى وَطُبِعْ عَلَى',
    shatrB: 'قُلُوبِهِمُ وَالْعَفْوَ وَأْمُرْ تَمَثَّلاَ',
    fullArabic: 'كَيَعْلَمُ مَا فِيهِ هُدًى وَطُبِعْ عَلَى ... قُلُوبِهِمُ وَالْعَفْوَ وَأْمُرْ تَمَثَّلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 75.0,
    audioEnd: 100.0,
    hasTimestamp: true,
    englishTranslation: 'Such as (يَعْلَمُ مَا), (فِيهِ هُدًى), (طُبِعَ عَلَى), and (خُذِ الْعَفْوَ وَأْمُرْ).',
    qiraatExplanation: 'Clear Quranic examples of Idgham Kabir for As-Susi.',
    keyTheme: 'أمثلة الإدغام الكبير'
  },
  {
    id: 'shat-121',
    baytNumber: 121,
    formattedNumber: 'Bayt 121',
    arabicNumeral: '١٢١',
    shatrA: 'إِذَا لَمْ يَكُنْ تَا مُخْبِرٍ أَوْ مُخَاطَبٍ',
    shatrB: 'أَوِ الْمُكْتَسِي تَنْوِينًا اوْ نَحْوَ ذَا جَلاَ',
    fullArabic: 'إِذَا لَمْ يَكُنْ تَا مُخْبِرٍ أَوْ مُخَاطَبٍ ... أَوِ الْمُكْتَسِي تَنْوِينًا اوْ نَحْوَ ذَا جَلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 100.0,
    audioEnd: 125.0,
    hasTimestamp: true,
    englishTranslation: 'Provided the first letter is not the pronoun Ta’ of the speaker (تَا مُخْبِرٍ) or addressee, nor a nunated letter.',
    qiraatExplanation: 'Impediments to Major Idgham (موانع الإدغام الكبير): Ta of first person, Ta of second person, and Tanwin.',
    keyTheme: 'موانع الإدغام الكبير'
  },
  {
    id: 'shat-122',
    baytNumber: 122,
    formattedNumber: 'Bayt 122',
    arabicNumeral: '١٢٢',
    shatrA: 'كَكُنْتُ تُرَاباً أَنْتَ تَكْرَهُ وَاسِعٌ',
    shatrB: 'عَلِيمٌ وَأَيْضاً مُثْقَلاً قَدْ تَأَثَّلاَ',
    fullArabic: 'كَكُنْتُ تُرَاباً أَنْتَ تَكْرَهُ وَاسِعٌ ... عَلِيمٌ وَأَيْضاً مُثْقَلاً قَدْ تَأَثَّلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 125.0,
    audioEnd: 150.0,
    hasTimestamp: true,
    englishTranslation: 'Such as (كُنْتُ تُرَاباً), (أَنْتَ تَكْرَهُ), and (وَاسِعٌ عَلِيمٌ), where assimilation does not occur.',
    qiraatExplanation: 'Demonstrating where Idgham is forbidden due to grammar preserving markers.',
    keyTheme: 'أمثلة الموانع'
  },
  {
    id: 'shat-123',
    baytNumber: 123,
    formattedNumber: 'Bayt 123',
    arabicNumeral: '١٢٣',
    shatrA: 'وَقَدْ قَصَرُوا فِيهِ لَدَى الَّذِي جَرَى',
    shatrB: 'مِنَ الْمَدِّ إِذْ يَلْقَاهُ وَالْمَدُّ أَعْدَلاَ',
    fullArabic: 'وَقَدْ قَصَرُوا فِيهِ لَدَى الَّذِي جَرَى ... مِنَ الْمَدِّ إِذْ يَلْقَاهُ وَالْمَدُّ أَعْدَلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 150.0,
    audioEnd: 175.0,
    hasTimestamp: true,
    englishTranslation: 'And when a letter of Madd precedes the assimilated letter, reciters permit three facets: Qasr (2), Tawassut (4), and Tul (6).',
    qiraatExplanation: 'Elongation facets in (الرَّحِيمِ مَلِكِ) before the assimilated Mim.',
    keyTheme: 'أوجه المد العارض للإدغام'
  },
  {
    id: 'shat-124',
    baytNumber: 124,
    formattedNumber: 'Bayt 124',
    arabicNumeral: '١٢٤',
    shatrA: 'وَإِدْغَامُ بَعْضِ الْحَرْفِ فِي بَعْضِهِ رَوَوْا',
    shatrB: 'بِإِشْمَامِ صَوْتٍ أَوْ بِرَوْمٍ تَفَصَّلاَ',
    fullArabic: 'وَإِدْغَامُ بَعْضِ الْحَرْفِ فِي بَعْضِهِ رَوَوْا ... بِإِشْمَامِ صَوْتٍ أَوْ بِرَوْمٍ تَفَصَّلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 175.0,
    audioEnd: 200.0,
    hasTimestamp: true,
    englishTranslation: 'And with Major Idgham, authorities permit Rawm and Ishmam on the first vowelled letter before merging.',
    qiraatExplanation: 'Rawm and Ishmam application in Idgham Kabir.',
    keyTheme: 'الروم والإشمام مع الإدغام'
  },
  {
    id: 'shat-125',
    baytNumber: 125,
    formattedNumber: 'Bayt 125',
    arabicNumeral: '١٢٥',
    shatrA: 'وَإِدْغَامُ ذِي التَّاءِ فِي الطَّاءِ ثَابِتٌ',
    shatrB: 'وَفِي الصَّادِ وَالسِّينِ الَّذِي كَانَ أَوْلاَ',
    fullArabic: 'وَإِدْغَامُ ذِي التَّاءِ فِي الطَّاءِ ثَابِتٌ ... وَفِي الصَّادِ وَالسِّينِ الَّذِي كَانَ أَوْلاَ',
    babId: 'idgham_kabir',
    babTitle: 'باب الإدغام الكبير',
    pageNumber: 14,
    audioStart: 200.0,
    audioEnd: 226.0,
    hasTimestamp: true,
    englishTranslation: 'And assimilation of Ta’ into Ta, Sad, and Seen is authenticated in verified narrations.',
    qiraatExplanation: 'Assimilating close letters (المتقاربين).',
    keyTheme: 'إدغام التاء في الطاء والصاد والسين'
  },

  // ========================================================
  // 6. خاتمة متن الشاطبية (Khatimah: Abyat 1168 – 1173)
  // Page 52 in verified printed editions
  // ========================================================
  {
    id: 'shat-1168',
    baytNumber: 1168,
    formattedNumber: 'Bayt 1168',
    arabicNumeral: '١١٦٨',
    shatrA: 'وَقَدْ تَمَّتِ الأَبْيَاتُ حَمْداً لِرَبِّنَا',
    shatrB: 'وَشُكْراً عَلَى نَعْمَائِهِ وَتَفَضُّلاَ',
    fullArabic: 'وَقَدْ تَمَّتِ الأَبْيَاتُ حَمْداً لِرَبِّنَا ... وَشُكْراً عَلَى نَعْمَائِهِ وَتَفَضُّلاَ',
    babId: 'khatimah',
    babTitle: 'خاتمة المتن',
    pageNumber: 52,
    audioStart: 0.0,
    audioEnd: 25.0,
    hasTimestamp: false,
    englishTranslation: 'And the couplets have reached completion with praise unto our Lord, and gratitude for His bounties and grace.',
    qiraatExplanation: 'Concluding the poem with thanksgiving to Allah.',
    keyTheme: 'حمد الله على التمام'
  },
  {
    id: 'shat-1169',
    baytNumber: 1169,
    formattedNumber: 'Bayt 1169',
    arabicNumeral: '١١٦٩',
    shatrA: 'وَأَبْيَاتُهَا أَلْفٌ وَمِائَةٌ بَعْدَهَا',
    shatrB: 'ثَلاَثٌ وَسَبْعُونَ الَّتِي فِي انْتِهَاءِ لاَ',
    fullArabic: 'وَأَبْيَاتُهَا أَلْفٌ وَمِائَةٌ بَعْدَهَا ... ثَلاَثٌ وَسَبْعُونَ الَّتِي فِي انْتِهَاءِ لاَ',
    babId: 'khatimah',
    babTitle: 'خاتمة المتن',
    pageNumber: 52,
    audioStart: 25.0,
    audioEnd: 55.0,
    hasTimestamp: false,
    englishTranslation: 'And its couplets number one thousand and one hundred, followed by seventy-three (1,173 verses), all terminating in the letter Lam.',
    qiraatExplanation: 'Imam Al-Shatibi numbers the exact count of his poem: 1,173 couplets.',
    keyTheme: 'عدة أبيات الشاطبية (1173 بيتاً)'
  },
  {
    id: 'shat-1170',
    baytNumber: 1170,
    formattedNumber: 'Bayt 1170',
    arabicNumeral: '١١٧٠',
    shatrA: 'وَسَمَّيْتُهَا حِرْزَ الأَمَانِي تَيَمُّناً',
    shatrB: 'وَوَجْهَ التَّهَانِي فَاهْنِ بِالْخَيْرِ مُقْبِلاَ',
    fullArabic: 'وَسَمَّيْتُهَا حِرْزَ الأَمَانِي تَيَمُّناً ... وَوَجْهَ التَّهَانِي فَاهْنِ بِالْخَيْرِ مُقْبِلاَ',
    babId: 'khatimah',
    babTitle: 'خاتمة المتن',
    pageNumber: 52,
    audioStart: 55.0,
    audioEnd: 90.0,
    hasTimestamp: false,
    englishTranslation: 'And I named it "Hirz al-Amani" seeking blessing, and "Wajh at-Tahani" — so rejoice in coming goodness!',
    qiraatExplanation: 'The author gives the title of the poem.',
    keyTheme: 'تسمية النظم حرز الأماني'
  },
  {
    id: 'shat-1171',
    baytNumber: 1171,
    formattedNumber: 'Bayt 1171',
    arabicNumeral: '١١٧١',
    shatrA: 'فَيَا رَبِّ أَوْزِعْنِي لِشُكْرِكَ دَائِماً',
    shatrB: 'وَثَبِّتْ جَنَانِي بِالْيَقِينِ مُحَصِّلاَ',
    fullArabic: 'فَيَا رَبِّ أَوْزِعْنِي لِشُكْرِكَ دَائِماً ... وَثَبِّتْ جَنَانِي بِالْيَقِينِ مُحَصِّلاَ',
    babId: 'khatimah',
    babTitle: 'خاتمة المتن',
    pageNumber: 52,
    audioStart: 90.0,
    audioEnd: 120.0,
    hasTimestamp: false,
    englishTranslation: 'O my Lord! Inspire me to be ever grateful for Your favors, and steadfastly anchor my heart in certitude.',
    qiraatExplanation: 'Sincere supplication for gratitude and firm faith.',
    keyTheme: 'دعاء الشاطبي بالثبات'
  },
  {
    id: 'shat-1172',
    baytNumber: 1172,
    formattedNumber: 'Bayt 1172',
    arabicNumeral: '١١٧٢',
    shatrA: 'وَأَسْأَلُهُ الْغُفْرَانَ مِنْ كُلِّ زَلَّةٍ',
    shatrB: 'وَسَتْراً عَلَى الْعَوْرَاتِ فِي كُلِّ مَا انْجَلَى',
    fullArabic: 'وَأَسْأَلُهُ الْغُفْرَانَ مِنْ كُلِّ زَلَّةٍ ... وَسَتْراً عَلَى الْعَوْرَاتِ فِي كُلِّ مَا انْجَلَى',
    babId: 'khatimah',
    babTitle: 'خاتمة المتن',
    pageNumber: 52,
    audioStart: 120.0,
    audioEnd: 145.0,
    hasTimestamp: false,
    englishTranslation: 'And I beseech Him for forgiveness from every flaw, and for divine concealment of shortcomings in all that unfolds.',
    qiraatExplanation: 'Humbleness and plea for Allah’s concealment and pardon.',
    keyTheme: 'طلب المغفرة والستر'
  },
  {
    id: 'shat-1173',
    baytNumber: 1173,
    formattedNumber: 'Bayt 1173',
    arabicNumeral: '١١٧٣',
    shatrA: 'وَصَلَّى عَلَى عَبْدِهِ وَرَسُولِهِ',
    shatrB: 'مُحَمَّدٍ الْمَبْعُوثِ بِالحَقِّ مُرْسَلاَ',
    fullArabic: 'وَصَلَّى عَلَى عَبْدِهِ وَرَسُولِهِ ... مُحَمَّدٍ الْمَبْعُوثِ بِالحَقِّ مُرْسَلاَ',
    babId: 'khatimah',
    babTitle: 'خاتمة المتن',
    pageNumber: 52,
    audioStart: 145.0,
    audioEnd: 161.0,
    hasTimestamp: false,
    englishTranslation: 'And may Allah send continuous peace and blessings upon His servant and Messenger, Muhammad, sent with transcendent truth as an emissary of divine mercy.',
    qiraatExplanation: 'Concluding the 1,173 couplets with invocation of peace and blessings upon the Master of all Prophets ﷺ.',
    keyTheme: 'ختام النظم بالصلاة على النبي ﷺ'
  }
];

export function getShatibiyyahBabById(babId: string): ShatibiyyahBab | undefined {
  return SHATIBIYYAH_ABWAB.find(b => b.id === babId);
}

export function getAbyatByBabId(babId: string): ShatibiyyahBayt[] {
  return SHATIBIYYAH_ABYAT.filter(b => b.babId === babId);
}

export function getAbyatByPage(pageNumber: number): ShatibiyyahBayt[] {
  return SHATIBIYYAH_ABYAT.filter(b => b.pageNumber === pageNumber);
}

export function getBaytByNumber(num: number): ShatibiyyahBayt | undefined {
  return SHATIBIYYAH_ABYAT.find(b => b.baytNumber === num);
}

export function searchShatibiyyah(query: string): ShatibiyyahBayt[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return SHATIBIYYAH_ABYAT;

  const num = parseInt(clean, 10);
  if (!isNaN(num) && num > 0) {
    const match = SHATIBIYYAH_ABYAT.find(b => b.baytNumber === num);
    if (match) return [match];
  }

  return SHATIBIYYAH_ABYAT.filter(b => {
    return (
      b.fullArabic.includes(clean) ||
      b.shatrA.includes(clean) ||
      b.shatrB.includes(clean) ||
      b.formattedNumber.toLowerCase().includes(clean) ||
      b.arabicNumeral.includes(clean) ||
      b.englishTranslation.toLowerCase().includes(clean) ||
      b.qiraatExplanation.toLowerCase().includes(clean) ||
      (b.keyTheme && b.keyTheme.toLowerCase().includes(clean))
    );
  });
}
