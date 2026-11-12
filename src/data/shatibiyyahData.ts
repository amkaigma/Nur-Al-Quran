/**
 * Matn Ash-Shatibiyyah (حرز الأماني ووجه التهاني في القراءات السبع)
 * Author: Imam Abu Muhammad Al-Qasim ibn Firruh ibn Khalaf Al-Shatibi (538–590 AH)
 * Audio Reciter: Sheikh Okasha Kameny (الشيخ عكاشة كميني)
 */

export interface ShatibiyyahRamz {
  symbol: string;
  imamOrRawi: string;
  category: 'individual' | 'group' | 'rule';
  meaning: string;
}

export interface ShatibiyyahBayt {
  id: string;
  babId: string;
  baytNumber: number;
  shatrA: string; // صدر البيت (First hemistich)
  shatrB: string; // عجز البيت (Second hemistich)
  fullArabic: string;
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
  authorBio: 'One of the greatest Andalusian scholars of Quranic readings, Hadith, and Arabic linguistics. Born in Xàtiva (شاطبة), Spain, he later taught at the Fadiliyyah Madrasah in Cairo. Despite being blind, he possessed an extraordinary memory and compiled this 1,173-verse poem which became the universal bedrock for studying the Seven Canonical Qira’at.',
  reciter: 'Sheikh Okasha Hassan Kameny',
  reciterArabic: 'الشيخ عكاشة بن حسن كَمِينِي',
  reciterBio: 'Internationally celebrated Quranic scholar, reciter, and specialist in the Ten Canonical Qira’at and their foundational poetic mutun (Ash-Shatibiyyah, Ad-Durrah, and Tayyibat an-Nashr). Renowned for his distinct, emotive, and rhythmically precise recitation of classical didactic poetry and rare Quranic narrations.',
  metre: 'Bahr at-Taweel (بحر الطويل: فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِلُنْ)',
  rhyme: 'Lamiyah (القافية اللامية — every couplet terminates in the letter Lam)',
  totalAbyat: 1173,
  description: 'The monumental didactic rhymed poem condensing Abu ‘Amr Ad-Dani’s classic treatise "At-Taysir fi al-Qira’at as-Sab’". It establishes an ingenious cryptographic cipher of letters and codewords representing the 7 Imams and their 14 transmitters.',
  significance: 'Memorized by thousands of Huffadh and scholars across nine centuries, Ash-Shatibiyyah is the supreme authoritative textbook for the Minor Seven Readings (Al-Qira’at As-Sughra). Whoever masters Ash-Shatibiyyah earns the key to the authentic variant readings of the Noble Quran.',
  audioSource: 'Al-Hirz Institute & Sheikh Okasha Kameny Studio Recordings'
};

