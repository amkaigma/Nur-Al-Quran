export interface LibraryBook {
  id: string;
  slug: string;
  title: string;
  arabicTitle: string;
  author: string;
  authorBio: string;
  category: 'hadith' | 'adhkar' | 'knowledge' | 'seerah' | 'fiqh' | 'quran_studies';
  categoryLabel: string;
  description: string;
  whatItTeaches: string;
  importance: string;
  keyLessons: string[];
  originalLanguage: string;
  availableTranslations: ('Arabic' | 'English' | 'Hausa')[];
  authenticityInfo: string;
  hadithCount?: number;
  chaptersCount?: number;
  featuredQuote?: {
    arabic: string;
    english: string;
    hausa?: string;
    reference: string;
  };
  samplePassages: {
    id: string;
    title: string;
    arabicText: string;
    transliteration?: string;
    englishTranslation: string;
    hausaTranslation?: string;
    reference: string;
    grading?: string;
    targetCount?: number;
    benefits?: string;
  }[];
}

export interface LibraryCategory {
  id: 'hadith' | 'adhkar' | 'knowledge' | 'seerah' | 'fiqh' | 'quran_studies';
  title: string;
  arabicTitle: string;
  description: string;
  iconName: string;
  bookCount: number;
}

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  {
    id: 'hadith',
    title: 'Hadith Collections',
    arabicTitle: 'كتب الحديث الشريف',
    description: 'The canonical compilations of the sayings, actions, and approvals of the Prophet Muhammad ﷺ.',
    iconName: 'BookMarked',
    bookCount: 12
  },
  {
    id: 'adhkar',
    title: 'Daily Adhkar & Duas',
    arabicTitle: 'الأذكار والأدعية اليومية',
    description: 'Authentic prophetic supplications for morning, evening, prayer, protection, and daily life.',
    iconName: 'HeartHandshake',
    bookCount: 12
  },
  {
    id: 'knowledge',
    title: 'Islamic Knowledge & Aqidah',
    arabicTitle: 'العقيدة والعلوم الإسلامية',
    description: 'Foundational works on Tawhid, creed, spirituality, and authentic Islamic understanding.',
    iconName: 'Compass',
    bookCount: 9
  },
  {
    id: 'seerah',
    title: 'Seerah & Islamic History',
    arabicTitle: 'السيرة النبوية والتاريخ',
    description: 'The blessed biography of the Messenger ﷺ, stories of the Prophets, and the Rightly Guided Caliphs.',
    iconName: 'Milestone',
    bookCount: 6
  },
  {
    id: 'fiqh',
    title: 'Fiqh & Worship (Ibadah)',
    arabicTitle: 'الفقه والعبادات',
    description: 'Practical guides to Taharah (purification), Salah, Zakah, Sawm (fasting), and Islamic rulings.',
    iconName: 'ShieldCheck',
    bookCount: 8
  },
  {
    id: 'quran_studies',
    title: 'Quranic Studies & Tajweed',
    arabicTitle: 'علوم القرآن والتجويد',
    description: 'Tafsir, Tajweed rules, memorization methodologies, Asbab an-Nuzul, and Qira’at science.',
    iconName: 'BookOpen',
    bookCount: 7
  }
];