export const SHATIBIYYAH_ABWAB: ShatibiyyahBab[] = [
  {
    id: 'muqaddimah',
    number: 1,
    titleArabic: 'مُقَدِّمَةُ القَصِيدَةِ وَأَسْمَاءُ القُرَّاءِ وَرُمُوزُهُمْ',
    titleEnglish: 'Introduction, The Seven Imams, & Their Cryptographic Symbols',
    baytRange: { start: 1, end: 94 },
    versesCount: 94,
    summary: 'Opening praising Allah and His Messenger ﷺ, the high station of the Quran bearer, introduction of the 7 Imams (Nafi\', Ibn Kathir, Abu \'Amr, Ibn \'Amir, \'Asim, Hamzah, Al-Kisa\'i) and their 14 Ruwat, followed by the definitive rules of the cipher system (أبج دهز حطي كلمن...).',
    summaryArabic: 'افتتاح المنظومة بالحمد والصلاة، وبيان فضل أهل القرآن، والتعريف بالقراء السبعة وأئمتهم الرواة الأربعة عشر، وبيان طريقة الرموز الحرفية والكلمية.',
    audioTrack: {
      title: 'المقدمة وأسماء القراء ورموزهم',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '11:45',
      durationSeconds: 705,
      audioUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      downloadUrl: '/audio/shatibiyyah/muqaddimah.mp3'
    }
  },
  {
    id: 'istiadhah',
    number: 2,
    titleArabic: 'بَابُ الاِسْتِعَاذَةِ',
    titleEnglish: 'Chapter on Seeking Refuge (Al-Isti’adhah)',
    baytRange: { start: 95, end: 99 },
    versesCount: 5,
    summary: 'Rulings on pronouncing Isti’adhah aloud versus silently, the chosen prophetic phrasing (أعوذ بالله من الشيطان الرجيم), and reciting it at the start or mid-surah.',
    summaryArabic: 'أحكام الجهر بالتعوذ والإسرار به، واختيار لفظ القرآن المجيد، ومواضع الاستعاذة عند التلاوة.',
    audioTrack: {
      title: 'باب الاستعاذة',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '02:18',
      durationSeconds: 138,
      audioUrl: '/audio/shatibiyyah/istiadhah.mp3',
      downloadUrl: '/audio/shatibiyyah/istiadhah.mp3'
    }
  },
  {
    id: 'basmalah',
    number: 3,
    titleArabic: 'بَابُ البَسْمَلَةِ',
    titleEnglish: 'Chapter on the Basmalah between Two Surahs',
    baytRange: { start: 100, end: 108 },
    versesCount: 9,
    summary: 'Rulings on reciting the Basmalah between two consecutive Surahs: those who separate with Basmalah (Ibn Kathir, \'Asim, Al-Kisa\'i, Qalun), Sakt and Wasl (Warsh, Abu \'Amr, Ibn \'Amir), Hamzah\'s wasl without Basmalah, and the exception of Surah Bara’ah (At-Tawbah).',
    summaryArabic: 'أحكام البسملة بين السورتين: الفصل بالبسملة لأهل سما وعاصم والكسائي، وخلف ورش وأبي عمرو وابن عامر بين السكت والوصل، ومذهب حمزة بالوصل بلا بسملة، وحكم سورة براءة.',
    audioTrack: {
      title: 'باب البسملة',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '03:12',
      durationSeconds: 192,
      audioUrl: '/audio/shatibiyyah/basmalah.mp3',
      downloadUrl: '/audio/shatibiyyah/basmalah.mp3'
    }
  },
  {
    id: 'fatihah',
    number: 4,
    titleArabic: 'بَابُ سُورَةِ أُمِّ القُرْآنِ',
    titleEnglish: 'Chapter on Surah Umm al-Quran (Al-Fatihah)',
    baytRange: { start: 109, end: 116 },
    versesCount: 8,
    summary: 'Readings of مالك vs مَلِك (Ibn Kathir, Abu \'Amr, Nafi\', Ibn \'Amir read Malik without Alif; Asim and Al-Kisa\'i read Malik with Alif), As-Sirat with Sad, Sin (Qunbul) or Ishmam (Khalaf), and Ha’ of Alayhim/Ilayhim with Dammah (Hamzah).',
    summaryArabic: 'فرش سورة الفاتحة: الخلاف في (مالك) و(ملك)، وقراءة الصراط بالصاد والسين والإشمام، وضم هاء (عليهم) لحمزة.',
    audioTrack: {
      title: 'باب سورة أم القرآن',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '03:40',
      durationSeconds: 220,
      audioUrl: '/audio/shatibiyyah/fatihah.mp3',
      downloadUrl: '/audio/shatibiyyah/fatihah.mp3'
    }
  },
  {
    id: 'idgham_kabir',
    number: 5,
    titleArabic: 'بَابُ الإِدْغَامِ الكَبِيرِ',
    titleEnglish: 'Chapter on Major Assimilation (Al-Idgham al-Kabir)',
    baytRange: { start: 117, end: 134 },
    versesCount: 18,
    summary: 'The signature chapter of Abu ‘Amr al-Basri through his rawi As-Susi: assimilating two adjacent vowelled letters (Al-Mithlayn, Al-Mutaqaribayn, Al-Mutajanisayn) across one or two words, conditions, and exceptions.',
    summaryArabic: 'انفراد السوسي عن أبي عمرو بإدغام الحرفين المتحركين إذا التقيا لفظاً: المتماثلين، والمتجانسين، والمتقاربين، مع بيان موانع الإدغام واستثناءاته.',
    audioTrack: {
      title: 'باب الإدغام الكبير',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '06:15',
      durationSeconds: 375,
      audioUrl: '/audio/shatibiyyah/idgham.mp3',
      downloadUrl: '/audio/shatibiyyah/idgham.mp3'
    }
  },
  {
    id: 'ha_kinayah',
    number: 6,
    titleArabic: 'بَابُ هَاءِ الكِنَايَةِ',
    titleEnglish: 'Chapter on the Pronoun Ha’ (Ha’ al-Kinayah)',
    baytRange: { start: 159, end: 167 },
    versesCount: 9,
    summary: 'Rules governing the 3rd person masculine pronoun Ha’ (Silah lengthening vs Qasr shortening) when preceded by quiescent or vowelled letters in words like (يُؤَدِّهِ إِلَيْكَ، نُوَلِّهِ، نُصْلِهِ، أَرْجِهْ، يَتَّقْهِ...).',
    summaryArabic: 'أحكام صلة هاء الضمير وقصرها واختلاسها وسكونها في الكلمات القرآنية المخصوصة كـ (يؤده، نوله، نصله، أرجه، فالقه).',
    audioTrack: {
      title: 'باب هاء الكناية',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '04:10',
      durationSeconds: 250,
      audioUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      downloadUrl: '/audio/shatibiyyah/muqaddimah.mp3'
    }
  },
  {
    id: 'madd_qasr',
    number: 7,
    titleArabic: 'بَابُ المَدِّ وَالقَصْرِ',
    titleEnglish: 'Chapter on Madd (Elongation) and Qasr (Shortening)',
    baytRange: { start: 168, end: 180 },
    versesCount: 13,
    summary: 'Degrees of madd for Muttasil (connected) and Munfasil (disconnected): Tul (6 counts) for Warsh and Hamzah, Tawassut (4 counts) for \'Asim and Ibn \'Amir, and Qasr (2 counts) for Ibn Kathir and As-Susi. Also covers Madd Badal (3 options for Warsh) and Madd Leen.',
    summaryArabic: 'مراتب المد المتصل والمنفصل: طول لورش وحمزة، وتوسط لعاصم وابن عامر والكسائي، وقصر لابن كثير والسوسي، ومذاهب ورش في البدل واللين المهموز.',
    audioTrack: {
      title: 'باب المد والقصر',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '05:22',
      durationSeconds: 322,
      audioUrl: '/audio/shatibiyyah/basmalah.mp3',
      downloadUrl: '/audio/shatibiyyah/basmalah.mp3'
    }
  },
  {
    id: 'hamzatayn_kalimah',
    number: 8,
    titleArabic: 'بَابُ الهَمْزَتَيْنِ مِنْ كَلِمَةٍ',
    titleEnglish: 'Chapter on Two Adjacent Hamzahs in a Single Word',
    baytRange: { start: 181, end: 201 },
    versesCount: 21,
    summary: 'When two hamzahs meet in one word (أَأَنذَرْتَهُمْ، أَئِنَّكُمْ، أَؤُنَبِّئُكُمْ): Tashil (easing), Ibdaal (substituting into a long vowel), and Idkhal (inserting an Alif of separation) for Qalun, Abu \'Amr, and Hisham.',
    summaryArabic: 'حكم الهمزتين المفتوحتين أو المختلفتين في كلمة واحدة: التسهيل، والإبدال، والإدخال بألف بينهما لقراء الحجاز والشام والبصرة.',
    audioTrack: {
      title: 'باب الهمزتين من كلمة',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '07:18',
      durationSeconds: 438,
      audioUrl: '/audio/shatibiyyah/idgham.mp3',
      downloadUrl: '/audio/shatibiyyah/idgham.mp3'
    }
  },
  {
    id: 'hamzatayn_kalimatayn',
    number: 9,
    titleArabic: 'بَابُ الهَمْزَتَيْنِ مِنْ كَلِمَتَيْنِ',
    titleEnglish: 'Chapter on Two Adjacent Hamzahs across Two Words',
    baytRange: { start: 202, end: 215 },
    versesCount: 14,
    summary: 'When two hamzahs meet across word boundaries (جَاءَ أَجَلُهُمْ، هَؤُلاءِ إِنْ، أَوْلِيَاءُ أُولَئِكَ): dropping the first hamzah (Abu \'Amr and Qalun), Tashil and Ibdaal of the second hamzah (Warsh and Ibn Kathir).',
    summaryArabic: 'اجتماع همزتين متفقتين أو مختلفتين في كلمتين: إسقاط الأولى لأبي عمرو وقالون، وتسهيل أو إبدال الثانية لورش وابن كثير.',
    audioTrack: {
      title: 'باب الهمزتين من كلمتين',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '05:45',
      durationSeconds: 345,
      audioUrl: '/audio/shatibiyyah/fatihah.mp3',
      downloadUrl: '/audio/shatibiyyah/fatihah.mp3'
    }
  },
  {
    id: 'imalah',
    number: 10,
    titleArabic: 'بَابُ الإِمَالَةِ وَالتَّقْلِيلِ',
    titleEnglish: 'Chapter on Al-Imalah (Major Deflection) & At-Taqlil',
    baytRange: { start: 292, end: 330 },
    versesCount: 39,
    summary: 'Comprehensive rules on tilting the Fathah towards Kasrah and Alif towards Ya’: Imalah Kubra for Hamzah, Al-Kisa’i, and Abu ‘Amr; Imalah Sughra (Taqlil / Bayna-Bayna) for Warsh on Dhowat al-Ya (الْهُدَى، مُوسَى، عِيسَى) and Ru’us al-Ayat.',
    summaryArabic: 'أصول الإمالة الكبرى والصغرى (التقليل): مذهب حمزة والكسائي وخلف في ذوات الياء، ومذهب ورش بين اللفظين، ومذهب أبي عمرو في ذوات الراء.',
    audioTrack: {
      title: 'باب الإمالة والتقليل',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '08:30',
      durationSeconds: 510,
      audioUrl: '/audio/shatibiyyah/muqaddimah.mp3',
      downloadUrl: '/audio/shatibiyyah/muqaddimah.mp3'
    }
  },
  {
    id: 'raat_lamat',
    number: 11,
    titleArabic: 'بَابُ مَذَاهِبِهِمْ فِي الرَّاءَاتِ وَاللاَّمَاتِ',
    titleEnglish: 'Chapter on the Rules of Ra’at and Lamat',
    baytRange: { start: 342, end: 370 },
    versesCount: 29,
    summary: 'Warsh’s renowned unique transmission: Tarqeeq (lightening) of vowelled Ra’ preceded by Kasrah Lazimah or Sakin Ya’ (خَبِيرٌ، سِرَاجاً), and Taghleedh (thickening) of Fathah Lam preceded by Sad, Dhad, or Ta’ (الصَّلاةَ، ظَلَمُوا).',
    summaryArabic: 'انفراد ورش عن نافع بترقيق الراءات المفتوحة والمضمومة بعد الكسر والياء، وتغليظ اللامات المفتوحة إذا سبقت بالصاد أو الضاد أو الطاء.',
    audioTrack: {
      title: 'باب الراءات واللامات',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '07:05',
      durationSeconds: 425,
      audioUrl: '/audio/shatibiyyah/basmalah.mp3',
      downloadUrl: '/audio/shatibiyyah/basmalah.mp3'
    }
  },
  {
    id: 'khatimah',
    number: 12,
    titleArabic: 'خَاتِمَةُ مَتْنِ الشَّاطِبِيَّةِ',
    titleEnglish: 'The Epilogue of Matn Ash-Shatibiyyah & Author’s Supplication',
    baytRange: { start: 1150, end: 1173 },
    versesCount: 24,
    summary: 'Imam Al-Shatibi’s moving conclusion, naming the poem "Hirz al-Amani wa Wajh at-Tahani", humbleness before Allah, supplications for the reader, and eternal prayers upon the Prophet Muhammad ﷺ.',
    summaryArabic: 'خاتمة الإمام الشاطبي رحمه الله، وتسميته للنظم (حرز الأماني ووجه التهاني)، ووصيته لطالب العلم، ودعاؤه الشريف بالرحمة والمغفرة.',
    audioTrack: {
      title: 'خاتمة متن الشاطبية',
      reciter: 'Sheikh Okasha Kameny',
      reciterArabic: 'الشيخ عكاشة كميني',
      duration: '06:40',
      durationSeconds: 400,
      audioUrl: '/audio/shatibiyyah/fatihah.mp3',
      downloadUrl: '/audio/shatibiyyah/fatihah.mp3'
    }
  }
];