export const ISLAMIC_BOOKS: LibraryBook[] = [
  // ========================================================
  // CATEGORY A: HADITH COLLECTIONS (12 Books)
  // ========================================================
  {
    id: 'bukhari',
    slug: 'sahih-al-bukhari',
    title: 'Sahih al-Bukhari',
    arabicTitle: 'صحيح البخاري',
    author: 'Imam Muhammad ibn Ismail al-Bukhari (194–256 AH)',
    authorBio: 'The master of Hadith masters, born in Bukhara (Uzbekistan). Spent 16 years traveling across Khurasan, Iraq, Hijaz, and Egypt gathering, examining, and authenticating over 600,000 narrations.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'The most authentic book after the Holy Quran in Islamic consensus. Formatted into 97 thematic books spanning faith, prayer, ethics, transactions, and prophetic manners.',
    whatItTeaches: 'The purest transmission of prophetic actions, statements, and approvals with unbroken, scrutinized chains of narration (Isnad).',
    importance: 'Considered by Ahl us-Sunnah wal-Jama’ah as the paramount canonical text second only to the Quran in authority and authenticity.',
    keyLessons: [
      'Actions are judged strictly by intentions (Ikhlas).',
      'The preservation of the Sunnah through rigorous verification of narrators.',
      'Comprehensive guidance covering all spheres of personal and communal life.'
    ],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: '100% Sahih (Strict consensus of Islamic scholarship across all generations).',
    hadithCount: 7563,
    chaptersCount: 97,
    featuredQuote: {
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      english: 'Actions are only judged by intentions, and every person will have only what they intended.',
      hausa: 'Lallai ayyuka suna tare da niyyoyi ne, kuma kowane mutum yana da sakamakon abin da ya yi niyya.',
      reference: 'Sahih al-Bukhari, Hadith 1'
    },
    samplePassages: [
      {
        id: 'bukhari-1',
        title: 'The Revelation & Sincerity of Intention',
        arabicText: 'سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
        englishTranslation: 'Narrated Umar bin Al-Khattab: I heard Allah’s Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for."',
        hausaTranslation: 'Daga Umar bn Al-Khattab (RA) ya ce: Na ji Manzon Allah (SAW) yana cewa: "Ayyuka kawai suna tare da niyya ne, kuma kowane mutum yana da abin da ya yi niyya. Don haka duk wanda hijirarsa ta kasance saboda duniya ne ko kuma saboda mace da zai aura, to hijirarsa tana ga abin da ya yi hijira dominsa."',
        reference: 'Sahih al-Bukhari, Book 1, Hadith 1',
        grading: 'Sahih (Muttafaq Alayh)'
      },
      {
        id: 'bukhari-2',
        title: 'The Best of You are Those Who Learn the Quran',
        arabicText: 'عَنْ عُثْمَانَ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ".',
        englishTranslation: 'Narrated Uthman bin Affan: The Prophet (ﷺ) said, "The best among you are those who learn the Quran and teach it to others."',
        hausaTranslation: 'Daga Uthman (RA) daga Annabi (SAW) ya ce: "Mafi alherin cikinku shi ne wanda ya koyi Al-Kur\'ani kuma ya koyar da shi."',
        reference: 'Sahih al-Bukhari, Book 66, Hadith 5027',
        grading: 'Sahih'
      }
    ]
  },
  {
    id: 'muslim',
    slug: 'sahih-muslim',
    title: 'Sahih Muslim',
    arabicTitle: 'صحيح مسلم',
    author: 'Imam Muslim ibn al-Hajjaj an-Naysaburi (204–261 AH)',
    authorBio: 'Celebrated Persian-Arab scholar from Nishapur. Renowned for his unmatched systematic categorization, collecting all narrations of a single Hadith in one comprehensive chapter.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'One of the Sahihayn (the two pristine authentic collections). Renowned worldwide for seamless textual arrangement and thematic purity without interspersing personal commentary.',
    whatItTeaches: 'The complete theological and legal edifice of Islam, emphasizing precise transmission of wording.',
    importance: 'Regarded alongside Sahih al-Bukhari as the gold standard of authentic Sunnah.',
    keyLessons: [
      'Definition of Islam, Iman, and Ihsan as documented in the Hadith of Jibril.',
      'Mercy, brotherhood, and moral integrity as cornerstones of faith.'
    ],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: '100% Sahih (Unanimous scholarly consensus).',
    hadithCount: 7500,
    chaptersCount: 56,
    featuredQuote: {
      arabic: 'الدِّينُ النَّصِيحَةُ، قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ',
      english: 'Religion is sincere advice. We asked: To whom? He said: To Allah, His Book, His Messenger, the leaders of the Muslims, and their common folk.',
      hausa: 'Addini nasiha ne. Muka ce: Ga wa? Ya ce: Ga Allah, da Littafinsa, da Manzonsa, da shugabannin musulmi, da talakawansu.',
      reference: 'Sahih Muslim, Hadith 55'
    },
    samplePassages: [
      {
        id: 'muslim-1',
        title: 'The Great Hadith of Jibril (Islam, Iman, Ihsan)',
        arabicText: 'عَنْ عُمَرَ بْنِ الْخَطَّابِ قَالَ: بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعَرِ لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ... قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ، قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ.',
        englishTranslation: 'Narrated Umar: While we were sitting with Allah’s Messenger, a man came with intensely white clothes and intensely black hair... He said: "Inform me about Ihsan." The Prophet replied: "That you worship Allah as if you see Him, and though you do not see Him, He sees you."',
        hausaTranslation: 'Daga Umar (RA) ya ce: Wata rana muna zaune tare da Manzon Allah (SAW) sai ga wani mutum ya bullo mana, mai matukar fararen kaya da bakin gashi... Ya ce: "Bani labari game da Ihsani." Annabi ya ce: "Ka bauta wa Allah kamar kana ganinSa, idan ba ka ganinSa to lallai Shi Yana ganinka."',
        reference: 'Sahih Muslim, Book 1, Hadith 8',
        grading: 'Sahih'
      }
    ]
  },
  {
    id: 'abu-dawud',
    slug: 'sunan-abu-dawud',
    title: 'Sunan Abu Dawud',
    arabicTitle: 'سنن أبي داود',
    author: 'Imam Abu Dawud Sulayman ibn al-Ash’ath as-Sijistani (202–275 AH)',
    authorBio: 'Foremost scholar of legal Hadith (Ahadith al-Ahkam), praised by Ahmad ibn Hanbal for his profound jurisprudence.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'One of the six major Sunan collections. Dedicated specifically to legal traditions and rulings governing worship and societal interactions.',
    whatItTeaches: 'Detailed prophetic evidence for Fiqh rulings from Taharah to inheritance and governance.',
    importance: 'The premier reference for jurists studying comparative Islamic jurisprudence.',
    keyLessons: ['Precision in practical rulings', 'Understanding how Sahabah derived law from the Prophet ﷺ.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Overwhelmingly Sahih and Hasan traditions; Abu Dawud explicitly graded or noted weak narrations.',
    hadithCount: 5274,
    chaptersCount: 43,
    samplePassages: [
      {
        id: 'abu-dawud-1',
        title: 'Seeking Sacred Knowledge',
        arabicText: 'مَنْ سَلَكَ طَرِيقًا يَطْلُبُ فِيهِ عِلْمًا سَلَكَ اللَّهُ بِهِ طَرِيقًا مِنْ طُرُقِ الْجَنَّةِ، وَإِنَّ الْمَلاَئِكَةَ لَتَضَعُ أَجْنِحَتَهَا رِضًا لِطَالِبِ الْعِلْمِ.',
        englishTranslation: 'Whoever travels a path seeking knowledge, Allah will place him on a path from the paths of Paradise. And indeed the angels lower their wings in pleasure for the seeker of knowledge.',
        hausaTranslation: 'Duk wanda ya bi wata hanya yana neman ilimi a cikinta, Allah zai saukaka masa hanyar zuwa Aljanna.',
        reference: 'Sunan Abu Dawud, Hadith 3641',
        grading: 'Sahih (Al-Albani)'
      }
    ]
  },
  {
    id: 'tirmidhi',
    slug: 'jami-at-tirmidhi',
    title: 'Jami’ at-Tirmidhi',
    arabicTitle: 'جامع الترمذي',
    author: 'Imam Abu Isa Muhammad ibn Isa at-Tirmidhi (209–279 AH)',
    authorBio: 'Student of Imam al-Bukhari. Celebrated for pioneering precise comparative Hadith terminology and noting jurists’ consensus.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'A masterwork combining Hadith, legal opinions of the early scholars (Fuqaha), and systematic Hadith criticism.',
    whatItTeaches: 'How scholars of Madinah, Kufa, and Basra used Hadith to derive verdicts.',
    importance: 'Introduced the standard categorizations of Hasan, Sahih, and Gharib into Islamic jurisprudence.',
    keyLessons: ['Openness to scholarly consensus', 'The beauty of prophetic character.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Rigorous scholarly grading accompanies each chapter.',
    hadithCount: 3956,
    chaptersCount: 49,
    samplePassages: [
      {
        id: 'tirmidhi-1',
        title: 'Love for Allah and Good Manners',
        arabicText: 'إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ وَأَقْرَبِكُمْ مِنِّي مَجْلِسًا يَوْمَ الْقِيَامَةِ أَحَاسِنَكُمْ أَخْلاَقًا.',
        englishTranslation: 'The dearest and nearest of you to me on the Day of Resurrection will be those with the best character.',
        reference: 'Jami’ at-Tirmidhi, Hadith 2018',
        grading: 'Hasan'
      }
    ]
  },
  {
    id: 'nasai',
    slug: 'sunan-an-nasai',
    title: 'Sunan an-Nasa’i (Al-Mujtaba)',
    arabicTitle: 'سنن النسائي (المجتبى)',
    author: 'Imam Ahmad ibn Shu’ayb an-Nasa’i (214–303 AH)',
    authorBio: 'Egyptian and Khurasani giant of Hadith criticism, praised for strict conditions equal to or surpassing Imam Muslim in narrator appraisal.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'Renowned for microscopic scrutiny of subtle defects in narrations (Ilal) and flawless organization of practical worship.',
    whatItTeaches: 'Nuances of prophetic commands and intricate variations in Isnad.',
    importance: 'Third in strictness of authenticity among the six canonical books of Hadith.',
    keyLessons: ['Meticulous attention to worship details', 'Avoiding innovation.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Very high proportion of Sahih narrations.',
    hadithCount: 5758,
    chaptersCount: 51,
    samplePassages: [
      {
        id: 'nasai-1',
        title: 'Purity in Worship',
        arabicText: 'إِنَّ اللَّهَ لاَ يَقْبَلُ مِنَ الْعَمَلِ إِلاَّ مَا كَانَ لَهُ خَالِصًا وَابْتُغِيَ بِهِ وَجْهُهُ.',
        englishTranslation: 'Indeed Allah does not accept any deed unless it is done purely for Him and seeking His Countenance.',
        reference: 'Sunan an-Nasa’i, Hadith 3140',
        grading: 'Sahih (Al-Albani)'
      }
    ]
  },
  {
    id: 'ibn-majah',
    slug: 'sunan-ibn-majah',
    title: 'Sunan Ibn Majah',
    arabicTitle: 'سنن ابن ماجه',
    author: 'Imam Muhammad ibn Yazid Ibn Majah al-Qazwini (209–273 AH)',
    authorBio: 'Distinguished scholar from Qazwin. Traveled extensively to Iraq, Basra, Kufa, Damascus, Egypt, and Mecca to compile Sunan.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'The sixth book of the Kutub as-Sittah. Celebrated for its exceptional chapter headings and recording beneficial rare narrations.',
    whatItTeaches: 'Comprehensive Islamic law and spiritual purification.',
    importance: 'Completes the classical Six Canonical Books with unique supplementary narrations.',
    keyLessons: ['Moderation in worldly pursuits', 'Importance of following the Sunnah strictly.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Graded by classical and contemporary muhaddithin.',
    hadithCount: 4341,
    chaptersCount: 37,
    samplePassages: [
      {
        id: 'ibn-majah-1',
        title: 'Obligation of Seeking Knowledge',
        arabicText: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ.',
        englishTranslation: 'Seeking knowledge is an obligation upon every Muslim.',
        reference: 'Sunan Ibn Majah, Hadith 224',
        grading: 'Sahih (Al-Albani)'
      }
    ]
  },
  {
    id: 'muwatta',
    slug: 'muwatta-imam-malik',
    title: 'Muwatta Imam Malik',
    arabicTitle: 'موطأ الإمام مالك',
    author: 'Imam Malik ibn Anas (93–179 AH)',
    authorBio: 'Imam Dar al-Hijrah (The Imam of Madinah). Spent his life teaching in the Prophet’s Mosque, upholding the authentic living practice of Madinah.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'The earliest surviving compiled legal and Hadith manual in Islamic history. Unites prophetic traditions with rulings of the Sahabah and Tabi’un.',
    whatItTeaches: 'The pristine consensus and continuous communal practice of the people of Madinah.',
    importance: 'Shaykh ash-Shafi’i stated: "There is no book on earth after the Book of Allah more sound than the Muwatta of Malik."',
    keyLessons: ['Adherence to the living Sunnah', 'Simplicity and dignity in worship.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Highest echelon of early Islamic scholarship.',
    hadithCount: 1858,
    chaptersCount: 61,
    samplePassages: [
      {
        id: 'muwatta-1',
        title: 'Prophetic Purpose',
        arabicText: 'بُعِثْتُ لِأُتَمِّمَ حُسْنَ الأَخْلاَقِ.',
        englishTranslation: 'I was sent only to perfect noble character.',
        hausaTranslation: 'Ba a aiko ni ba face domin in cika kyawawan dabi\'u.',
        reference: 'Muwatta Malik, Book 47, Hadith 8',
        grading: 'Sahih'
      }
    ]
  },
  {
    id: 'riyad-salihin',
    slug: 'riyad-as-salihin',
    title: 'Riyad as-Salihin (Gardens of the Righteous)',
    arabicTitle: 'رياض الصالحين',
    author: 'Imam Yahya ibn Sharaf an-Nawawi (631–676 AH)',
    authorBio: 'Master Shafi’i jurist and ascetic scholar of Damascus. Known for ascetic devotion, intellectual output, and unparalleled sincerity.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'The world’s most widely read Hadith manual for daily spiritual and ethical growth. Arranged into 372 chapters covering every aspect of moral living.',
    whatItTeaches: 'Cultivating inner godliness, patience, humility, generosity, and remembrance of Allah.',
    importance: 'Studied in mosques, study circles, and households globally across all Islamic schools.',
    keyLessons: ['Taqwa in private and public', 'Patience through trials', 'Consistent charity and kindness.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Carefully selected authentic narrations primarily from Bukhari and Muslim.',
    hadithCount: 1896,
    chaptersCount: 372,
    samplePassages: [
      {
        id: 'riyad-1',
        title: 'On Sincerity & Sincere Repentance',
        arabicText: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى أَجْسَامِكُمْ وَلاَ إِلَى صُوَرِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ".',
        englishTranslation: 'Abu Hurairah narrated that Allah’s Messenger (ﷺ) said: "Verily, Allah does not look at your bodies or your appearances, but He looks at your hearts and your deeds."',
        hausaTranslation: 'Daga Abu Hurairah (RA) ya ce: Manzon Allah (SAW) ya ce: "Lallai Allah ba Ya duba zuwa ga jikunanku ko surorinku, amma Yana duba zuwa ga zukatanku da ayyukanku."',
        reference: 'Riyad as-Salihin, Chapter 1, Hadith 7',
        grading: 'Sahih (Muslim)'
      }
    ]
  },
  {
    id: 'adab-mufrad',
    slug: 'al-adab-al-mufrad',
    title: 'Al-Adab Al-Mufrad',
    arabicTitle: 'الأدب المفرد',
    author: 'Imam Muhammad ibn Ismail al-Bukhari (194–256 AH)',
    authorBio: 'Compiler of Sahih al-Bukhari who dedicated this independent masterwork exclusively to manners, social etiquette, and family relations.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'An exhaustive encyclopedic reference on Islamic adab (etiquette), caring for parents, neighbors, relatives, and orphans.',
    whatItTeaches: 'How to live with gentleness, forgiveness, generosity, and respect in everyday social interactions.',
    importance: 'The foundational handbook of Islamic manners.',
    keyLessons: ['Filial piety (Birr al-Walidayn)', 'Rights of neighbors regardless of background', 'Subduing anger.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Graded by muhaddithin with scholarly notes on chain strength.',
    hadithCount: 1322,
    chaptersCount: 644,
    samplePassages: [
      {
        id: 'adab-1',
        title: 'Kindness to Parents',
        arabicText: 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ.',
        englishTranslation: 'The pleasure of the Lord is in the pleasure of the father, and the displeasure of the Lord is in the displeasure of the father.',
        reference: 'Al-Adab Al-Mufrad, Hadith 2',
        grading: 'Sahih (Al-Albani)'
      }
    ]
  },
  {
    id: 'bulugh-maram',
    slug: 'bulugh-al-maram',
    title: 'Bulugh al-Maram min Adillat al-Ahkam',
    arabicTitle: 'بلوغ المرام من أدلة الأحكام',
    author: 'Al-Hafidh Ibn Hajar al-Asqalani (773–852 AH)',
    authorBio: 'The Amir al-Mu’minin in Hadith of his era, author of Fath al-Bari (the definitive commentary on Sahih al-Bukhari).',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'A concise collection of Hadiths upon which Islamic legal jurisprudence is constructed, noting narrator integrity and differences.',
    whatItTeaches: 'Evidence-based Fiqh with direct Hadith proofs for each ruling.',
    importance: 'The foremost curriculum text in Islamic universities worldwide for students of Fiqh.',
    keyLessons: ['How legal rulings originate from authentic texts', 'Nuances of textual validation.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Meticulously appraised by Ibn Hajar after each tradition.',
    hadithCount: 1596,
    chaptersCount: 16,
    samplePassages: [
      {
        id: 'bulugh-1',
        title: 'Purification with Water',
        arabicText: 'هُوَ الطَّهُورُ مَاؤُهُ الْحِلُّ مَيْتَتُهُ.',
        englishTranslation: 'Regarding the sea: "Its water is pure and its dead are lawful to eat."',
        reference: 'Bulugh al-Maram, Book 1, Hadith 1',
        grading: 'Sahih'
      }
    ]
  },
  {
    id: 'forty-nawawi',
    slug: 'forty-hadith-nawawi',
    title: 'Al-Arba’in an-Nawawiyyah (40 Hadith of Imam Nawawi)',
    arabicTitle: 'الأربعون النووية',
    author: 'Imam Yahya ibn Sharaf an-Nawawi (631–676 AH)',
    authorBio: 'Celebrated scholar whose 40 (actually 42) traditions encompass the complete pivots of Islamic creed, law, and morality.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'The most memorized Hadith primer on Earth. Contains 42 comprehensive traditions that summarize the foundational essence of Islam.',
    whatItTeaches: 'The core tenets every Muslim must know and practice in daily life.',
    importance: 'Imam Ibn Daqiq al-Id stated that every tradition in this compilation is a great fundamental principle of Islam.',
    keyLessons: ['Halal is clear and Haram is clear', 'Leaving what does not concern you', 'Loving for your brother what you love for yourself.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Virtually all traditions are drawn from Bukhari and Muslim.',
    hadithCount: 42,
    chaptersCount: 42,
    samplePassages: [
      {
        id: 'nawawi-1',
        title: 'Hadith 13: True Faith and Brotherhood',
        arabicText: 'عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ، خَادِمِ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ".',
        englishTranslation: 'Abu Hamzah Anas bin Malik reported that the Prophet (ﷺ) said: "None of you truly believes until he loves for his brother what he loves for himself."',
        hausaTranslation: 'Daga Anas bn Malik (RA) daga Annabi (SAW) ya ce: "Dayanku ba zai zama mumini na gaskiya ba har sai ya so wa dan\'uwansa abin da yake so wa kansa."',
        reference: '40 Hadith Nawawi, Hadith 13',
        grading: 'Sahih (Bukhari & Muslim)'
      }
    ]
  },
  {
    id: 'umdat-ahkam',
    slug: 'umdat-al-ahkam',
    title: 'Umdat al-Ahkam min Kalam Khayr al-Anam',
    arabicTitle: 'عمدة الأحكام من كلام خير الأنام',
    author: 'Al-Hafidh Abdul Ghani al-Maqdisi (541–600 AH)',
    authorBio: 'Renowned Hanbali master of Hadith from Damascus, respected for his piety and strict reliance on the Sahihayn.',
    category: 'hadith',
    categoryLabel: 'Hadith Collections',
    description: 'A curated compilation of legal rulings compiled strictly from Hadiths agreed upon by both Bukhari and Muslim.',
    whatItTeaches: 'Unimpeachable prophetic evidence for Salah, Taharah, Sawm, and contracts.',
    importance: 'The bedrock syllabus for legal verification in the Islamic tradition.',
    keyLessons: ['Unity upon agreed texts', 'Purity of worship and legal contracts.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: '100% Muttafaq Alayh (Agreed upon by Bukhari & Muslim).',
    hadithCount: 430,
    chaptersCount: 16,
    samplePassages: [
      {
        id: 'umdat-1',
        title: 'Purification is Prerequisite for Prayer',
        arabicText: 'لاَ يَقْبَلُ اللَّهُ صَلاَةَ أَحَدِكُمْ إِذَا أَحْدَثَ حَتَّى يَتَوَضَّأَ.',
        englishTranslation: 'Allah does not accept the prayer of anyone who breaks wudu until he performs ablution.',
        reference: 'Umdat al-Ahkam, Hadith 2',
        grading: 'Sahih (Bukhari & Muslim)'
      }
    ]
  },

  // ========================================================
  // CATEGORY B: DAILY ADHKAR & SUPPLICATIONS (12 Works)
  // ========================================================
  {
    id: 'hisnul-muslim',
    slug: 'hisnul-muslim',
    title: 'Hisnul Muslim (Fortress of the Muslim)',
    arabicTitle: 'حصن المسلم من أذكار الكتاب والسنة',
    author: 'Dr. Sa’id ibn Ali ibn Wahf al-Qahtani (1371–1440 AH)',
    authorBio: 'Prominent Saudi scholar and prolific author who dedicated his life to collecting and verifying authentic prophetic invocations.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'The most popular, pocket-sized collection of authentic prophetic supplications for every daily occasion from dawn until dusk.',
    whatItTeaches: 'How to envelop one’s day in constant mindfulness of Allah and seek divine protection.',
    importance: 'Translated into over 80 languages, universally accepted for its scholarly rigor and ease of daily use.',
    keyLessons: ['Morning and evening fortification', 'Finding peace through Dhikr', 'Relying on Allah alone.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Every dua is cross-referenced with Bukhari, Muslim, and the Sunan with strict authenticity verification.',
    hadithCount: 267,
    chaptersCount: 132,
    featuredQuote: {
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
      english: 'We have entered the morning and the kingdom belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone.',
      hausa: 'Mun wayi gari kuma mulki ya wayi gari na Allah ne, dukkan yabo na Allah ne, babu abin bautawa da gaskiya sai Allah Shi kadai.',
      reference: 'Hisnul Muslim, Chapter 27'
    },
    samplePassages: [
      {
        id: 'hisn-1',
        title: 'Morning Fortification: Sayyid al-Istighfar',
        arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ.',
        transliteration: 'Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana ‘abduk, wa ana ‘ala ‘ahdika wa wa’dika mastata’t, a’udhu bika min sharri ma sana’t, abu’u laka bi ni’matika ‘alay, wa abu’u bi dhanbi faghfir li, fa innahu la yaghfiru-dh-dhunuba illa Ant.',
        englishTranslation: 'O Allah, You are my Lord, there is none worthy of worship except You. You created me and I am Your slave, and I adhere to Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.',
        hausaTranslation: 'Ya Allah, Kai ne Ubangijina, babu abin bautawa da gaskiya sai Kai. Ka halicce ni kuma ni bawanka ne, kuma ina kan alkawarinka da wa\'adinka gwargwadon ikona. Ina neman tsarinka daga sharrin abin da na aikata, ina gode maKa da ni\'imominKa a kaina, kuma na amsa laifina, don haka Ka gafarta mini, domin babu mai gafarta zunubai sai Kai.',
        reference: 'Sahih al-Bukhari, Hadith 6306',
        targetCount: 1,
        benefits: 'Whoever says it with conviction in the morning and dies before evening will be among the people of Paradise (Bukhari).'
      },
      {
        id: 'hisn-2',
        title: 'Protection from All Harm (3 Times)',
        arabicText: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
        transliteration: 'Bismillahi-lladhi la yadurru ma’as-mihi shay’un fil-ardi wa la fis-sama’i wa Huwas-Sami’ul-‘Alim.',
        englishTranslation: 'In the Name of Allah with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
        hausaTranslation: 'Da sunan Allah wanda babu wani abu a kasa ko a sama da zai iya cutarwa tare da sunanSa, kuma Shi ne Mai ji, Masani.',
        reference: 'Abu Dawud (5088), At-Tirmidhi (3388)',
        targetCount: 3,
        benefits: 'Whoever recites this three times morning and evening will not be harmed by anything.'
      }
    ]
  },
  {
    id: 'morning-adhkar',
    slug: 'morning-adhkar',
    title: 'Authentic Morning Adhkar (Adhkar as-Sabah)',
    arabicTitle: 'أذكار الصباح الصحيحة',
    author: 'Collected from Canonical Sunnah Compilations',
    authorBio: 'Compiled from authentic narrations verified by classical scholars and documented in the Sahihayn and Sunan.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'The prescribed daily morning remembrances to be recited after Fajr until sunrise, providing spiritual armor and divine protection.',
    whatItTeaches: 'Starting each day with gratitude, seeking guidance, and repelling grief and anxiety.',
    importance: 'Imam Ibn al-Qayyim described the morning and evening Adhkar as the armor that protects a person throughout the day.',
    keyLessons: ['Morning gratitude', 'Seeking provision and beneficial knowledge', 'Protection from all evils.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: '100% authenticated from the Sunnah with repetition counts.',
    hadithCount: 24,
    samplePassages: [
      {
        id: 'm-1',
        title: 'Seeking Beneficial Knowledge and Halal Provision',
        arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً.',
        transliteration: 'Allahumma inni as’aluka ‘ilman nafi’an, wa rizqan tayyiban, wa ‘amalan mutaqabbalan.',
        englishTranslation: 'O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.',
        hausaTranslation: 'Ya Allah, ina rokonKa ilimi mai amfani, da arziki mai kyau, da aiki karbabbe.',
        reference: 'Sunan Ibn Majah (925)',
        targetCount: 1,
        benefits: 'Recited after the Fajr prayer for comprehensive barakah in daily pursuit.'
      },
      {
        id: 'm-2',
        title: 'Praising Allah by the Number of His Creation (3 Times)',
        arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.',
        transliteration: 'Subhanallahi wa bihamdihi, ‘adada khalqihi, wa rida nafsihi, wa zinata ‘arshihi, wa midada kalimatih.',
        englishTranslation: 'Glory be to Allah and His is the praise, according to the number of His creation, according to His pleasure, according to the weight of His Throne, and according to the ink of His words.',
        hausaTranslation: 'Tsarki ya tabbata ga Allah da yabonsa, gwargwadon adadin halittunSa, da yardar kansa, da nauyin Al\'arshinSa, da tawadar kalmominSa.',
        reference: 'Sahih Muslim (2726)',
        targetCount: 3,
        benefits: 'Weighs heavier than hours of individual worship and dhikr.'
      }
    ]
  },
  {
    id: 'evening-adhkar',
    slug: 'evening-adhkar',
    title: 'Authentic Evening Adhkar (Adhkar al-Masa’)',
    arabicTitle: 'أذكار المساء الصحيحة',
    author: 'Collected from Canonical Sunnah Compilations',
    authorBio: 'Grounded in the authentic narrations of the Prophet ﷺ recited from Asr until Isha.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'The prescribed evening supplications for safety from nocturnal harm, tranquil hearts, and peaceful night rest.',
    whatItTeaches: 'Concluding the day in repentance, divine refuge, and reflection on blessings.',
    importance: 'Essential companion to the morning Adhkar for 24-hour spiritual shield.',
    keyLessons: ['Gratitude for the day’s guidance', 'Refuge from the torment of the grave and Hellfire.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Verified from Bukhari, Muslim, Tirmidhi, and Abu Dawud.',
    hadithCount: 22,
    samplePassages: [
      {
        id: 'e-1',
        title: 'Refuge in the Perfect Words of Allah (3 Times)',
        arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
        transliteration: 'A’udhu bi kalimatillahit-tammati min sharri ma khalaq.',
        englishTranslation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        hausaTranslation: 'Ina neman tsari da cikakkun kalmomin Allah daga sharrin abin da Ya halitta.',
        reference: 'Sahih Muslim (2709)',
        targetCount: 3,
        benefits: 'No creature, scorpion, snake, or venomous pest will harm the reciter that night.'
      }
    ]
  },
  {
    id: 'sleeping-adhkar',
    slug: 'sleeping-adhkar',
    title: 'Adhkar Before Sleeping (Adhkar an-Nawm)',
    arabicTitle: 'أذكار النوم',
    author: 'Collected from the Sunnah',
    authorBio: 'The pristine prophetic bedtime ritual documented by the companions.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'Supplications, Quranic chapters (Ayat al-Kursi, Surah al-Mulk, the Mu’awwidhat), and tasbih before sleeping.',
    whatItTeaches: 'Submitting soul to Allah, preparing for sleep as the minor death, and waking in peace.',
    importance: 'Guarantees angelic guardianship throughout the night.',
    keyLessons: ['Tasbih Fatimi (33 SubhanAllah, 33 Alhamdulillah, 34 Allahu Akbar)', 'Recitation of Ayat al-Kursi.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Documented in Bukhari and Muslim.',
    hadithCount: 16,
    samplePassages: [
      {
        id: 's-1',
        title: 'Surrendering Soul to Allah',
        arabicText: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.',
        transliteration: 'Bismika Rabbi wada’tu janbi wa bika arfa’uh, in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi ‘ibadakas-salihin.',
        englishTranslation: 'In Your name, my Lord, I lay down my side and in Your name I raise it. If You take my soul, have mercy upon it, and if You send it back, protect it with that which You protect Your righteous slaves.',
        reference: 'Sahih al-Bukhari (6320), Muslim (2714)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'after-salah-adhkar',
    slug: 'after-salah-adhkar',
    title: 'Adhkar After the Obligatory Prayers',
    arabicTitle: 'الأذكار بعد الصلاة المكتوبة',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'Authentic invocations practiced by the Messenger ﷺ immediately following the Taslim.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'The prescribed post-prayer Istighfar, Ayat al-Kursi, Tasbih (33x), and declarations of Tawhid.',
    whatItTeaches: 'Cementing the reward of Salah and seeking forgiveness for any deficiencies during worship.',
    importance: 'The Prophet ﷺ stated that reciting Ayat al-Kursi after every obligatory prayer leaves only death between a person and Paradise.',
    keyLessons: ['Three-fold Istighfar', 'Ayat al-Kursi connection', 'Completing 100 praises.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Sahih Muslim, Sunan an-Nasa’i.',
    hadithCount: 10,
    samplePassages: [
      {
        id: 'as-1',
        title: 'Immediate Istighfar & Peace Supplication',
        arabicText: 'أَسْتَغْفِرُ اللَّهَ (ثَلاَثًا)، اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ.',
        transliteration: 'Astaghfirullah (3x). Allahumma Antas-Salamu wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.',
        englishTranslation: 'I seek Allah’s forgiveness (3 times). O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honor.',
        reference: 'Sahih Muslim (591)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'waking-adhkar',
    slug: 'waking-adhkar',
    title: 'Supplications Upon Waking Up',
    arabicTitle: 'أذكار الاستيقاظ من النوم',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'Praises of resurrection and daily gratitude for the return of the soul.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'The first words upon opening one’s eyes, acknowledging Allah for restoring life after sleep.',
    whatItTeaches: 'Immediate spiritual wakefulness and recognizing each day as a new gift of life.',
    importance: 'Unties the first knot of Shaytan from one’s sleep.',
    keyLessons: ['Morning renewal', 'Praises of resurrection.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Sahih al-Bukhari.',
    hadithCount: 5,
    samplePassages: [
      {
        id: 'w-1',
        title: 'Gratitude for the Return of Life',
        arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.',
        transliteration: 'Alhamdu lillahil-ladhi ahyana ba’da ma amatana wa ilaihin-nushur.',
        englishTranslation: 'All praise is for Allah Who gave us life after having caused us to die, and unto Him is the resurrection.',
        reference: 'Sahih al-Bukhari (6312)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'protection-adhkar',
    slug: 'protection-adhkar',
    title: 'Supplications for Divine Protection & Safety',
    arabicTitle: 'أدعية الحفظ والوقاية',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'Authentic formulas for protection from evil eye (Ayn), magic, jealousy, and calamity.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'Comprehensive prophetic prayers seeking safety from harm, anxiety, sadness, cowardice, and debt.',
    whatItTeaches: 'Spiritual fortification against unseen and seen trials.',
    importance: 'A divine refuge that removes helplessness and despair.',
    keyLessons: ['Seeking refuge from anxiety and debt', 'Protection against calamity.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Sahih al-Bukhari & Abu Dawud.',
    hadithCount: 14,
    samplePassages: [
      {
        id: 'p-1',
        title: 'Dua Against Anxiety, Grief, and Overwhelming Debt',
        arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ.',
        transliteration: 'Allahumma inni a’udhu bika minal-hammi wal-hazan, wal-‘ajzi wal-kasal, wal-bukhli wal-jubn, wa dala’id-dayni wa ghalabatir-rijal.',
        englishTranslation: 'O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from miserliness and cowardice, from the burden of debt and being overpowered by men.',
        reference: 'Sahih al-Bukhari (2893)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'travel-adhkar',
    slug: 'travel-adhkar',
    title: 'Supplications for Travel & Journeys',
    arabicTitle: 'دعاء السفر والركوب',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'Invocations when boarding a vehicle, flying, or embarking on long journeys.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'Prophetic prayers for protection of family, wealth, and destination while traveling.',
    whatItTeaches: 'Remembering Allah when setting out and returning safely.',
    importance: 'The traveler’s prayer is among those answered without delay.',
    keyLessons: ['Takbir when ascending, Tasbih when descending', 'Dua al-Safar.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Sahih Muslim.',
    hadithCount: 8,
    samplePassages: [
      {
        id: 'tr-1',
        title: 'The Great Travel Supplication',
        arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى.',
        transliteration: 'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun. Allahumma inna nas’aluka fi safarina hadhal-birra wat-taqwa, wa minal-‘amali ma tarda.',
        englishTranslation: 'Glory be to Him Who has subjected this to us, and we could never have achieved it by ourselves. And indeed to our Lord we shall return. O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You.',
        reference: 'Sahih Muslim (1342)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'eating-drinking-adhkar',
    slug: 'eating-drinking-adhkar',
    title: 'Supplications for Eating & Drinking',
    arabicTitle: 'أذكار الطعام والشراب',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'Etiquette and prayers before and after meals.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'Etiquette taught by the Prophet ﷺ: eating with right hand, saying Bismillah, and praising Allah upon finishing.',
    whatItTeaches: 'Turning physical sustenance into an act of worship and gratitude.',
    importance: 'Brings barakah into food and repels Shaytan from sharing the meal.',
    keyLessons: ['Bismillah at the beginning', 'Alhamdulillah at the end.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Sahih al-Bukhari & Abu Dawud.',
    hadithCount: 6,
    samplePassages: [
      {
        id: 'et-1',
        title: 'Gratitude After Meals',
        arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ.',
        transliteration: 'Alhamdu lillahil-ladhi at’amana wa saqana wa ja’alana muslimin.',
        englishTranslation: 'All praise is for Allah Who has fed us, given us drink, and made us Muslims.',
        reference: 'Sunan Abu Dawud (3850)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'home-adhkar',
    slug: 'home-adhkar',
    title: 'Entering & Leaving the Home',
    arabicTitle: 'أذكار الدخول والخروج من المنزل',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'Dhikr for stepping outside and returning safely.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'Supplications that invoke angelic protection and reliance upon Allah upon leaving the doorstep.',
    whatItTeaches: 'Tawakkul (reliance on Allah) during daily errands and guarding the home from Shaytan.',
    importance: 'The Prophet ﷺ said that whoever recites it upon leaving, an angel says: "You are guided, defended, and protected."',
    keyLessons: ['Bismillahi tawakkaltu ‘alallah', 'Greeting family with Salam.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Abu Dawud and Tirmidhi.',
    hadithCount: 5,
    samplePassages: [
      {
        id: 'hm-1',
        title: 'Upon Leaving the House',
        arabicText: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ.',
        transliteration: 'Bismillahi tawakkaltu ‘alallah, la hawla wa la quwwata illa billah.',
        englishTranslation: 'In the Name of Allah, I place my trust in Allah; there is no might nor power except with Allah.',
        reference: 'Sunan Abu Dawud (5095)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'ruqyah-supplications',
    slug: 'ruqyah-supplications',
    title: 'Authentic Ruqyah Supplications (Ar-Ruqyah ash-Shar’iyyah)',
    arabicTitle: 'الرُّقية الشرعية من الكتاب والسنة',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'Authentic Quranic chapters and prophetic invocations for healing.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'Healing verses and prophetic formulas for physical ailments, spiritual disturbances, and emotional distress.',
    whatItTeaches: 'Seeking cure through the Word of Allah and authentic prophetic prayers without superstitions.',
    importance: 'The Islamic method of divine healing and protection.',
    keyLessons: ['Reciting Al-Fatihah, Ayat al-Kursi, Al-Ikhlas, Al-Falaq, An-Nas', 'Bismillah 3x on pain.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Documented in Sahih al-Bukhari and Sahih Muslim.',
    hadithCount: 12,
    samplePassages: [
      {
        id: 'rq-1',
        title: 'Prophetic Prayer for the Sick',
        arabicText: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ، شِفَاءً لاَ يُغَادِرُ سَقَمًا.',
        transliteration: 'Allahumma Rabban-nas, adh-hibil-ba’s, ishfi Antash-Shafi, la shifa’a illa shifa’uk, shifa’an la yughadiru saqama.',
        englishTranslation: 'O Allah, Lord of mankind, remove the affliction. Heal, for You are the Healer. There is no cure except Your cure, a cure that leaves behind no illness.',
        reference: 'Sahih al-Bukhari (5675), Muslim (2191)',
        targetCount: 1
      }
    ]
  },
  {
    id: 'general-duas',
    slug: 'general-daily-duas',
    title: 'General Prophetic Daily Duas',
    arabicTitle: 'جوامع الكلم والأدعية النبوية الجامعة',
    author: 'Prophetic Sunnah Compilations',
    authorBio: 'The most comprehensive prayers encompassing all worldly and hereafter blessings.',
    category: 'adhkar',
    categoryLabel: 'Daily Adhkar & Duas',
    description: 'Comprehensive prayers taught by the Prophet ﷺ (Jawami’ al-Kalim) that gather all good in concise phrases.',
    whatItTeaches: 'How to ask for goodness in this world and the Hereafter with humility and certainty.',
    importance: 'The most frequent supplication of the Prophet ﷺ.',
    keyLessons: ['Rabbana atina fid-dunya hasanah', 'Asking for steadfastness upon the Deen.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Sahih al-Bukhari & Muslim.',
    hadithCount: 18,
    samplePassages: [
      {
        id: 'gd-1',
        title: 'The Most Frequent Prophetic Prayer',
        arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina ‘adhaban-nar.',
        englishTranslation: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good, and save us from the punishment of the Fire.',
        reference: 'Surah Al-Baqarah (2:201), Sahih al-Bukhari (4522)',
        targetCount: 1
      }
    ]
  },

  // ========================================================
  // CATEGORY C: ISLAMIC KNOWLEDGE & AQIDAH (9 Works)
  // ========================================================
  {
    id: 'kitab-tawhid',
    slug: 'kitab-at-tawhid',
    title: 'Kitab at-Tawhid (Book of Monotheism)',
    arabicTitle: 'كتاب التوحيد الذي هو حق الله على العبيد',
    author: 'Shaykh al-Islam Muhammad ibn Abd al-Wahhab (1115–1206 AH)',
    authorBio: 'Influential Arabian reformer and scholar who revitalized the call to pure Islamic monotheism based strictly on Quran and Sunnah.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'A pivotal treatise clarifying the core obligation of Tawhid (the oneness of Allah in lordship, worship, and names/attributes) and refuting all manifestations of Shirk.',
    whatItTeaches: 'The rights of Allah upon humanity and how worship must be directed solely to Him without intermediaries.',
    importance: 'A classical textbook studied worldwide for establishing pure Islamic monotheism.',
    keyLessons: ['Definitions of Tawhid and Shirk', 'Rejection of amulets, soothsaying, and graves worship', 'True reliance on Allah alone.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Composed entirely of direct Quranic verses and authenticated Hadith proofs.',
    samplePassages: [
      {
        id: 'kt-1',
        title: 'Chapter 1: The Obligation of Tawhid',
        arabicText: 'وَمَا خَلَقْتُ الْجِنَّ وَالإِنسَ إِلاَّ لِيَعْبُدُونِ',
        englishTranslation: 'And I did not create the jinn and mankind except to worship Me alone. (Surah Adh-Dhariyat 51:56)',
        reference: 'Kitab at-Tawhid, Chapter 1',
        benefits: 'Clarifies the sole divine wisdom behind creation.'
      }
    ]
  },
  {
    id: 'aqidah-wasitiyyah',
    slug: 'al-aqidah-al-wasitiyyah',
    title: 'Al-Aqidah al-Wasitiyyah',
    arabicTitle: 'العقيدة الواسطية',
    author: 'Shaykh al-Islam Ahmad Ibn Taymiyyah (661–728 AH)',
    authorBio: 'One of the greatest encyclopedic scholars and defenders of the orthodox creed in Islamic history, writing from Damascus.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'The golden manifesto of the creed of Ahl us-Sunnah wal-Jama’ah regarding the Names and Attributes of Allah, the Day of Judgment, and the Sahabah.',
    whatItTeaches: 'Affirming Allah’s divine attributes as revealed in the Quran and Sunnah without distortion (Tahrif), denial (Ta’til), asking how (Takyif), or resemblance to creation (Tamthil).',
    importance: 'The definitive standard for authentic Salafi theology.',
    keyLessons: ['Affirmation without resemblance', 'Moderation of the Muslim Ummah.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Derived verbatim from the Quran and mass-transmitted Sunnah.',
    samplePassages: [
      {
        id: 'aw-1',
        title: 'The Principle of Allah’s Attributes',
        arabicText: 'لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ البَصِيرُ',
        englishTranslation: 'There is nothing like unto Him, and He is the All-Hearing, the All-Seeing. (Surah Ash-Shura 42:11)',
        reference: 'Al-Aqidah al-Wasitiyyah, Section 1'
      }
    ]
  },
  {
    id: 'usool-thalathah',
    slug: 'al-usool-ath-thalathah',
    title: 'Al-Usool ath-Thalathah (The Three Fundamental Principles)',
    arabicTitle: 'الأصول الثلاثة وأدلتها',
    author: 'Shaykh Muhammad ibn Abd al-Wahhab (1115–1206 AH)',
    authorBio: 'Prominent Arabian educator who authored concise educational primers for students of knowledge.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'A pedagogical masterpiece outlining the three questions every human will be asked in the grave: Who is your Lord? What is your religion? Who is your Prophet?',
    whatItTeaches: 'The absolute fundamentals of knowing Allah, knowing Islam with evidence, and knowing the Prophet Muhammad ﷺ.',
    importance: 'The first book taught to students of Islamic knowledge across generations.',
    keyLessons: ['Knowledge precedes speech and action', 'Patience upon seeking truth', 'The levels of Islam, Iman, and Ihsan.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Every point supported by specific Quranic citations.',
    samplePassages: [
      {
        id: 'ut-1',
        title: 'The First Principle: Knowing Your Lord',
        arabicText: 'إِذَا قِيلَ لَكَ: مَنْ رَبُّكَ؟ فَقُلْ: رَبِّيَ اللَّهُ الَّذِي رَبَّانِي وَرَبَّى جَمِيعَ الْعَالَمِينَ بِنِعَمِهِ، وَهُوَ مَعْبُودِي لَيْسَ لِي مَعْبُودٌ سِوَاهُ.',
        englishTranslation: 'If it is said to you: "Who is your Lord?" Say: "My Lord is Allah, Who nurtured me and nurtured all the worlds with His favors, and He is my Deity of worship; I have no deity besides Him."',
        reference: 'Al-Usool ath-Thalathah, First Principle'
      }
    ]
  },
  {
    id: 'kashf-shubuhat',
    slug: 'kashf-ash-shubuhat',
    title: 'Kashf ash-Shubuhat (Removal of Doubts)',
    arabicTitle: 'كشف الشبهات',
    author: 'Shaykh Muhammad ibn Abd al-Wahhab (1115–1206 AH)',
    authorBio: 'Renowned reformer specializing in clarifying theological misconceptions.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'A concise intellectual apologetic dismantling historical misconceptions surrounding intercession, monotheism, and worship.',
    whatItTeaches: 'How to logically and scripturally refute doubts regarding calling upon saints or graves.',
    importance: 'Strengthens certainty and equips seekers to defend monotheism with clarity.',
    keyLessons: ['Only Allah possesses the right of intercession', 'Distinction between Tawhid of lordship and worship.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Directly grounded in Quranic debates with the polytheists of Makkah.',
    samplePassages: [
      {
        id: 'ks-1',
        title: 'The Nature of True Intercession',
        arabicText: 'قُل لِّلَّهِ الشَّفَاعَةُ جَمِيعًا',
        englishTranslation: 'Say: To Allah belongs all intercession entirely. (Surah Az-Zumar 39:44)',
        reference: 'Kashf ash-Shubuhat'
      }
    ]
  },
  {
    id: 'tafsir-ibn-kathir',
    slug: 'tafsir-ibn-kathir',
    title: 'Tafsir al-Qur’an al-’Azim (Tafsir Ibn Kathir)',
    arabicTitle: 'تفسير القرآن العظيم (تفسير ابن كثير)',
    author: 'Al-Hafidh Imad ad-Din Ismail Ibn Kathir (701–774 AH)',
    authorBio: 'Student of Ibn Taymiyyah, eminent Mamluk historian, exegete, and Hadith master in Damascus.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'The premier traditional commentary of the Holy Quran using the methodology of Tafsir bil-Ma’thur (explaining the Quran by the Quran, then by the Sunnah, then by the Sahabah).',
    whatItTeaches: 'The true contextual, linguistic, and legislative meanings of all 114 Surahs.',
    importance: 'The most authoritative and referenced Tafsir work in the Islamic library.',
    keyLessons: ['Interpreting Quran through prophetic Sunnah', 'Understanding Asbab an-Nuzul (reasons for revelation).'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Carefully vetted against authentic narrations with rejection of baseless Isra’iliyyat.',
    samplePassages: [
      {
        id: 'tik-1',
        title: 'Virtue of Surah Al-Fatihah',
        arabicText: 'سُورَةُ الْفَاتِحَةِ هِيَ أُمُّ الْقُرْآنِ، وَالسَّبْعُ الْمَثَانِي، وَالْقُرْآنُ الْعَظِيمُ الَّذِي أُوتِيَهُ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ.',
        englishTranslation: 'Surah Al-Fatihah is the Mother of the Quran, the Seven Oft-Repeated Verses, and the Grand Quran bestowed upon the Prophet (ﷺ).',
        reference: 'Tafsir Ibn Kathir, Introduction'
      }
    ]
  },
  {
    id: 'tafsir-sadi',
    slug: 'tafsir-as-sadi',
    title: 'Taysir al-Karim ar-Rahman (Tafsir as-Sa’di)',
    arabicTitle: 'تيسير الكريم الرحمن في تفسير كلام المنان',
    author: 'Shaykh Abd ar-Rahman ibn Nasir as-Sa’di (1307–1376 AH)',
    authorBio: 'Renowned Najdi scholar and teacher of Shaykh Muhammad ibn Salih al-Uthaymeen.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'A celebrated contemporary Tafsir celebrated for its clarity, spiritual depth, eloquent brevity, and absence of complex linguistic digressions.',
    whatItTeaches: 'Clear, practical lessons from the divine verses applicable directly to the believer’s daily life.',
    importance: 'The recommended introductory Tafsir for modern readers seeking direct understanding.',
    keyLessons: ['Practical reflection (Tadabbur)', 'Moral and spiritual elevation through Quranic verses.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Strictly adherent to the creed of the Salaf as-Salih.',
    samplePassages: [
      {
        id: 'ts-1',
        title: 'Contemplation on Allah’s Mercy',
        arabicText: 'يَدْعُو عِبَادَهُ إِلَى مَعْرِفَتِهِ وَمَحَبَّتِهِ وَإِخْلاَصِ الدِّينِ لَهُ.',
        englishTranslation: 'Allah invites His servants to know Him, love Him, and make religion sincerely for Him alone.',
        reference: 'Tafsir as-Sa’di'
      }
    ]
  },
  {
    id: 'zad-maad',
    slug: 'zad-al-maad',
    title: 'Zad al-Ma’ad fi Hady Khayr al-’Ibad',
    arabicTitle: 'زاد المعاد في هدي خير العباد',
    author: 'Imam Shams ad-Din Ibn Qayyim al-Jawziyyah (691–751 AH)',
    authorBio: 'Foremost student of Ibn Taymiyyah, renowned for his psychological insight, eloquence, and profound spiritual mastery.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'An unparalleled multi-volume masterpiece detailing the entire lifestyle, manners, worship, warfare, medicine, and jurisprudence of the Prophet ﷺ.',
    whatItTeaches: 'How the Prophet ﷺ lived in joy, grief, travel, home, battle, peace, and health.',
    importance: 'The most comprehensive living manual of prophetic emulation.',
    keyLessons: ['Prophetic guidance is the only path to true human happiness', 'Integrative understanding of mind, body, and spirit.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Written entirely from memory during Ibn Qayyim’s journey to Hajj.',
    samplePassages: [
      {
        id: 'zm-1',
        title: 'The Perfection of Prophetic Guidance',
        arabicText: 'وَهَدْيُهُ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فِي جَمِيعِ أُمُورِهِ هُوَ أَكْمَلُ الْهَدْيِ عَلَى الإِطْلاَقِ.',
        englishTranslation: 'His guidance (ﷺ) in all affairs is the absolute most complete guidance possible.',
        reference: 'Zad al-Ma’ad, Volume 1'
      }
    ]
  },
  {
    id: 'wabil-sayyib',
    slug: 'al-wabil-as-sayyib',
    title: 'Al-Wabil as-Sayyib min al-Kalim at-Tayyib',
    arabicTitle: 'الوابل الصيب من الكلم الطيب',
    author: 'Imam Ibn Qayyim al-Jawziyyah (691–751 AH)',
    authorBio: 'Master spiritual physician of Islamic history.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'A poetic and profound treatise on the spiritual benefits of Dhikr (remembrance of Allah), containing more than 70 enumerated virtues of continuous remembrance.',
    whatItTeaches: 'How Dhikr cures depression, illuminates the heart, drives away anxiety, and opens the gates of Paradise.',
    importance: 'A classical staple of Islamic spirituality and purification of the soul (Tazkiyah).',
    keyLessons: ['Dhikr is to the heart what water is to fish', 'The light of remembrance in this world and the grave.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Documented with authentic Sunnah citations.',
    samplePassages: [
      {
        id: 'ws-1',
        title: 'The Parable of the Heart and Dhikr',
        arabicText: 'إِنَّ الذِّكْرَ لِلْقَلْبِ مِثْلُ الْمَاءِ لِلسَّمَكِ، فَكَيْفَ يَكُونُ حَالُ السَّمَكِ إِذَا فَارَقَ الْمَاءَ؟',
        englishTranslation: 'Remembrance is to the heart like water is to fish; how then would a fish fare if it were separated from water?',
        reference: 'Al-Wabil as-Sayyib, Chapter 3'
      }
    ]
  },
  {
    id: 'madarij-salikin',
    slug: 'madarij-as-salikin',
    title: 'Madarij as-Salikin (Ranks of the Seekers)',
    arabicTitle: 'مدارج السالكين بين منازل إياك نعبد وإياك نستعين',
    author: 'Imam Ibn Qayyim al-Jawziyyah (691–751 AH)',
    authorBio: 'Spiritual authority and encyclopedist of Islamic Tazkiyah.',
    category: 'knowledge',
    categoryLabel: 'Islamic Knowledge & Aqidah',
    description: 'A profound commentary on the spiritual stations of "You alone we worship, and You alone we ask for help" (Surah Al-Fatihah).',
    whatItTeaches: 'The stations of repentance, humility, reliance, love, fear, and hope in traveling towards Allah.',
    importance: 'The summit of orthodox Islamic spiritual psychology.',
    keyLessons: ['Balance between fear and hope', 'Purifying sincerity.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Rooted firmly in the Quran and the practices of the Sahabah.',
    samplePassages: [
      {
        id: 'ms-1',
        title: 'The Wings of the Soul',
        arabicText: 'الْقَلْبُ فِي سَيْرِهِ إِلَى اللَّهِ عَزَّ وَجَلَّ بِمَنْزِلَةِ الطَّائِرِ، فَالْمَحَبَّةُ رَأْسُهُ، وَالْخَوْفُ وَالرَّجَاءُ جَنَاحَاهُ.',
        englishTranslation: 'The heart in its journey to Allah is like a bird: love is its head, and fear and hope are its two wings.',
        reference: 'Madarij as-Salikin'
      }
    ]
  },

  // ========================================================
  // CATEGORY D: SEERAH & ISLAMIC HISTORY (6 Works)
  // ========================================================
  {
    id: 'raheeq-makhtum',
    slug: 'ar-raheeq-al-makhtum',
    title: 'Ar-Raheeq Al-Makhtum (The Sealed Nectar)',
    arabicTitle: 'الرحيق المختوم',
    author: 'Shaykh Safiur Rahman Mubarakpuri (1362–1427 AH)',
    authorBio: 'Distinguished Indian Islamic scholar and teacher at the Islamic University of Madinah. Awarded first prize worldwide by the Muslim World League for this master biography.',
    category: 'seerah',
    categoryLabel: 'Seerah & Islamic History',
    description: 'The world-renowned biography of the Prophet Muhammad ﷺ, celebrated for its gripping historical narrative, emotional power, and meticulous chronological accuracy.',
    whatItTeaches: 'The life of the Messenger ﷺ from pre-Islamic Arabia, the dawn of revelation, persecution in Makkah, the Hijrah, Madinan statehood, to the Farewell Pilgrimage.',
    importance: 'Winner of the World League first prize for prophetic biography, read by tens of millions in dozens of languages.',
    keyLessons: ['Steadfastness under hardship', 'Wisdom in diplomacy and statecraft', 'Boundless mercy and forgiveness upon victory.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Rigorously scrutinized against authentic Hadith literature.',
    chaptersCount: 30,
    samplePassages: [
      {
        id: 'rm-1',
        title: 'The Opening of Makkah: Supreme Mercy',
        arabicText: 'قَالَ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: "مَا تَرَوْنَ أَنِّي فَاعِلٌ بِكُمْ؟" قَالُوا: خَيْرًا، أَخٌ كَرِيمٌ وَابْنُ أَخٍ كَرِيمٍ. قَالَ: "اذْهَبُوا فَأَنْتُمُ الطُّلَقَاءُ".',
        englishTranslation: 'The Prophet (ﷺ) asked: "What do you think I will do with you?" They replied: "Only good, a noble brother and the son of a noble brother." He said: "Go, for you are all free!"',
        hausaTranslation: 'Manzon Allah (SAW) ya tambaye su: "Me kuke tsammanin zan yi muku?" Suka ce: "Alheri ne kawai, kai dan uwa ne mai karimci, kuma dan wani dan uwa mai karimci." Ya ce: "Ku tafi, kun sami yanci!"',
        reference: 'Ar-Raheeq Al-Makhtum, The Conquest of Makkah'
      }
    ]
  },
  {
    id: 'stories-prophets',
    slug: 'qisas-al-anbiya',
    title: 'Qisas al-Anbiya (Stories of the Prophets)',
    arabicTitle: 'قصص الأنبياء',
    author: 'Al-Hafidh Ismail Ibn Kathir (701–774 AH)',
    authorBio: 'Eminent scholar and author of Tafsir Ibn Kathir and Al-Bidayah wan-Nihayah.',
    category: 'seerah',
    categoryLabel: 'Seerah & Islamic History',
    description: 'The definitive compilation detailing the lives, missions, and trials of all prophets from Adam, Nuh, Ibrahim, Musa, and Isa (AS) to the final Messenger ﷺ.',
    whatItTeaches: 'The unified message of monotheism preached by all divine messengers and their patient endurance.',
    importance: 'The universally accepted standard for prophetic history.',
    keyLessons: ['Tawhid as the eternal call', 'Victory always belongs to the patient believers.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Extracted directly from Quranic verses and verified Hadiths.',
    samplePassages: [
      {
        id: 'sp-1',
        title: 'The Supplication of Prophet Yunus (AS)',
        arabicText: 'لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        englishTranslation: 'There is none worthy of worship except You; glory be to You, indeed I have been of the wrongdoers. (Surah Al-Anbiya 21:87)',
        reference: 'Qisas al-Anbiya, Story of Yunus'
      }
    ]
  },
  {
    id: 'biography-prophet',
    slug: 'seerah-nabawiyyah-ibn-hisham',
    title: 'As-Seerah an-Nabawiyyah (Ibn Hisham)',
    arabicTitle: 'السيرة النبوية لابن هشام',
    author: 'Abu Muhammad Abd al-Malik Ibn Hisham (died 218 AH)',
    authorBio: 'The premier early historian who edited, verified, and preserved the earliest comprehensive biography composed by Ibn Ishaq.',
    category: 'seerah',
    categoryLabel: 'Seerah & Islamic History',
    description: 'The foundational source text upon which almost all subsequent biographies of the Prophet Muhammad ﷺ are built.',
    whatItTeaches: 'Early Arabian tribal history, genealogy, battle accounts, and exact historical treaties.',
    importance: 'The primary historical wellspring for all researchers of prophetic history.',
    keyLessons: ['Preservation of early historical documents', 'The sacrifice of the early Muhajirun and Ansar.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Standard primary source in classical Islamic scholarship.',
    samplePassages: [
      {
        id: 'ih-1',
        title: 'The First Pledge of Al-Aqabah',
        arabicText: 'بَايَعْنَا رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ عَلَى أَنْ لاَ نُشْرِكَ بِاللَّهِ شَيْئًا وَلاَ نَسْرِقَ وَلاَ نَزْنِيَ...',
        englishTranslation: 'We gave allegiance to the Messenger of Allah that we would not associate anything with Allah, nor steal, nor commit adultery...',
        reference: 'Seerah Ibn Hisham'
      }
    ]
  },
  {
    id: 'lives-sahabah',
    slug: 'suwar-min-hayat-as-sahabah',
    title: 'Suwar min Hayat as-Sahabah (Pictures from the Lives of the Companions)',
    arabicTitle: 'صور من حياة الصحابة',
    author: 'Dr. Abdur Rahman Ra’fat al-Basha (1338–1406 AH)',
    authorBio: 'Eminent literary scholar and historian who brought the biographies of the Sahabah to life with breathtaking Arabic prose.',
    category: 'seerah',
    categoryLabel: 'Seerah & Islamic History',
    description: 'Inspiring accounts of the companions of the Prophet ﷺ: their conversion, valor, generosity, and martyrdom.',
    whatItTeaches: 'How ordinary individuals were transformed by the Quran into moral titans and leaders of civilization.',
    importance: 'Cherished by youth and families globally for inspirational character building.',
    keyLessons: ['Loyalty to the truth', 'Generosity with wealth and life', 'Humility in power.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Vetted against classical biographical dictionaries (Al-Isabah, Usd al-Ghabah).',
    samplePassages: [
      {
        id: 'ls-1',
        title: 'Mus’ab ibn Umayr: The Ambassador of Islam',
        arabicText: 'تَرَكَ نَعِيمَ مَكَّةَ وَثَرَاءَهَا فِي سَبِيلِ اللَّهِ وَرَسُولِهِ، لِيَكُونَ أَوَّلَ سَفِيرٍ لِلإِسْلاَمِ فِي يَثْرِبَ.',
        englishTranslation: 'He abandoned the luxuries and wealth of Makkah for the sake of Allah and His Messenger, to become the first ambassador of Islam in Yathrib.',
        reference: 'Lives of the Sahabah'
      }
    ]
  },
  {
    id: 'rightly-guided-caliphs',
    slug: 'tarikh-al-khulafa',
    title: 'Tarikh al-Khulafa (History of the Caliphs)',
    arabicTitle: 'تاريخ الخلفاء الراشدين والدول الإسلامية',
    author: 'Imam Jalal ad-Din as-Suyuti (849–911 AH)',
    authorBio: 'The polymath of Cairo who authored over 500 books across Hadith, Tafsir, history, and Arabic linguistics.',
    category: 'seerah',
    categoryLabel: 'Seerah & Islamic History',
    description: 'Chronicles the reigns of Abu Bakr, Umar, Uthman, and Ali (RA), demonstrating ideal Islamic governance and justice.',
    whatItTeaches: 'Constitutional justice, accountability of rulers, and the expansion of early Islamic civilization.',
    importance: 'The classic narrative of the golden age of prophetic successors.',
    keyLessons: ['Umar’s justice', 'Abu Bakr’s steadfastness', 'Uthman’s compilation of the Mushaf', 'Ali’s judicial wisdom.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Documented from verified classical chronicles.',
    samplePassages: [
      {
        id: 'rc-1',
        title: 'Abu Bakr’s First Inaugural Address',
        arabicText: 'أَيُّهَا النَّاسُ، إِنِّي قَدْ وُلِّيتُ عَلَيْكُمْ وَلَسْتُ بِخَيْرِكُمْ، فَإِنْ أَحْسَنْتُ فَأَعِينُونِي، وَإِنْ أَسَأْتُ فَقَوِّمُونِي.',
        englishTranslation: 'O people, I have been appointed as your leader although I am not the best among you. If I do well, help me; and if I do wrong, set me straight.',
        reference: 'Tarikh al-Khulafa'
      }
    ]
  },
  {
    id: 'islamic-civilization',
    slug: 'tarikh-al-hadarah-al-islamiyyah',
    title: 'Glory of Islamic Civilization & Heritage',
    arabicTitle: 'روائع من حضارتنا وتاريخنا المجيد',
    author: 'Dr. Mustafa as-Siba’i (1333–1384 AH)',
    authorBio: 'Distinguished Syrian professor of Islamic law and founder of the Faculty of Shariah in Damascus.',
    category: 'seerah',
    categoryLabel: 'Seerah & Islamic History',
    description: 'Explores the contributions of Islamic civilization to hospitals, universities, human rights, jurisprudence, astronomy, and science.',
    whatItTeaches: 'How Islamic faith ignited the intellectual renaissance of the medieval world.',
    importance: 'Instills confidence and historical awareness in modern Muslim generations.',
    keyLessons: ['Integration of faith and scientific inquiry', 'Humanitarian foundations of Islamic institutions.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Supported by historical manuscripts and international archaeological records.',
    samplePassages: [
      {
        id: 'ic-1',
        title: 'The Free Universal Hospitals of Islam (Bimaristans)',
        arabicText: 'كَانَتِ الْمُسْتَشْفَيَاتُ فِي الْحَضَارَةِ الإِسْلاَمِيَّةِ مَفْتُوحَةً لِجَمِيعِ النَّاسِ مَجَّانًا، فُقَرَائِهِمْ وَأَغْنِيَائِهِمْ، مُسْلِمِيهِمْ وَغَيْرِ مُسْلِمِيهِمْ.',
        englishTranslation: 'Hospitals in Islamic civilization were open to all people free of charge, poor and rich, Muslims and non-Muslims alike.',
        reference: 'Glory of Islamic Civilization'
      }
    ]
  },

  // ========================================================
  // CATEGORY E: FIQH & WORSHIP (8 Works)
  // ========================================================
  {
    id: 'fiqh-sunnah',
    slug: 'fiqh-us-sunnah',
    title: 'Fiqh us-Sunnah',
    arabicTitle: 'فقه السنة',
    author: 'Sayyid Sabiq (1333–1420 AH)',
    authorBio: 'Renowned Egyptian Al-Azhar scholar who revolutionized Fiqh pedagogy by presenting rulings directly with their Quran and Sunnah evidences without partisan bias.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'A comprehensive modern encyclopedia of Islamic law, presenting worship, transactions, and family law with direct proof from the Sunnah.',
    whatItTeaches: 'How to perform purification, prayer, fasting, zakah, and hajj exactly as the Prophet ﷺ taught.',
    importance: 'Awarded the King Faisal International Prize for Service to Islam; the standard modern reference for practical Fiqh.',
    keyLessons: ['Simplicity in religion', 'Unifying Muslims around authentic proofs rather than blind imitation.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Extensively cited with authentic Hadith references.',
    chaptersCount: 14,
    samplePassages: [
      {
        id: 'fs-1',
        title: 'The Perfection of Wudu (Ablution)',
        arabicText: 'مَنْ تَوَضَّأَ فَأَحْسَنَ الْوُضُوءَ خَرَجَتْ خَطَايَاهُ مِنْ جَسَدِهِ حَتَّى تَخْرُجَ مِنْ تَحْتِ أَظْفَارِهِ.',
        englishTranslation: 'Whoever performs wudu and does it excellently, his sins will leave his body, even from beneath his fingernails.',
        reference: 'Fiqh us-Sunnah, Chapter on Taharah (Sahih Muslim)'
      }
    ]
  },
  {
    id: 'salat-al-nabi',
    slug: 'sifah-salat-an-nabi',
    title: 'Sifatu Salat an-Nabi ﷺ (The Prophet’s Prayer Described)',
    arabicTitle: 'صفة صلاة النبي صلى الله عليه وسلم من التكبير إلى التسليم',
    author: 'Shaykh Muhammad Nasiruddin al-Albani (1332–1420 AH)',
    authorBio: 'The foremost Hadith scholar and critic of the 20th century.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'A step-by-step reconstruction of the exact prayer of the Prophet Muhammad ﷺ from the initial Takbir to the final Taslim as if you are seeing it.',
    whatItTeaches: 'Fulfilling the prophetic command: "Pray as you have seen me praying."',
    importance: 'The definitive universal handbook for perfecting daily prayer according to the Sunnah.',
    keyLessons: ['Humility (Khushu) in Salah', 'Physical accuracy of Ruku, Sujud, and postures.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Every gesture and word backed by authenticated Hadith citations.',
    samplePassages: [
      {
        id: 'sn-1',
        title: 'The Great Prophetic Mandate',
        arabicText: 'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي.',
        englishTranslation: 'Pray as you have seen me praying.',
        reference: 'Sahih al-Bukhari (631)'
      }
    ]
  },
  {
    id: 'bidayat-mujtahid',
    slug: 'bidayat-al-mujtahid',
    title: 'Bidayat al-Mujtahid wa Nihayat al-Muqtasid',
    arabicTitle: 'بداية المجتهد ونهاية المقتصد',
    author: 'Ibn Rushd (Averroes) al-Hafid (520–595 AH)',
    authorBio: 'Celebrated Andalusian polymath, Maliki chief judge of Cordoba and Seville.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'The premier classical work on comparative Islamic jurisprudence, explaining the reasons why jurists diverged in their opinions.',
    whatItTeaches: 'Intellectual tolerance, legal methodology, and understanding divergent rulings across the four Madhhabs.',
    importance: 'Taught in advanced faculties of Islamic jurisprudence worldwide.',
    keyLessons: ['Respect for scholarly differences', 'How linguistic and Hadith differences produce valid Fiqh diversity.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Standard classical reference work across all Islamic schools.',
    samplePassages: [
      {
        id: 'bm-1',
        title: 'The Essence of Legal Methodology',
        arabicText: 'أَسْبَابُ اخْتِلاَفِ الْفُقَهَاءِ تَرْجِعُ إِلَى اخْتِلاَفِهِمْ فِي الأَلْفَاظِ وَطُرُقِ ثُبُوتِ الأَخْبَارِ.',
        englishTranslation: 'The causes of disagreement among jurists trace back to linguistic interpretations and criteria for validating reports.',
        reference: 'Bidayat al-Mujtahid, Introduction'
      }
    ]
  },
  {
    id: 'fiqh-zakah',
    slug: 'fiqh-az-zakah',
    title: 'Fiqh az-Zakah: The Principles and Impact of Obligatory Charity',
    arabicTitle: 'فقه الزكاة ودورها في التكافل الاجتماعي',
    author: 'Classical & Contemporary Shariah Academies',
    authorBio: 'Compiled from authentic consensus texts across the Maliki, Hanafi, Shafi’i, and Hanbali traditions.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'Clear rules governing the third pillar of Islam: Nisab thresholds, eligible categories, gold, currency, livestock, and agricultural produce.',
    whatItTeaches: 'How Zakah cleanses wealth, eradicates poverty, and builds social justice.',
    importance: 'Essential practical guide for every wealth owner.',
    keyLessons: ['Calculating 2.5% on wealth exceeding Nisab', 'The eight eligible categories in Surah At-Tawbah 60.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Rooted directly in Quranic distribution rules.',
    samplePassages: [
      {
        id: 'fz-1',
        title: 'The Divine Categories of Zakah',
        arabicText: 'إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ فَرِيضَةً مِّنَ اللَّهِ',
        englishTranslation: 'Zakah expenditures are only for the poor and for the needy and for those employed to collect it and for bringing hearts together and for freeing captives and for those in debt and for the cause of Allah and for the traveler. (At-Tawbah 9:60)',
        reference: 'Surah At-Tawbah 9:60'
      }
    ]
  },
  {
    id: 'fiqh-fasting',
    slug: 'fiqh-as-siyam',
    title: 'Fiqh as-Siyam: Rulings of Ramadan and Voluntary Fasting',
    arabicTitle: 'فقه الصيام وأحكام شهر رمضان',
    author: 'Council of Senior Islamic Scholars',
    authorBio: 'Authentic consensus manual on the fourth pillar of Islam.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'Practical handbook on fasting: intentions, invalidators, exemptions for travelers and sick, Fidya, and the virtues of Laylat al-Qadr.',
    whatItTeaches: 'Achieving Taqwa through physical and spiritual restraint.',
    importance: 'The annual companion for millions of Muslims preparing for Ramadan.',
    keyLessons: ['The spiritual purpose of fasting', 'Rulings on Taraweeh and I’tikaf.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Consensus of classical jurists based on authentic Sunnah.',
    samplePassages: [
      {
        id: 'fsi-1',
        title: 'The Great Reward of Ramadan',
        arabicText: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ.',
        englishTranslation: 'Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven.',
        reference: 'Sahih al-Bukhari (38), Muslim (760)'
      }
    ]
  },
  {
    id: 'hajj-umrah-guide',
    slug: 'guide-to-hajj-and-umrah',
    title: 'Comprehensive Guide to Hajj and Umrah',
    arabicTitle: 'الدليل الشامل لمناسك الحج والعمرة خطوة بخطوة',
    author: 'Ministry of Islamic Affairs & Eminent Scholars',
    authorBio: 'Step-by-step practical guide verified by contemporary scholars of Makkah and Madinah.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'Detailed photographic and textual guide to the fifth pillar: Ihram, Tawaf, Sa’i, Arafah, Muzdalifah, Mina, and visits to the Prophet’s Mosque.',
    whatItTeaches: 'Performing pilgrimage according to the exact methodology of the Prophet’s Farewell Hajj.',
    importance: 'The indispensable companion for every pilgrim travelling to the Holy Lands.',
    keyLessons: ['"Take your rituals from me"', 'Avoiding common pilgrim mistakes', 'The Hajj Mabrur.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Based on the detailed narration of Jabir ibn Abdillah in Sahih Muslim.',
    samplePassages: [
      {
        id: 'hu-1',
        title: 'The Reward of an Accepted Pilgrimage',
        arabicText: 'وَالْحَجُّ الْمَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلاَّ الْجَنَّةُ.',
        englishTranslation: 'And an accepted Hajj brings no reward other than Paradise.',
        reference: 'Sahih al-Bukhari (1773), Muslim (1349)'
      }
    ]
  },
  {
    id: 'halal-haram',
    slug: 'the-lawful-and-the-prohibited',
    title: 'The Lawful and the Prohibited in Islam',
    arabicTitle: 'الحلال والحرام في الإسلام',
    author: 'Dr. Yusuf al-Qaradawi (1345–1444 AH)',
    authorBio: 'World-renowned scholar and former president of the International Union of Muslim Scholars.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'A classic guide addressing modern questions: diet, finance, commerce, clothing, entertainment, relations, and medical ethics.',
    whatItTeaches: 'The balance between facilitating what is lawful and guarding against what is strictly prohibited.',
    importance: 'Translated into over 30 languages; guides Muslims living in modern multicultural societies.',
    keyLessons: ['The principle of original permissibility in worldly matters', 'Avoiding doubtful matters.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Strict adherence to textual evidence with contemporary application.',
    samplePassages: [
      {
        id: 'hh-1',
        title: 'The Principle of Permissibility',
        arabicText: 'الأَصْلُ فِي الأَشْيَاءِ الإِبَاحَةُ حَتَّى يَدُلَّ الدَّلِيلُ عَلَى التَّحْرِيمِ.',
        englishTranslation: 'The fundamental rule regarding worldly things is permissibility unless proof indicates prohibition.',
        reference: 'The Lawful and the Prohibited, General Principles'
      }
    ]
  },
  {
    id: 'marriage-family',
    slug: 'fiqh-al-usrah',
    title: 'Fiqh al-Usrah: Islamic Family Law & Compassion',
    arabicTitle: 'فقه الأسرة والمودة في الإسلام',
    author: 'Council of Islamic Jurisprudence Academies',
    authorBio: 'Collaborative work of senior jurists across the Muslim world.',
    category: 'fiqh',
    categoryLabel: 'Fiqh & Worship (Ibadah)',
    description: 'A balanced guide to marriage, courtship, mutual rights and responsibilities, parenting, conflict resolution, and divorce.',
    whatItTeaches: 'How to build homes anchored upon affection (Mawaddah), mercy (Rahmah), and justice.',
    importance: 'Essential for every Muslim entering marriage or raising children.',
    keyLessons: ['The best of you is the best to his family', 'Fairness and consultation in family leadership.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Directly grounded in Surah An-Nisa and prophetic family traditions.',
    samplePassages: [
      {
        id: 'mf-1',
        title: 'Divine Foundation of Marriage',
        arabicText: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
        englishTranslation: 'And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. (Ar-Rum 30:21)',
        reference: 'Surah Ar-Rum 30:21'
      }
    ]
  },

  // ========================================================
  // CATEGORY F: QURANIC STUDIES & TAJWEED (7 Works)
  // ========================================================
  {
    id: 'muqaddimah-jazariyyah',
    slug: 'al-muqaddimah-al-jazariyyah',
    title: 'Al-Muqaddimah al-Jazariyyah in Tajweed',
    arabicTitle: 'المقدمة الجزرية في علم التجويد',
    author: 'Imam Shams ad-Din Muhammad ibn al-Jazari (751–833 AH)',
    authorBio: 'The unquestioned supreme authority in the science of Qira’at and Tajweed in Islamic history, from Damascus.',
    category: 'quran_studies',
    categoryLabel: 'Quranic Studies & Tajweed',
    description: 'The golden poetic didactic poem (107 verses) that serves as the universal benchmark for mastering Quranic phonetics and rules of recitation.',
    whatItTeaches: 'Points of articulation (Makharij al-Huruf), intrinsic characteristics (Sifat), rules of Nun Sakinah, Mim Sakinah, and Madd.',
    importance: 'Memorized by every serious student of Quranic recitation before receiving an Ijazah.',
    keyLessons: ['Precise placement of tongue and throat', 'Distinguishing similar Arabic letters', 'Rules of stopping and starting.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Standard curriculum across Al-Azhar, Madinah, and Islamic academies globally.',
    chaptersCount: 17,
    samplePassages: [
      {
        id: 'mj-1',
        title: 'Opening Lines on the Obligation of Tajweed',
        arabicText: 'وَالأَخْذُ بِالتَّجْوِيدِ حَتْمٌ لاَزِمُ ... مَنْ لَمْ يُجَوِّدِ الْقُرْآنَ آثِمُ\nلأَنَّهُ بِهِ الإِلَهُ أَنْزَلاَ ... وَهَكَذَا مِنْهُ إِلَيْنَا وَصَلاَ',
        englishTranslation: 'Applying Tajweed is an absolute necessity; whoever does not recite the Quran with Tajweed is in error. Because with Tajweed Allah revealed it, and thus from Him it reached us.',
        reference: 'Al-Jazariyyah, Lines 27-28'
      }
    ]
  },
  {
    id: 'tuhfat-atfal',
    slug: 'tuhfat-al-atfal',
    title: 'Tuhfat al-Atfal (The Children’s Gift in Tajweed)',
    arabicTitle: 'تحفة الأطفال والغلمان في تجويد القرآن',
    author: 'Shaykh Sulayman al-Jamzuri (born ca. 1160 AH)',
    authorBio: 'Eminent Egyptian scholar of Qira’at from Jamzur, Tanta.',
    category: 'quran_studies',
    categoryLabel: 'Quranic Studies & Tajweed',
    description: 'The world’s most famous introductory poetic primer for mastering the essential rules of Quranic recitation with ease.',
    whatItTeaches: 'Clear rules of Izhar, Idgham, Iqlab, Ikhfa, and elongation (Madd).',
    importance: 'The universal first textbook for beginners learning Tajweed worldwide.',
    keyLessons: ['The four rules of Nun Sakinah', 'The two types of Madd (Original and Secondary).'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Taught continuously in Quran tahfiz centers worldwide for over two centuries.',
    chaptersCount: 8,
    samplePassages: [
      {
        id: 'ta-1',
        title: 'Rules of Nun Sakinah and Tanwin',
        arabicText: 'لِلنُّونِ إِنْ تَسْكُنْ وَلِلتَّنْوِينِ ... أَرْبَعُ أَحْكَامٍ فَخُذْ تَبْيِينِي\nفَالأَوَّلُ الإِظْهَارُ قَبْلَ أَحْرُفِ ... لِلْحَلْقِ سِتٌّ رُتِّبَتْ فَلْتَعْرِفِ',
        englishTranslation: 'For the Nun with Sukun and for the Tanwin there are four rules, so take my explanation: The first is Izhar (clarity) before six throat letters arranged in order, so know them well.',
        reference: 'Tuhfat al-Atfal, Lines 6-7'
      }
    ]
  },
  {
    id: 'asbab-nuzul',
    slug: 'asbab-an-nuzul-wahidi',
    title: 'Kitab Asbab an-Nuzul (Reasons for Revelation)',
    arabicTitle: 'أسباب النزول للواحدي النيسابوري',
    author: 'Imam Ali ibn Ahmad al-Wahidi an-Naysaburi (died 468 AH)',
    authorBio: 'Renowned early scholar of Tafsir, Arabic grammar, and Quranic history.',
    category: 'quran_studies',
    categoryLabel: 'Quranic Studies & Tajweed',
    description: 'The classical foundation that documents the specific historical incidents, questions, and moments that prompted the revelation of verses.',
    whatItTeaches: 'Historical context behind verses to prevent misinterpretation and extremist deviations.',
    importance: 'No scholar can interpret the Quran accurately without mastering Asbab an-Nuzul.',
    keyLessons: ['Verses have both immediate context and universal application', 'Preventing verses meant for polytheists from being applied to believers.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Documents early Sahabah narrations with Isnad scrutiny.',
    samplePassages: [
      {
        id: 'an-1',
        title: 'Why Context Matters in the Quran',
        arabicText: 'لاَ يُمْكِنُ مَعْرِفَةُ تَفْسِيرِ الآيَةِ دُونَ الْوُقُوفِ عَلَى قِصَّتِهَا وَبَيَانِ نُزُولِهَا.',
        englishTranslation: 'It is impossible to know the true interpretation of a verse without understanding its story and the occasion of its revelation.',
        reference: 'Asbab an-Nuzul, Introduction'
      }
    ]
  },
  {
    id: 'itqan-suyuti',
    slug: 'al-itqan-fi-ulum-al-quran',
    title: 'Al-Itqan fi ‘Ulum al-Qur’an (The Perfection in Quranic Sciences)',
    arabicTitle: 'الإتقان في علوم القرآن',
    author: 'Imam Jalal ad-Din as-Suyuti (849–911 AH)',
    authorBio: 'The great encyclopedic scholar of Cairo.',
    category: 'quran_studies',
    categoryLabel: 'Quranic Studies & Tajweed',
    description: 'The comprehensive encyclopedia of Quranic sciences covering 80 distinct disciplines including Makki and Madani, abrogation (Nasikh and Mansukh), Qira’at, and miraculous eloquence.',
    whatItTeaches: 'The entire academic infrastructure required to understand, authenticate, and study the divine speech.',
    importance: 'The greatest single compendium of Quranic sciences ever compiled.',
    keyLessons: ['The miraculous linguistic inimitability (I’jaz) of the Quran', 'Historical compilation under Abu Bakr and Uthman.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Standard textbook in all postgraduate Islamic universities.',
    chaptersCount: 80,
    samplePassages: [
      {
        id: 'iq-1',
        title: 'The Divine Protection of the Text',
        arabicText: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
        englishTranslation: 'Indeed, it is We who sent down the Quran and indeed, We will be its guardian. (Surah Al-Hijr 15:9)',
        reference: 'Al-Itqan, Chapter on Preservation'
      }
    ]
  },
  {
    id: 'mufradat-raghib',
    slug: 'al-mufradat-fi-gharib-al-quran',
    title: 'Al-Mufradat fi Gharib al-Qur’an (Quranic Vocabulary & Semantics)',
    arabicTitle: 'المفردات في غريب القرآن للراغب الأصفهاني',
    author: 'Al-Raghib al-Isfahani (died ca. 502 AH)',
    authorBio: 'Pioneering linguist, ethicist, and authority on classical Arabic semantics.',
    category: 'quran_studies',
    categoryLabel: 'Quranic Studies & Tajweed',
    description: 'An etymological dictionary exploring every root word in the Holy Quran, showing root meanings, derivatives, and subtle connotations.',
    whatItTeaches: 'The deep nuances of Quranic vocabulary that translations cannot convey.',
    importance: 'The master key for translators and exegetes worldwide.',
    keyLessons: ['Arabic root word system', 'Precision of divine word selection.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English'],
    authenticityInfo: 'Universally accepted as the pinnacle of Quranic lexicography.',
    samplePassages: [
      {
        id: 'mr-1',
        title: 'The Semantic Depth of Al-Rahman and Al-Rahim',
        arabicText: 'الرَّحْمَنُ عَامُّ الرَّحْمَةِ لِجَمِيعِ الْخَلْقِ، وَالرَّحِيمُ خَاصٌّ بِالْمُؤْمِنِينَ.',
        englishTranslation: 'Al-Rahman refers to the all-encompassing mercy bestowed on all creation; Al-Rahim refers to the special, lasting mercy reserved for the believers.',
        reference: 'Al-Mufradat, Root R-H-M'
      }
    ]
  },
  {
    id: 'intro-qiraat',
    slug: 'introduction-to-the-ten-qiraat',
    title: 'Al-Qawl al-Mufid: Introduction to the Ten Qira’at and 20 Riwayat',
    arabicTitle: 'القول المفيد في علم القراءات والروايات المتواترة',
    author: 'Shaykh Dr. Ayman Rushdi Suwayd & Senior Qira’at Council',
    authorBio: 'Contemporary master of Qira’at and world authority on Quranic phonetics and Sanad transmission.',
    category: 'quran_studies',
    categoryLabel: 'Quranic Studies & Tajweed',
    description: 'An authoritative introduction explaining the 7 Mutawatir and 3 Mashhur canonical Qira’at, their 20 authentic Riwayat, their biographies, and geographical transmissions.',
    whatItTeaches: 'How the 20 Riwayat were revealed upon Seven Ahruf, preserving authentic dialectal diversity while maintaining textual unity.',
    importance: 'Direct companion to the Nur Al-Quran 20 Riwayat platform.',
    keyLessons: ['The 10 Imams and their 20 Rawis (Nafi’, Ibn Kathir, Abu Amr, Ibn ‘Amir, Asim, Hamzah, Al-Kisa’i, Abu Ja’far, Ya’qub, Khalaf al-’Ashir)', 'The miraculous harmony across all authentic readings.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Mutawatir transmission across millions of memorizers across fifteen centuries.',
    chaptersCount: 20,
    samplePassages: [
      {
        id: 'iqr-1',
        title: 'The Nature of the Canonical Riwayat',
        arabicText: 'الْقِرَاءَاتُ كُلُّهَا سُنَّةٌ مُتَّبَعَةٌ، أُنْزِلَتْ لِلتَّخْفِيفِ وَالتَّيْسِيرِ عَلَى أُمَّةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَكُلُّهَا حَقٌّ مِنْ عِنْدِ اللَّهِ.',
        englishTranslation: 'The Qira’at are all established prophetic traditions, revealed to grant ease and accommodation to the Ummah of Muhammad (ﷺ), and all of them are absolute truth from Allah.',
        hausaTranslation: 'Dukkan Qira\'o\'i sunna ce da aka bi, an saukar da su ne domin saukaka wa al\'ummar Muhammad (SAW), kuma dukansu gaskiya ne daga wajen Allah.',
        reference: 'Al-Qawl al-Mufid, Principles of Qira’at'
      }
    ]
  },
  {
    id: 'hifdh-guide',
    slug: 'guide-to-quran-memorization',
    title: 'Kayfa Tahfadh al-Qur’an (Methodologies of Quran Memorization)',
    arabicTitle: 'كيف تحفظ القرآن الكريم: المناهج العلمية للضبط والإتقان',
    author: 'Dr. Yahya al-Ghawthani (Ph.D. in Quranic Sciences)',
    authorBio: 'World-renowned expert in Quran memorization pedagogies and memory retention systems.',
    category: 'quran_studies',
    categoryLabel: 'Quranic Studies & Tajweed',
    description: 'Practical, tested methodologies for memorizing the 604 pages of the Holy Quran, retaining verses, managing revisions, and overcoming plateaus.',
    whatItTeaches: 'Daily schedules, review matrices (Muraja’ah), visual page memory, and spiritual discipline.',
    importance: 'Used by thousands of Tahfiz institutes across Africa, the Middle East, and Asia.',
    keyLessons: ['Consistency over quantity', 'Fixing one standard Mushaf edition (e.g. Madinah 604-page)', 'Reciting memorized portions in Tahajjud.'],
    originalLanguage: 'Arabic',
    availableTranslations: ['Arabic', 'English', 'Hausa'],
    authenticityInfo: 'Backed by both prophetic traditions on Quran retention and cognitive science.',
    samplePassages: [
      {
        id: 'hg-1',
        title: 'The Golden Rule of Retention',
        arabicText: 'التَّكْرَارُ يُثَبِّتُ الْمَحْفُوظَ فِي الْقَلْبِ، وَمَنْ لاَ يُرَاجِعُ يَنْسَى كَمَا تَنْفَلِتُ الإِبِلُ فِي عُقُلِهَا.',
        englishTranslation: 'Repetition cements the memorized text in the heart; whoever does not review will forget, just as a camel slips away from its rope.',
        reference: 'Kayfa Tahfadh al-Qur’an'
      }
    ]
  }
];

export function getBookById(id: string): LibraryBook | undefined {
  return ISLAMIC_BOOKS.find(b => b.id === id || b.slug === id);
}

export function getBooksByCategory(category: LibraryBook['category']): LibraryBook[] {
  return ISLAMIC_BOOKS.filter(b => b.category === category);
}

export function searchBooks(query: string): LibraryBook[] {
  const q = query.toLowerCase().trim();
  if (!q) return ISLAMIC_BOOKS;
  return ISLAMIC_BOOKS.filter(b => 
    b.title.toLowerCase().includes(q) ||
    b.arabicTitle.includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.description.toLowerCase().includes(q) ||
    b.categoryLabel.toLowerCase().includes(q) ||
    b.keyLessons.some(k => k.toLowerCase().includes(q))
  );
}