export const SHATIBIYYAH_ABYAT: ShatibiyyahBayt[] = [
  // ── 1. المقدمة (Introduction) ──
  {
    id: 'shat-1',
    babId: 'muqaddimah',
    baytNumber: 1,
    shatrA: 'بَدَأْتُ بِبِسْمِ اللَّهِ فِي النَّظْمِ أَوَّلاَ',
    shatrB: 'تَبَارَكَ رَحْمَاناً رَحِيماً وَمَوْئِلاَ',
    fullArabic: 'بَدَأْتُ بِبِسْمِ اللَّهِ فِي النَّظْمِ أَوَّلاَ ... تَبَارَكَ رَحْمَاناً رَحِيماً وَمَوْئِلاَ',
    englishTranslation: 'I begin with the Name of Allah in this poetic composition first of all; blessed be He as Most Merciful, Ever Merciful, and our supreme refuge.',
    qiraatExplanation: 'The author opens with the Basmalah following the divine instruction and prophetic practice of beginning noble endeavors with Allah’s holy Name.',
    keyTheme: 'Opening with Allah\'s Name'
  },
  {
    id: 'shat-2',
    babId: 'muqaddimah',
    baytNumber: 2,
    shatrA: 'وَثَنَّيْتُ صَلَّى اللَّهُ رَبِّي عَلَى الرِّضَا',
    shatrB: 'مُحَمَّدٍ الْمُهْدَى إِلَى النَّاسِ رِسْلاَ',
    fullArabic: 'وَثَنَّيْتُ صَلَّى اللَّهُ رَبِّي عَلَى الرِّضَا ... مُحَمَّدٍ الْمُهْدَى إِلَى النَّاسِ رِسْلاَ',
    englishTranslation: 'And second, may Allah my Lord send peace and blessings upon the chosen, pleasing one: Muhammad, gifted to mankind as an emissary of truth.',
    qiraatExplanation: 'Invoking salawat upon the Prophet Muhammad ﷺ, the recipient of the Noble Quran and teacher of all its variant canonical modes.',
    keyTheme: 'Salawat upon the Messenger ﷺ'
  },
  {
    id: 'shat-3',
    babId: 'muqaddimah',
    baytNumber: 3,
    shatrA: 'وَعِتْرَتِهِ ثُمَّ الصَّحَابَةِ كُلِّهِمْ',
    shatrB: 'مَدَى الدَّهْرِ صَفْواً وَالْوِلاَءَ الْمُخَلَّلاَ',
    fullArabic: 'وَعِتْرَتِهِ ثُمَّ الصَّحَابَةِ كُلِّهِمْ ... مَدَى الدَّهْرِ صَفْواً وَالْوِلاَءَ الْمُخَلَّلاَ',
    englishTranslation: 'And upon his noble family, and all the Sahabah through the span of eternity, in purest affection and deep loyal friendship.',
    qiraatExplanation: 'Prayers for the Companions who memorized the Quran directly from the Prophet’s lips and faithfully passed it on to succeeding generations.',
    keyTheme: 'Virtue of Ahl al-Bayt and Sahabah'
  },
  {
    id: 'shat-4',
    babId: 'muqaddimah',
    baytNumber: 4,
    shatrA: 'وَثَلَّثْتُ أَنَّ الحَمْدَ لِلَّهِ دَائِماً',
    shatrB: 'وَمَا لَيْسَ مَبْدُوءاً بِهِ أَبْتَرُ الْعَلاَ',
    fullArabic: 'وَثَلَّثْتُ أَنَّ الحَمْدَ لِلَّهِ دَائِماً ... وَمَا لَيْسَ مَبْدُوءاً بِهِ أَبْتَرُ الْعَلاَ',
    englishTranslation: 'And thirdly, all praise belongs eternally to Allah; for any noble endeavor not begun with praise of Him is cut off from sublime heights.',
    qiraatExplanation: 'Referencing the famous hadith on beginning actions with Hamdalah so that their blessings remain everlasting.',
    keyTheme: 'Praise of Allah'
  },
  {
    id: 'shat-5',
    babId: 'muqaddimah',
    baytNumber: 5,
    shatrA: 'وَإِنَّ كِتَابَ اللَّهِ أَوْثَقُ شَافِعٍ',
    shatrB: 'وَأَغْنَى غَنَاءٍ وَاهِباً مُتَفَضِّلاَ',
    fullArabic: 'وَإِنَّ كِتَابَ اللَّهِ أَوْثَقُ شَافِعٍ ... وَأَغْنَى غَنَاءٍ وَاهِباً مُتَفَضِّلاَ',
    englishTranslation: 'Indeed, the Book of Allah is the most trustworthy intercessor, the richest of all treasures, generously giving and bestowing excellence.',
    qiraatExplanation: 'Highlighting that the Quran will intercede on the Day of Judgment for its companion who recited and lived by it.',
    keyTheme: 'Virtues of the Holy Quran'
  },
  {
    id: 'shat-6',
    babId: 'muqaddimah',
    baytNumber: 6,
    shatrA: 'وَخَيْرُ جَلِيسٍ لاَ يُمَلُّ حَدِيثُهُ',
    shatrB: 'وَتَرْدَادُهُ يَزْدَادُ فِيهِ تَجَمُّلاَ',
    fullArabic: 'وَخَيْرُ جَلِيسٍ لاَ يُمَلُّ حَدِيثُهُ ... وَتَرْدَادُهُ يَزْدَادُ فِيهِ تَجَمُّلاَ',
    englishTranslation: 'It is the best companion whose speech never bores, and whose repetition only increases it in elegance and radiant beauty.',
    qiraatExplanation: 'Unlike worldly literature, reciting the Quran repeatedly deepens reverence and discloses fresh layers of guidance.',
    keyTheme: 'The Best Companion'
  },
  {
    id: 'shat-7',
    babId: 'muqaddimah',
    baytNumber: 7,
    shatrA: 'فَيَا أَيُّهَا الْقَارِي بِهِ مُتَمَسِّكاً',
    shatrB: 'مُجِلاًّ لَهُ فِي كُلِّ حَالٍ مُبَجِّلاَ',
    fullArabic: 'فَيَا أَيُّهَا الْقَارِي بِهِ مُتَمَسِّكاً ... مُجِلاًّ لَهُ فِي كُلِّ حَالٍ مُبَجِّلاَ',
    englishTranslation: 'O reciter holding fast unto it, exalting it and honoring it with deep reverence in every condition!',
    qiraatExplanation: 'Direct address to the dedicated student and bearer of the Quran.',
    keyTheme: 'Calling the Quran Reciter'
  },
  {
    id: 'shat-8',
    babId: 'muqaddimah',
    baytNumber: 8,
    shatrA: 'هَنِيئاً مَرِيئاً وَالِدَاكَ عَلَيْهِمَا',
    shatrB: 'مَلاَبِسُ أَنْوَارٍ مِنَ التَّاجِ وَالحُلاَ',
    fullArabic: 'هَنِيئاً مَرِيئاً وَالِدَاكَ عَلَيْهِمَا ... مَلاَبِسُ أَنْوَارٍ مِنَ التَّاجِ وَالحُلاَ',
    englishTranslation: 'Glad tidings and wholesome joy to you! Your parents shall be adorned with radiant robes of divine light, a magnificent crown, and celestial garments.',
    qiraatExplanation: 'Allusion to the authentic hadith where parents of the Quran memorizer are crowned with crowns surpassing the splendor of the sun.',
    keyTheme: 'Honoring the Parents of the Hafidh'
  },

  // ── 2. أسماء القراء السبعة ورواتهم (The 7 Imams & 14 Ruwat) ──
  {
    id: 'shat-20',
    babId: 'muqaddimah',
    baytNumber: 20,
    shatrA: 'فَأَمَّا الْكَرِيمُ السِّرِّ فِي الطِّيبِ نَافِعٌ',
    shatrB: 'فَذَاكَ الَّذِي اخْتَارَ الْمَدِينَةَ مَنْزِلاَ',
    fullArabic: 'فَأَمَّا الْكَرِيمُ السِّرِّ فِي الطِّيبِ نَافِعٌ ... فَذَاكَ الَّذِي اخْتَارَ الْمَدِينَةَ مَنْزِلاَ',
    englishTranslation: 'As for the noble in inner purity and pleasant fragrance, Nafi‘: he is the one who took Madinah the Enlightened as his home and sanctuary.',
    qiraatExplanation: 'Introducing Imam Nafi‘ ibn ‘Abd ar-Rahman al-Madani (d. 169 AH), the head of the reciters in the Prophet\'s City of Madinah. When he spoke, the fragrance of musk would emanate from his mouth.',
    ramzBreakdown: [
      { symbol: 'أ (Hamzah)', imamOrRawi: 'Imam Nafi‘', category: 'individual', meaning: 'Letter Alef is the cipher for Imam Nafi‘ al-Madani.' }
    ],
    keyTheme: 'Imam 1: Nafi‘ al-Madani'
  },
  {
    id: 'shat-21',
    babId: 'muqaddimah',
    baytNumber: 21,
    shatrA: 'وَقَالُونُ عِيسَى ثُمَّ عُثْمَانُ وَرْشُهُمْ',
    shatrB: 'بِصُحْبَتِهِ المَجْدَ الرَّفِيعَ تَأَثَّلاَ',
    fullArabic: 'وَقَالُونُ عِيسَى ثُمَّ عُثْمَانُ وَرْشُهُمْ ... بِصُحْبَتِهِ المَجْدَ الرَّفِيعَ تَأَثَّلاَ',
    englishTranslation: 'And Qalun ‘Isa, then ‘Uthman called Warsh: through long companionship with him, they firmly established lofty renown and glory.',
    qiraatExplanation: 'The two canonical transmitters of Nafi‘: Qalun (cipher ب) and Warsh (cipher ج). Together they receive the group cipher (أ ب ج).',
    ramzBreakdown: [
      { symbol: 'ب (Ba)', imamOrRawi: 'Qalun (‘Isa ibn Mina)', category: 'individual', meaning: 'First rawi of Nafi‘' },
      { symbol: 'ج (Jeem)', imamOrRawi: 'Warsh (‘Uthman ibn Sa‘id)', category: 'individual', meaning: 'Second rawi of Nafi‘' }
    ],
    keyTheme: 'Ruwat of Nafi‘: Qalun & Warsh'
  },
  {
    id: 'shat-22',
    babId: 'muqaddimah',
    baytNumber: 22,
    shatrA: 'وَمَكَّةُ عَبْدُ اللَّهِ فِيهَا مُقَامُهُ',
    shatrB: 'هُوَ ابْنُ كَثِيرٍ حُرْمَةَ الْقَوْمِ يَمَّمَا',
    fullArabic: 'وَمَكَّةُ عَبْدُ اللَّهِ فِيهَا مُقَامُهُ ... هُوَ ابْنُ كَثِيرٍ حُرْمَةَ الْقَوْمِ يَمَّمَا',
    englishTranslation: 'And in Makkah, ‘Abdullah had his abode; he is Ibn Kathir, who turned towards the sacred sanctuary of his people.',
    qiraatExplanation: 'Imam ‘Abdullah ibn Kathir al-Makki (d. 120 AH), the primary Imam of Makkah al-Mukarramah. His cipher letter is د (Dal).',
    ramzBreakdown: [
      { symbol: 'د (Dal)', imamOrRawi: 'Imam Ibn Kathir al-Makki', category: 'individual', meaning: 'Cipher for Ibn Kathir' }
    ],
    keyTheme: 'Imam 2: Ibn Kathir al-Makki'
  },
  {
    id: 'shat-23',
    babId: 'muqaddimah',
    baytNumber: 23,
    shatrA: 'رَوَى أَحْمَدُ الْبَزِّيُّ لَهُ وَمُحَمَّدٌ',
    shatrB: 'عَلَى سَنَدٍ وَهْوَ المُلَقَّبُ قُنْبُلاَ',
    fullArabic: 'رَوَى أَحْمَدُ الْبَزِّيُّ لَهُ وَمُحَمَّدٌ ... عَلَى سَنَدٍ وَهْوَ المُلَقَّبُ قُنْبُلاَ',
    englishTranslation: 'Ahmad al-Bazzi transmitted on his authority, and Muhammad through verified transmission, known by the title Qunbul.',
    qiraatExplanation: 'Transmitters of Ibn Kathir: Al-Bazzi (cipher هـ) and Qunbul (cipher ز). Together with their Imam they form the word cipher (دَهَز).',
    ramzBreakdown: [
      { symbol: 'هـ (Ha)', imamOrRawi: 'Al-Bazzi', category: 'individual', meaning: 'First rawi of Ibn Kathir' },
      { symbol: 'ز (Zay)', imamOrRawi: 'Qunbul', category: 'individual', meaning: 'Second rawi of Ibn Kathir' }
    ],
    keyTheme: 'Ruwat of Ibn Kathir: Al-Bazzi & Qunbul'
  },
  {
    id: 'shat-24',
    babId: 'muqaddimah',
    baytNumber: 24,
    shatrA: 'وَأَمَّا الإِمَامُ المَازِنِيُّ صَرِيحُهُمْ',
    shatrB: 'أَبُو عَمْرٍو الْبَصْرِيُّ فَوَالِدُهُ الْعَلاَ',
    fullArabic: 'وَأَمَّا الإِمَامُ المَازِنِيُّ صَرِيحُهُمْ ... أَبُو عَمْرٍو الْبَصْرِيُّ فَوَالِدُهُ الْعَلاَ',
    englishTranslation: 'As for the Imam of Banu Mazin, their pure lineage: Abu ‘Amr al-Basri, whose father was al-‘Ala.',
    qiraatExplanation: 'Imam Abu ‘Amr Zabban ibn al-‘Ala al-Basri (d. 154 AH), undisputed master of Arabic grammar and reciter of Basrah. His cipher letter is ح (Ha).',
    ramzBreakdown: [
      { symbol: 'ح (Haa)', imamOrRawi: 'Imam Abu ‘Amr al-Basri', category: 'individual', meaning: 'Cipher for Abu ‘Amr' }
    ],
    keyTheme: 'Imam 3: Abu ‘Amr al-Basri'
  },
  {
    id: 'shat-25',
    babId: 'muqaddimah',
    baytNumber: 25,
    shatrA: 'أَفَاضَ عَلَى الْيَحْيِيِّ سَيْباً وَسَيْبُهُ',
    shatrB: 'عَلَى كُلِّ بَصْرِيٍّ تَلَفَّفَ مَنْهَلاَ',
    fullArabic: 'أَفَاضَ عَلَى الْيَحْيِيِّ سَيْباً وَسَيْبُهُ ... عَلَى كُلِّ بَصْرِيٍّ تَلَفَّفَ مَنْهَلاَ',
    englishTranslation: 'He poured forth upon Yahya al-Yazidi a sweet spring of knowledge, whose flow quenched every seeker from Basrah.',
    qiraatExplanation: 'Connecting Abu ‘Amr to his greatest student Yahya al-Yazidi, who taught Ad-Duri and As-Susi.',
    keyTheme: 'Transmission of Abu ‘Amr'
  },
  {
    id: 'shat-26',
    babId: 'muqaddimah',
    baytNumber: 26,
    shatrA: 'أَبُو عُمَرَ الدُّورِيُّ وَصَالِحُهُمْ جَدَا',
    shatrB: 'أَبُو شُعَيْبٍ هُوَ السُّوسِيُّ عَنْهُ تَقَبَّلاَ',
    fullArabic: 'أَبُو عُمَرَ الدُّورِيُّ وَصَالِحُهُمْ جَدَا ... أَبُو شُعَيْبٍ هُوَ السُّوسِيُّ عَنْهُ تَقَبَّلاَ',
    englishTranslation: 'Abu ‘Umar ad-Duri, and their pious master Abu Shu‘ayb who is as-Susi, received the readings from him.',
    qiraatExplanation: 'Transmitters of Abu ‘Amr: Ad-Duri (cipher ط) and As-Susi (cipher ي). Together with their Imam they form (حُطِّي).',
    ramzBreakdown: [
      { symbol: 'ط (Ta)', imamOrRawi: 'Ad-Duri ‘an Abi ‘Amr', category: 'individual', meaning: 'First rawi of Abu ‘Amr' },
      { symbol: 'ي (Ya)', imamOrRawi: 'As-Susi ‘an Abi ‘Amr', category: 'individual', meaning: 'Second rawi of Abu ‘Amr' }
    ],
    keyTheme: 'Ruwat of Abu ‘Amr: Ad-Duri & As-Susi'
  },
  {
    id: 'shat-27',
    babId: 'muqaddimah',
    baytNumber: 27,
    shatrA: 'وَأَمَّا دِمَشْقُ الشَّامِ دَارُ ابْنِ عَامِرٍ',
    shatrB: 'فَتِلْكَ بِعَبْدِ اللَّهِ طَابَتْ مُحَلَّلاَ',
    fullArabic: 'وَأَمَّا دِمَشْقُ الشَّامِ دَارُ ابْنِ عَامِرٍ ... فَتِلْكَ بِعَبْدِ اللَّهِ طَابَتْ مُحَلَّلاَ',
    englishTranslation: 'And Damascus of the Levant, the dwelling of Ibn ‘Amir: through ‘Abdullah it became sweet and blessed as a resting place.',
    qiraatExplanation: 'Imam ‘Abdullah ibn ‘Amir ash-Shami (d. 118 AH), the oldest of the Seven Imams and a Tabi‘i who led prayer in the Umayyad Mosque. His cipher letter is ك (Kaf).',
    ramzBreakdown: [
      { symbol: 'ك (Kaf)', imamOrRawi: 'Imam Ibn ‘Amir ash-Shami', category: 'individual', meaning: 'Cipher for Ibn ‘Amir' }
    ],
    keyTheme: 'Imam 4: Ibn ‘Amir ash-Shami'
  },
  {
    id: 'shat-28',
    babId: 'muqaddimah',
    baytNumber: 28,
    shatrA: 'هِشَامٌ وَعَبْدُ اللَّهِ وَهْوَ ابْنُ ذَكْوَانَ',
    shatrB: 'لإِسْنَادِهِ عَنْهُ انْتَسَاباً تَقَبَّلاَ',
    fullArabic: 'هِشَامٌ وَعَبْدُ اللَّهِ وَهْوَ ابْنُ ذَكْوَانَ ... لإِسْنَادِهِ عَنْهُ انْتَسَاباً تَقَبَّلاَ',
    englishTranslation: 'Hisham and ‘Abdullah who is Ibn Dhakwan, with proud affiliation received the transmission from him.',
    qiraatExplanation: 'Transmitters of Ibn ‘Amir: Hisham (cipher ل) and Ibn Dhakwan (cipher م). With their Imam they form (كَلَمَن).',
    ramzBreakdown: [
      { symbol: 'ل (Lam)', imamOrRawi: 'Hisham ibn ‘Ammar', category: 'individual', meaning: 'First rawi of Ibn ‘Amir' },
      { symbol: 'م (Meem)', imamOrRawi: 'Ibn Dhakwan', category: 'individual', meaning: 'Second rawi of Ibn ‘Amir' }
    ],
    keyTheme: 'Ruwat of Ibn ‘Amir: Hisham & Ibn Dhakwan'
  },
  {
    id: 'shat-29',
    babId: 'muqaddimah',
    baytNumber: 29,
    shatrA: 'وَبِالْكُوفَةِ الْغَرَّاءِ مِنْهُمْ ثَلاَثَةٌ',
    shatrB: 'أَذَاعُوا فَقَدْ ضَاعَتْ شَذىً وَتَقَرْنُفُلاَ',
    fullArabic: 'وَبِالْكُوفَةِ الْغَرَّاءِ مِنْهُمْ ثَلاَثَةٌ ... أَذَاعُوا فَقَدْ ضَاعَتْ شَذىً وَتَقَرْنُفُلاَ',
    englishTranslation: 'And in radiant Kufa, three among them broadcast the readings, spreading a fragrance like cloves and amber.',
    qiraatExplanation: 'Introducing the three Kufan Imams: ‘Asim, Hamzah, and Al-Kisa’i.',
    keyTheme: 'The Three Imams of Kufah'
  },
  {
    id: 'shat-30',
    babId: 'muqaddimah',
    baytNumber: 30,
    shatrA: 'فَأَمَّا أَبُو بَكْرٍ وَعَاصِمٌ اسْمُهُ',
    shatrB: 'فَشُعْبَةُ رَاوِيهِ المَبَرَّزُ أَفْضَلاَ',
    fullArabic: 'فَأَمَّا أَبُو بَكْرٍ وَعَاصِمٌ اسْمُهُ ... فَشُعْبَةُ رَاوِيهِ المَبَرَّزُ أَفْضَلاَ',
    englishTranslation: 'As for Abu Bakr whose name was ‘Asim: Shu‘bah was his distinguished and foremost transmitter.',
    qiraatExplanation: 'Imam ‘Asim ibn Abi an-Najud al-Kufi (cipher ن) and his rawi Shu‘bah Abu Bakr (cipher ص).',
    ramzBreakdown: [
      { symbol: 'ن (Noon)', imamOrRawi: 'Imam ‘Asim al-Kufi', category: 'individual', meaning: 'Cipher for ‘Asim' },
      { symbol: 'ص (Sad)', imamOrRawi: 'Shu‘bah ibn ‘Ayyash', category: 'individual', meaning: 'First rawi of ‘Asim' }
    ],
    keyTheme: 'Imam 5: ‘Asim & Shu‘bah'
  },
  {
    id: 'shat-31',
    babId: 'muqaddimah',
    baytNumber: 31,
    shatrA: 'وَذَاكَ ابْنُ سُلَيْمَانَ حَفْصٌ وَبِالرِّضَا',
    shatrB: 'كَسَاهُ كِسَاءً جَمَّلاً مُتَسَرْبِلاَ',
    fullArabic: 'وَذَاكَ ابْنُ سُلَيْمَانَ حَفْصٌ وَبِالرِّضَا ... كَسَاهُ كِسَاءً جَمَّلاً مُتَسَرْبِلاَ',
    englishTranslation: 'And that was Hafs ibn Sulayman, whom he clothed in garments of pleasing perfection and mastery.',
    qiraatExplanation: 'Hafs ibn Sulayman (cipher ع), the renowned transmitter whose recitation is now read across most of the Islamic world. With ‘Asim and Shu‘bah they form (نَصَع).',
    ramzBreakdown: [
      { symbol: 'ع (‘Ayn)', imamOrRawi: 'Hafs ibn Sulayman', category: 'individual', meaning: 'Second rawi of ‘Asim' }
    ],
    keyTheme: 'Rawi 2 of ‘Asim: Hafs'
  },
  {
    id: 'shat-32',
    babId: 'muqaddimah',
    baytNumber: 32,
    shatrA: 'وَحَمْزَةُ مَا أَزْكَاهُ مِنْ مُتَوَرِّعٍ',
    shatrB: 'إِمَاماً صَبُوراً لِلقُرْآنِ مُرَتِّلاَ',
    fullArabic: 'وَحَمْزَةُ مَا أَزْكَاهُ مِنْ مُتَوَرِّعٍ ... إِمَاماً صَبُوراً لِلقُرْآنِ مُرَتِّلاَ',
    englishTranslation: 'And Hamzah: how purest in piety he was! A patient, steadfast Imam reciting the Quran with slow measured devotion.',
    qiraatExplanation: 'Imam Hamzah ibn Habib az-Zayyat (d. 156 AH), famed for his profound scrupulousness and strict Quranic adherence. His cipher letter is ف (Fa).',
    ramzBreakdown: [
      { symbol: 'ف (Fa)', imamOrRawi: 'Imam Hamzah az-Zayyat', category: 'individual', meaning: 'Cipher for Hamzah' }
    ],
    keyTheme: 'Imam 6: Hamzah az-Zayyat'
  },
  {
    id: 'shat-33',
    babId: 'muqaddimah',
    baytNumber: 33,
    shatrA: 'رَوَى خَلَفٌ عَنْهُ وَخَلاَّدٌ الَّذِي',
    shatrB: 'رَوَاهُ سُلَيْمٌ مُتْقِناً وَمُحَصِّلاَ',
    fullArabic: 'رَوَى خَلَفٌ عَنْهُ وَخَلاَّدٌ الَّذِي ... رَوَاهُ سُلَيْمٌ مُتْقِناً وَمُحَصِّلاَ',
    englishTranslation: 'Khalaf transmitted from him, and Khallad who took it through Sulaym with impeccable precision and mastery.',
    qiraatExplanation: 'Transmitters of Hamzah through Sulaym: Khalaf (cipher ض) and Khallad (cipher ق). With Hamzah they form (فَضَق).',
    ramzBreakdown: [
      { symbol: 'ض (Dhad)', imamOrRawi: 'Khalaf ‘an Hamzah', category: 'individual', meaning: 'First rawi of Hamzah' },
      { symbol: 'ق (Qaf)', imamOrRawi: 'Khallad ‘an Hamzah', category: 'individual', meaning: 'Second rawi of Hamzah' }
    ],
    keyTheme: 'Ruwat of Hamzah: Khalaf & Khallad'
  },
  {
    id: 'shat-34',
    babId: 'muqaddimah',
    baytNumber: 34,
    shatrA: 'وَأَمَّا عَلِيٌّ فَالْكِسَائِيُّ نَعْتُهُ',
    shatrB: 'لِمَا كَانَ فِي الإِحْرَامِ فِيهِ تَسَرْبَلاَ',
    fullArabic: 'وَأَمَّا عَلِيٌّ فَالْكِسَائِيُّ نَعْتُهُ ... لِمَا كَانَ فِي الإِحْرَامِ فِيهِ تَسَرْبَلاَ',
    englishTranslation: 'As for ‘Ali, Al-Kisa’i was his title, because of the cloak (kisa’) he wore while in Ihram for pilgrimage.',
    qiraatExplanation: 'Imam ‘Ali ibn Hamzah al-Kisa’i (d. 189 AH), peerless linguist and reciter. His cipher letter is ر (Ra).',
    ramzBreakdown: [
      { symbol: 'ر (Ra)', imamOrRawi: 'Imam Al-Kisa’i', category: 'individual', meaning: 'Cipher for Al-Kisa’i' }
    ],
    keyTheme: 'Imam 7: Al-Kisa’i'
  },
  {
    id: 'shat-35',
    babId: 'muqaddimah',
    baytNumber: 35,
    shatrA: 'رَوَى لَيْثُهُمْ عَنْهُ أَبُو الحَارِثِ الرِّضَا',
    shatrB: 'وَحَفْصٌ هُوَ الدُّورِيُّ فِيهِ تَحَفَّلاَ',
    fullArabic: 'رَوَى لَيْثُهُمْ عَنْهُ أَبُو الحَارِثِ الرِّضَا ... وَحَفْصٌ هُوَ الدُّورِيُّ فِيهِ تَحَفَّلاَ',
    englishTranslation: 'Their lion Abu al-Harith the pleasing transmitted from him, and Hafs who is ad-Duri rejoiced in transmitting his reading.',
    qiraatExplanation: 'Transmitters of Al-Kisa’i: Abu al-Harith al-Layth (cipher س) and Hafs ad-Duri (cipher ت). With Al-Kisa’i they form (رَسَت).',
    ramzBreakdown: [
      { symbol: 'س (Seen)', imamOrRawi: 'Abu al-Harith al-Layth', category: 'individual', meaning: 'First rawi of Al-Kisa’i' },
      { symbol: 'ت (Ta)', imamOrRawi: 'Ad-Duri ‘an al-Kisa’i', category: 'individual', meaning: 'Second rawi of Al-Kisa’i' }
    ],
    keyTheme: 'Ruwat of Al-Kisa’i: Abu al-Harith & Ad-Duri'
  },

  // ── 3. باب الاستعاذة (Isti’adhah) ──
  {
    id: 'shat-95',
    babId: 'istiadhah',
    baytNumber: 95,
    shatrA: 'إِذَا مَا أَرَدْتَ الدَّهْرَ تَقْرَأُ فَاسْتَعِذْ',
    shatrB: 'جِهَاراً مِنَ الشَّيْطَانِ بِاللَّهِ مُسْجَلاَ',
    fullArabic: 'إِذَا مَا أَرَدْتَ الدَّهْرَ تَقْرَأُ فَاسْتَعِذْ ... جِهَاراً مِنَ الشَّيْطَانِ بِاللَّهِ مُسْجَلاَ',
    englishTranslation: 'Whenever you wish to recite the Quran at any time, seek refuge openly and aloud in Allah from the accursed Satan, as generally commanded.',
    qiraatExplanation: 'Commanding the reciter to pronounce the Isti’adhah before beginning recitation based on Surah An-Nahl (فَإِذَا قَرَأْتَ الْقُرْآنَ فَاسْتَعِذْ بِاللَّهِ).',
    keyTheme: 'Command to Seek Refuge'
  },
  {
    id: 'shat-96',
    babId: 'istiadhah',
    baytNumber: 96,
    shatrA: 'عَلَى مَا أَتَى فِي النَّحْلِ يُسْراً وَإِنْ تَزِدْ',
    shatrB: 'لِرَبِّكَ تَنْزِيهاً فَلَسْتَ مُجَهَّلاَ',
    fullArabic: 'عَلَى مَا أَتَى فِي النَّحْلِ يُسْراً وَإِنْ تَزِدْ ... لِرَبِّكَ تَنْزِيهاً فَلَسْتَ مُجَهَّلاَ',
    englishTranslation: 'Following what came in Surah An-Nahl with ease; and if you add formulas glorifying your Lord (such as al-‘Alim or as-Sami‘), you are by no means in error.',
    qiraatExplanation: 'Permissibility of adding authentic invocations such as (أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ).',
    keyTheme: 'Phrasings of Isti’adhah'
  },
  {
    id: 'shat-97',
    babId: 'istiadhah',
    baytNumber: 97,
    shatrA: 'وَقَدْ ذَكَرُوا لَفْظَ النَّبِيِّ وَشَمْلُهُ',
    shatrB: 'تَوَشَّحَ بِالقُرْآنِ شَمْلاً مُجَمَّلاَ',
    fullArabic: 'وَقَدْ ذَكَرُوا لَفْظَ النَّبِيِّ وَشَمْلُهُ ... تَوَشَّحَ بِالقُرْآنِ شَمْلاً مُجَمَّلاَ',
    englishTranslation: 'The scholars cited the verbatim phrasing of the Prophet ﷺ, whose entire mantle was adorned with the splendor of the Quran.',
    qiraatExplanation: 'Stressing following the Prophetic formulation preserved in the Sunnah.',
    keyTheme: 'The Prophetic Phrasing'
  },

  // ── 4. باب البسملة (Basmalah) ──
  {
    id: 'shat-100',
    babId: 'basmalah',
    baytNumber: 100,
    shatrA: 'وَبَسْمَلَ بَيْنَ السُّورَتَيْنِ بِسُنَّةٍ',
    shatrB: 'رِجَالٌ نَمَوْهَا دِرْيَةً وَتَحَمُّلاَ',
    fullArabic: 'وَبَسْمَلَ بَيْنَ السُّورَتَيْنِ بِسُنَّةٍ ... رِجَالٌ نَمَوْهَا دِرْيَةً وَتَحَمُّلاَ',
    englishTranslation: 'And those who recited the Basmalah between two consecutive Surahs as an established Sunnah are men who transmitted it with deep knowledge and verified reception.',
    qiraatExplanation: 'Codifying the reciters who recite the Basmalah between every two surahs: indicated by the cipher phrase (رِجَالٌ نَمَوْهَا دِرْيَةً) which points to Al-Kisa’i (ر), ‘Asim (ن), Ibn Kathir (د), and Qalun (ب from بسمل).',
    ramzBreakdown: [
      { symbol: 'ر (Ra)', imamOrRawi: 'Al-Kisa’i', category: 'individual', meaning: 'In the word رِجَالٌ' },
      { symbol: 'ن (Noon)', imamOrRawi: '‘Asim', category: 'individual', meaning: 'In the word نَمَوْهَا' },
      { symbol: 'د (Dal)', imamOrRawi: 'Ibn Kathir', category: 'individual', meaning: 'In the word دِرْيَةً' }
    ],
    keyTheme: 'Basmalah between Two Surahs'
  },
  {
    id: 'shat-101',
    babId: 'basmalah',
    baytNumber: 101,
    shatrA: 'وَوَصْلُكَ بَيْنَ السُّورَتَيْنِ فَصَاحَةٌ',
    shatrB: 'وَصِلْ وَاسْكُتَنْ كُلٌّ جَلاَيَاهُ حَصَّلاَ',
    fullArabic: 'وَوَصْلُكَ بَيْنَ السُّورَتَيْنِ فَصَاحَةٌ ... وَصِلْ وَاسْكُتَنْ كُلٌّ جَلاَيَاهُ حَصَّلاَ',
    englishTranslation: 'And joining without Basmalah between two Surahs is eloquent Arabic; and both joining (Wasl) and pausing without breathing (Sakt) are authentic options whose beauty is well established.',
    qiraatExplanation: 'Explaining Hamzah’s rule of Wasl without Basmalah, and the dual permissible facets of Sakt and Wasl for Warsh, Abu ‘Amr, and Ibn ‘Amir.',
    keyTheme: 'Wasl and Sakt between Surahs'
  },
  {
    id: 'shat-102',
    babId: 'basmalah',
    baytNumber: 102,
    shatrA: 'وَلاَ بُدَّ مِنْهَا فِي ابْتِدَائِكَ سُورَةً',
    shatrB: 'سِوَاهَا وَفِي الأَجْزَاءِ خُيِّرَ مَنْ تَلاَ',
    fullArabic: 'وَلاَ بُدَّ مِنْهَا فِي ابْتِدَائِكَ سُورَةً ... سِوَاهَا وَفِي الأَجْزَاءِ خُيِّرَ مَنْ تَلاَ',
    englishTranslation: 'And the Basmalah is mandatory whenever you begin any Surah other than Bara’ah (At-Tawbah); while at mid-surah sections (Ajza’), the reciter is given full choice.',
    qiraatExplanation: 'All reciters unanimously agree on pronouncing Basmalah when starting a new Surah (except Surah At-Tawbah). Within the body of a Surah, the reciter may choose between Basmalah or omitting it.',
    keyTheme: 'Starting a Surah & Mid-Surah Choice'
  },
  {
    id: 'shat-103',
    babId: 'basmalah',
    baytNumber: 103,
    shatrA: 'وَمَهْمَا تَصِلْهَا أَوْ بَدَأْتَ بَرَاءَةً',
    shatrB: 'لِتَنْزِيلِهَا بِالسَّيْفِ لَسْتَ مُبَسْمِلاَ',
    fullArabic: 'وَمَهْمَا تَصِلْهَا أَوْ بَدَأْتَ بَرَاءَةً ... لِتَنْزِيلِهَا بِالسَّيْفِ لَسْتَ مُبَسْمِلاَ',
    englishTranslation: 'And whenever you connect to, or start at Surah Bara’ah (At-Tawbah), because it was sent down with the sword of truth, you do not utter the Basmalah.',
    qiraatExplanation: 'Explaining why Surah At-Tawbah begins without Basmalah: because Basmalah conveys peace and mercy, while At-Tawbah revealed the severing of treaties with treacherous idolaters.',
    keyTheme: 'No Basmalah in Surah At-Tawbah'
  },

  // ── 5. باب سورة أم القرآن (Surah Al-Fatihah) ──
  {
    id: 'shat-109',
    babId: 'fatihah',
    baytNumber: 109,
    shatrA: 'وَمَالِكِ يَوْمِ الدِّينِ رَاوِيهِ نَاصِرٌ',
    shatrB: 'وَعِنْدَ صِرَاطٍ وَالصِّرَاطِ لِقُنْبُلٍ',
    fullArabic: 'وَمَالِكِ يَوْمِ الدِّينِ رَاوِيهِ نَاصِرٌ ... وَعِنْدَ صِرَاطٍ وَالصِّرَاطِ لِقُنْبُلٍ',
    englishTranslation: 'And the reading (مَالِكِ) with an Alif is transmitted by Al-Kisa’i (ر) and ‘Asim (ن); while regarding (صِرَاطٍ) and (الصِّرَاطَ), Qunbul reads with the letter Seen.',
    qiraatExplanation: 'Imam ‘Asim and Al-Kisa’i read (مَالِكِ) with an Alif (Master of the Day of Judgment), while the remaining five Imams read (مَلِكِ) without Alif (Sovereign King). Qunbul reads (سِرَاط) with a pure Seen throughout the Quran.',
    ramzBreakdown: [
      { symbol: 'ر (Ra)', imamOrRawi: 'Al-Kisa’i', category: 'individual', meaning: 'In the word رَاوِيهِ' },
      { symbol: 'ن (Noon)', imamOrRawi: '‘Asim', category: 'individual', meaning: 'In the word نَاصِرٌ' }
    ],
    keyTheme: 'Maliki vs Maliki & Sirat with Seen'
  },
  {
    id: 'shat-110',
    babId: 'fatihah',
    baytNumber: 110,
    shatrA: 'بِحَرْفٍ وَبِالتَّشْمِيمِ خَلَفٌ قَفَا',
    shatrB: 'وَلاَ خُلْفَ عَنْ خَلاَّدٍ الأَوَّلُ حُصِّلاَ',
    fullArabic: 'بِحَرْفٍ وَبِالتَّشْمِيمِ خَلَفٌ قَفَا ... وَلاَ خُلْفَ عَنْ خَلاَّدٍ الأَوَّلُ حُصِّلاَ',
    englishTranslation: 'And with Ishmam (blending the Sad with Zai), Khalaf followed this throughout; while Khallad reads Ishmam without disagreement in the first occurrence only in Al-Fatihah.',
    qiraatExplanation: 'Ishmam of Sad with the sound of Zai (ز) in (ٱلصِّرَٰطَ): Khalaf \'an Hamzah reads with Ishmam everywhere; Khallad reads with Ishmam in Al-Fatihah’s first occurrence (اهدِنَا الصِّراطَ الْمُسْتَقِيمَ) and has two options in the second.',
    keyTheme: 'Ishmam in Sirat for Hamzah'
  },
  {
    id: 'shat-111',
    babId: 'fatihah',
    baytNumber: 111,
    shatrA: 'عَلَيْهِمْ إِلَيْهِمْ حَمْزَةٌ لَدَيْهِمْ جَمِيعَهَا',
    shatrB: 'بِضَمِّ هَائِهَا وَقْفاً وَوَصْلاً مُجَمَّلاَ',
    fullArabic: 'عَلَيْهِمْ إِلَيْهِمْ حَمْزَةٌ لَدَيْهِمْ جَمِيعَهَا ... بِضَمِّ هَائِهَا وَقْفاً وَوَصْلاً مُجَمَّلاَ',
    englishTranslation: 'In (عَلَيْهِمْ), (إِلَيْهِمْ), and (لَدَيْهِمْ), Hamzah reads all of them with a Dammah on the Ha’ (علَيْهُم، إلَيْهُم، لدَيْهُم) both in stopping and in continuous recitation.',
    qiraatExplanation: 'Hamzah az-Zayyat recites the Ha\' with Dammah whenever it is preceded by a quiescent Ya\' in these three specific plural pronouns.',
    keyTheme: 'Hamzah’s Dammah on Alayhim'
  },

  // ── 6. باب الإدغام الكبير (Major Idgham) ──
  {
    id: 'shat-117',
    babId: 'idgham_kabir',
    baytNumber: 117,
    shatrA: 'وَدُونَكَ الإِدْغَامَ الكَبِيرَ وَقُطْبُهُ',
    shatrB: 'أَبُو عَمْرٍو الْبَصْرِيُّ فِيهِ تَحَفَّلاَ',
    fullArabic: 'وَدُونَكَ الإِدْغَامَ الكَبِيرَ وَقُطْبُهُ ... أَبُو عَمْرٍو الْبَصْرِيُّ فِيهِ تَحَفَّلاَ',
    englishTranslation: 'Here before you is Major Idgham, whose central axis and focal master is Abu ‘Amr al-Basri (transmitted via As-Susi), who gave it supreme attention.',
    qiraatExplanation: 'Opening the chapter on Idgham Kabir where two adjacent vowelled letters merge into a doubled letter, a hallmark reading of Imam Abu ‘Amr as related by As-Susi.',
    keyTheme: 'Abu ‘Amr & As-Susi’s Idgham Kabir'
  },
  {
    id: 'shat-118',
    babId: 'idgham_kabir',
    baytNumber: 118,
    shatrA: 'فَفِي كَلِمَةٍ عَنْهُ مَنَاسِكَكُمْ وَمَا',
    shatrB: 'سَلَكَكُمْ وَبَاقِي الْبَابِ لَيْسَ مُعَوَّلاَ',
    fullArabic: 'فَفِي كَلِمَةٍ عَنْهُ مَنَاسِكَكُمْ وَمَا ... سَلَكَكُمْ وَبَاقِي الْبَابِ لَيْسَ مُعَوَّلاَ',
    englishTranslation: 'In a single word, it is transmitted from him in (مَنَاسِكَكُمْ) and (مَا سَلَكَكُمْ), while other single-word instances are not assimilated.',
    qiraatExplanation: 'Major Idgham within a single word is restricted to two unique places in the Quran: (فَإِذَا قَضَيْتُمْ مَنَاسِكَّمْ) in Al-Baqarah and (مَا سَلَكَّكُمْ فِي سَقَرَ) in Al-Muddathir.',
    keyTheme: 'Single Word Idgham: Manasikakum & Salakakum'
  },
  {
    id: 'shat-119',
    babId: 'idgham_kabir',
    baytNumber: 119,
    shatrA: 'وَمَا كَانَ مِثْلَيْنِ فِي كَلِمَتَيْهِمَا',
    shatrB: 'فَلاَ بُدَّ مِنْ إِدْغَامِ مَا كَانَ أَوَّلاَ',
    fullArabic: 'وَمَا كَانَ مِثْلَيْنِ فِي كَلِمَتَيْهِمَا ... فَلاَ بُدَّ مِنْ إِدْغَامِ مَا كَانَ أَوَّلاَ',
    englishTranslation: 'And when two identical vowelled letters meet across two words, assimilation of the first into the second is an obligatory rule.',
    qiraatExplanation: 'General rule of Idgham Kabir of two identical letters (المثلين) across two words, such as (الرَّحِيمِ مَلِكِ -> الرَّحِيمَِّلِكِ) and (يَعْلَمُ مَا -> يَعْلَمَّـا).',
    keyTheme: 'Two Identical Letters across Two Words'
  },

  // ── 7. باب المد والقصر (Madd and Qasr) ──
  {
    id: 'shat-168',
    babId: 'madd_qasr',
    baytNumber: 168,
    shatrA: 'إِذَا أَلِفٌ أَوْ يَاؤُهَا أَوْ وَاوُهَا',
    shatrB: 'تَلاَهَا عَلَى كَسْرٍ وَضَمٍّ مُوَصَّلاَ',
    fullArabic: 'إِذَا أَلِفٌ أَوْ يَاؤُهَا أَوْ وَاوُهَا ... تَلاَهَا عَلَى كَسْرٍ وَضَمٍّ مُوَصَّلاَ',
    englishTranslation: 'When an Alif, or a Ya’ following a Kasrah, or a Waw following a Dammah is connected to a cause of elongation...',
    qiraatExplanation: 'Defining the three letters of Madd (Huruf al-Madd wal-Leen: Alif, Ya Sakinah preceded by Kasrah, Waw Sakinah preceded by Dammah).',
    keyTheme: 'The Three Letters of Madd'
  },
  {
    id: 'shat-169',
    babId: 'madd_qasr',
    baytNumber: 169,
    shatrA: 'فَإِنْ يَنْفَصِلْ فَالْقَصْرُ بَادِرْهُ طَالِباً',
    shatrB: 'بِخُلْفِهِمَا يُرْوِيكَ دَرّاً وَمُخْضَلاَ',
    fullArabic: 'فَإِنْ يَنْفَصِلْ فَالْقَصْرُ بَادِرْهُ طَالِباً ... بِخُلْفِهِمَا يُرْوِيكَ دَرّاً وَمُخْضَلاَ',
    englishTranslation: 'And if the Hamzah is disconnected in the next word (Madd Munfasil), hasten to apply Qasr (2 counts) as transmitted for Qalun (ب), Ad-Duri (ط), and Ibn Kathir (د) / As-Susi (ي).',
    qiraatExplanation: 'Codifying the reciters who permit Qasr (shortening to 2 vowel counts) in Madd Munfasil, contrasting with Hamzah and Warsh who strictly apply Tul (6 vowel counts).',
    ramzBreakdown: [
      { symbol: 'ب (Ba)', imamOrRawi: 'Qalun', category: 'individual', meaning: 'In the word بَادِرْهُ' },
      { symbol: 'ط (Ta)', imamOrRawi: 'Ad-Duri', category: 'individual', meaning: 'In the word طَالِباً' }
    ],
    keyTheme: 'Qasr in Madd Munfasil'
  },

  // ── 8. باب الراءات واللامات (Ra’at and Lamat) ──
  {
    id: 'shat-342',
    babId: 'raat_lamat',
    baytNumber: 342,
    shatrA: 'وَرَقِّقْ وَرْشٌ كُلَّ رَاءٍ وَقَفْتَهَا',
    shatrB: 'أَوْ وَصَلْتَهَا بَعْدَ كَسْرٍ مُؤَصَّلاَ',
    fullArabic: 'وَرَقِّقْ وَرْشٌ كُلَّ رَاءٍ وَقَفْتَهَا ... أَوْ وَصَلْتَهَا بَعْدَ كَسْرٍ مُؤَصَّلاَ',
    englishTranslation: 'And Warsh lightens (Tarqeeq) every vowelled Ra’ whether you stop upon it or connect it, if it occurs after an original inseparable Kasrah.',
    qiraatExplanation: 'The trademark rule of Imam Warsh \'an Nafi‘: thinning the Ra’ with Tarqeeq whenever preceded by an original Kasrah within the same word, such as in (سِرَاجاً) and (مِرْيَةٍ).',
    keyTheme: 'Warsh’s Tarqeeq of Ra’'
  },
  {
    id: 'shat-363',
    babId: 'raat_lamat',
    baytNumber: 363,
    shatrA: 'وَغَلَّظَ وَرْشٌ فَتْحَ لاَمٍ لِصَادِهَا',
    shatrB: 'أَوِ الطَّاءِ أَوْ لِلظَّاءِ قَبْلُ تَنَزَّلاَ',
    fullArabic: 'وَغَلَّظَ وَرْشٌ فَتْحَ لاَمٍ لِصَادِهَا ... أَوِ الطَّاءِ أَوْ لِلظَّاءِ قَبْلُ تَنَزَّلاَ',
    englishTranslation: 'And Warsh thickens (Taghleedh) an open-vowelled Lam when preceded by a Sad, Ta’, or Dha’ that came immediately before it.',
    qiraatExplanation: 'Taghleedh of Lam for Warsh: pronouncing the Lam with heavy fullness (تفخيم/تغليظ) when it has a Fathah and is preceded by Sad, Ta’, or Dha’ (whether vowelled with Fathah or quiescent), as in (ٱلصَّلَوٰةَ), (طَلَّقْتُمُ), and (ظَلَمُوا).',
    keyTheme: 'Warsh’s Taghleedh of Lam'
  },

  // ── 9. الخاتمة (Conclusion) ──
  {
    id: 'shat-1170',
    babId: 'khatimah',
    baytNumber: 1170,
    shatrA: 'وَسَمَّيْتُهَا حِرْزَ الأَمَانِي تَيَمُّناً',
    shatrB: 'وَوَجْهَ التَّهَانِي فَاهْنِ بِالْخَيْرِ مُقْبِلاَ',
    fullArabic: 'وَسَمَّيْتُهَا حِرْزَ الأَمَانِي تَيَمُّناً ... وَوَجْهَ التَّهَانِي فَاهْنِ بِالْخَيْرِ مُقْبِلاَ',
    englishTranslation: 'And I named it "Hirz al-Amani" (The Sanctuary of Desires) seeking blessing, and "Wajh at-Tahani" (The Countenance of Congratulations) — so rejoice in coming goodness!',
    qiraatExplanation: 'Imam Al-Shatibi explicitly names his immortal masterpiece in this couplet, wishing every student felicitations and success.',
    keyTheme: 'Naming the Poem Hirz al-Amani'
  },
  {
    id: 'shat-1173',
    babId: 'khatimah',
    baytNumber: 1173,
    shatrA: 'وَصَلَّى عَلَى عَبْدِهِ وَرَسُولِهِ',
    shatrB: 'مُحَمَّدٍ الْمَبْعُوثِ بِالحَقِّ مُرْسَلاَ',
    fullArabic: 'وَصَلَّى عَلَى عَبْدِهِ وَرَسُولِهِ ... مُحَمَّدٍ الْمَبْعُوثِ بِالحَقِّ مُرْسَلاَ',
    englishTranslation: 'And may Allah send continuous peace and blessings upon His servant and Messenger, Muhammad, sent with transcendent truth as an emissary of divine mercy.',
    qiraatExplanation: 'Concluding the 1,173 couplets with invocation of peace and blessings upon the Master of all Prophets ﷺ.',
    keyTheme: 'Concluding Salawat upon the Prophet ﷺ'
  }
];

export function getShatibiyyahBabById(babId: string): ShatibiyyahBab | undefined {
  return SHATIBIYYAH_ABWAB.find(b => b.id === babId);
}

export function getAbyatByBabId(babId: string): ShatibiyyahBayt[] {
  return SHATIBIYYAH_ABYAT.filter(b => b.babId === babId);
}

export function searchShatibiyyah(query: string): ShatibiyyahBayt[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return SHATIBIYYAH_ABYAT;

  // Check if searching by Bayt number
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
      b.englishTranslation.toLowerCase().includes(clean) ||
      b.qiraatExplanation.toLowerCase().includes(clean) ||
      (b.keyTheme && b.keyTheme.toLowerCase().includes(clean)) ||
      (b.ramzBreakdown && b.ramzBreakdown.some(r => r.meaning.toLowerCase().includes(clean) || r.imamOrRawi.toLowerCase().includes(clean) || r.symbol.includes(clean)))
    );
  });
}
