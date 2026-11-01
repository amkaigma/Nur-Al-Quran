export interface HisnulDuaItem {
  id: string;
  sectionId: string;
  title: string;
  arabicTitle: string;
  arabic: string;
  transliteration: string;
  english: string;
  hausa: string;
  reference: string;
  targetCount: number;
  virtue?: string;
}

export interface HisnulSection {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  icon: string;
  duaCount: number;
}

export const HISNUL_SECTIONS: HisnulSection[] = [
  {
    id: 'morning_evening',
    title: 'Morning & Evening Adhkar',
    arabicTitle: 'أذكار الصباح والمساء',
    description: 'Essential daily fortress recited after Fajr and Asr prayers for divine protection and barakah.',
    icon: 'Sun',
    duaCount: 6
  },
  {
    id: 'sleep_wake',
    title: 'Sleeping & Waking Up',
    arabicTitle: 'أذكار النوم والاستيقاظ',
    description: 'Prophetic supplications when retiring to bed, turning in sleep, waking, and seeing dreams.',
    icon: 'Moon',
    duaCount: 5
  },
  {
    id: 'after_salah',
    title: 'After Obligatory Prayers',
    arabicTitle: 'الأذكار بعد السلام من الصلاة',
    description: 'The prescribed Tasbih, Tahmid, Takbir and Ayat al-Kursi following the Taslim.',
    icon: 'CheckCircle2',
    duaCount: 5
  },
  {
    id: 'home',
    title: 'Entering & Leaving Home',
    arabicTitle: 'دعاء دخول المنزل والخروج منه',
    description: 'Prayers for angels companionship upon stepping out and peace upon entering the residence.',
    icon: 'Home',
    duaCount: 3
  },
  {
    id: 'mosque',
    title: 'Entering & Leaving the Mosque',
    arabicTitle: 'دعاء دخول المسجد والخروج منه',
    description: 'Seeking Allah’s gates of mercy when entering and His divine bounty when stepping out.',
    icon: 'Building2',
    duaCount: 3
  },
  {
    id: 'food_fasting',
    title: 'Eating, Drinking & Fasting',
    arabicTitle: 'أذكار الطعام والشراب والصيام',
    description: 'Bismillah before meals, praising Allah upon finishing, and breaking the fast (Iftar).',
    icon: 'Utensils',
    duaCount: 4
  },
  {
    id: 'travel',
    title: 'Travel, Riding & Journeys',
    arabicTitle: 'دعاء السفر والركوب',
    description: 'Takbir on elevations, Tasbih in valleys, and the complete comprehensive travel supplication.',
    icon: 'Compass',
    duaCount: 3
  },
  {
    id: 'distress_anxiety',
    title: 'Distress, Anxiety & Illness',
    arabicTitle: 'دعاء الكرب والهم والحزن وعيادة المريض',
    description: 'Prophetic remedies for psychological grief, sadness, overwhelming debt, and visiting the sick.',
    icon: 'HeartHandshake',
    duaCount: 4
  },
  {
    id: 'forgiveness_istighfar',
    title: 'Seeking Forgiveness & Repentance',
    arabicTitle: 'الاستغفار والتوبة وسيد الاستغفار',
    description: 'Sayyid al-Istighfar and sincere Tawbah to wash away sins and soften the believer’s heart.',
    icon: 'Sparkles',
    duaCount: 4
  },
  {
    id: 'ruqyah_protection',
    title: 'Protection & Ruqyah Shar’iyyah',
    arabicTitle: 'الاستعاذة والحماية والرقية الشرعية',
    description: 'Seeking refuge in Allah’s perfect words from the evil eye, envy (Hasad), and satanic whisperings.',
    icon: 'ShieldCheck',
    duaCount: 4
  }
];

export const HISNUL_DUAS: HisnulDuaItem[] = [
  // 1. MORNING & EVENING
  {
    id: 'me-1',
    sectionId: 'morning_evening',
    title: 'Ayat al-Kursi (The Throne Verse)',
    arabicTitle: 'آية الكرسي',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta\'khudhuhu sinatuw-wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih. Ya\'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay\'im-min \'ilmihi illa bima sha\'. Wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'uduhu hifdhuhuma, wa Huwal-\'Aliyyul-\'Adheem.',
    english: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    hausa: 'Allah, babu abin bautawa da gaskiya sai Shi, Rayayye, Mai tsaye da kansa da komai. Gyangyadi ba ya kama Shi, kuma barci ba ya kama Shi. NaSa ne abin da ke cikin sammai da abin da ke cikin kasa. Wane ne wanda zai yi ceto a wurinSa sai da izininsa? Yana sanin abin da ke gaba da su da abin da ke bayansu, kuma ba su kewayewa da wani abu daga iliminSa sai da abin da Ya so. KursiyyinSa ya yalwaci sammai da kasa, kuma kiyaye su ba ya gajiyar da Shi. Kuma Shi ne Madaukaki, Mai girma.',
    reference: 'Surah Al-Baqarah 2:255; Sahih al-Bukhari & An-Nasa\'i',
    targetCount: 1,
    virtue: 'Whoever recites it in the morning is protected until the evening, and whoever recites it in the evening is protected until the morning.'
  },
  {
    id: 'me-2',
    sectionId: 'morning_evening',
    title: 'Surahs Al-Ikhlas, Al-Falaq & An-Nas (Al-Mu\'awwidhat)',
    arabicTitle: 'المعوذات الثلاث',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Qul Huwallahu Ahad... Qul a\'udhu bi Rabbil-falaq... Qul a\'udhu bi Rabbin-nas...',
    english: 'Recite Surah Al-Ikhlas, Surah Al-Falaq, and Surah An-Nas completely three times.',
    hausa: 'Karanta Suratul Ikhlas, Suratul Falaq, da Suratun Nas sau uku da safe da yamma.',
    reference: 'Sunan Abu Dawud (5082), At-Tirmidhi (3575) - Sahih',
    targetCount: 3,
    virtue: 'The Prophet ﷺ said: "Recite them three times in the evening and in the morning, and they will suffice you against everything."'
  },
  {
    id: 'me-3',
    sectionId: 'morning_evening',
    title: 'Sayyid al-Istighfar (The Master of Supplications for Forgiveness)',
    arabicTitle: 'سيد الاستغفار',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mastata\'tu, a\'udhu bika min sharri ma sana\'tu, abu\'u laka bi-ni\'matika \'alayya, wa abu\'u laka bi-dhanbi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Ant.',
    english: 'O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge before You Your blessings upon me, and I confess my sins to You. So forgive me, for none forgives sins except You.',
    hausa: 'Ya Allah, Kai ne Ubangijina, babu abin bautawa da gaskiya sai Kai. Ka halicce ni kuma ni bawanKa ne, kuma ina kan alkawarinKa da wa\'adinKa gwargwadon ikona. Ina neman tsarinka daga sharrin abin da na aikata. Ina amincewa da ni\'imarKa a kaina, kuma ina amincewa da zunubina gare Ka, saboda haka Ka gafarta mini, hakika babu mai gafarta zunubai sai Kai.',
    reference: 'Sahih al-Bukhari (6306)',
    targetCount: 1,
    virtue: 'Whoever recites this with firm conviction in the morning and dies before evening will be of the people of Paradise, and vice versa.'
  },
  {
    id: 'me-4',
    sectionId: 'morning_evening',
    title: 'Seeking Protection by the Name of Allah',
    arabicTitle: 'الاستعاذة باسم الله الذي لا يضر مع اسمه شيء',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Aleem.',
    english: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, the All-Knowing.',
    hausa: 'Da sunan Allah, wanda babu wani abu da zai iya cutarwa tare da sunanSa a cikin kasa ko a sama, kuma Shi ne Mai ji, Mai sani.',
    reference: 'Sunan Abu Dawud (5088), At-Tirmidhi (3388) - Sahih',
    targetCount: 3,
    virtue: 'Recited 3 times morning and evening: Nothing shall harm the reciter.'
  },
  {
    id: 'me-5',
    sectionId: 'morning_evening',
    title: 'Contentment with Allah, Islam, and the Prophet ﷺ',
    arabicTitle: 'الرضا بالله ربا وبالإسلام دينا وبمحمد نبيا',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration: 'Raditu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin sallallahu \'alayhi wa sallama Nabiyya.',
    english: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings of Allah be upon him) as my Prophet.',
    hausa: 'Na yarda da Allah a matsayin Ubangiji, kuma da Musulunci a matsayin addini, kuma da Muhammad (SAW) a matsayin Annabi.',
    reference: 'Sunan Abu Dawud (5072), Ahmad (4/337) - Sahih',
    targetCount: 3,
    virtue: 'Allah takes it upon Himself to please whoever says this three times in the morning and three times in the evening on the Day of Resurrection.'
  },
  {
    id: 'me-6',
    sectionId: 'morning_evening',
    title: 'Supplication for Well-Being (Afiyah)',
    arabicTitle: 'دعاء العافية في الدنيا والآخرة',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي',
    transliteration: 'Allahumma inni as\'alukal-\'afiyata fid-dunya wal-akhirah. Allahumma inni as\'alukal-\'afwa wal-\'afiyata fi dini wa dunyaya wa ahli wa mali. Allahummas-tur \'awrati wa amin raw\'ati.',
    english: 'O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family, and my wealth. O Allah, conceal my faults and protect me from my fears.',
    hausa: 'Ya Allah, ina rokonKa lafiya da zaman lafiya a duniya da lahira. Ya Allah, ina rokonKa gafara da aminci a cikin addinina, da duniyata, da iyalina, da dukiyata. Ya Allah, Ka rufe asirina, kuma Ka kwantar da hankalina daga tsoro.',
    reference: 'Sunan Abu Dawud (5074), Ibn Majah (3871) - Sahih',
    targetCount: 1,
    virtue: 'The Messenger of Allah ﷺ never neglected to say these words in the morning and evening.'
  },

  // 2. SLEEPING & WAKING UP
  {
    id: 'sw-1',
    sectionId: 'sleep_wake',
    title: 'Supplication Before Sleeping',
    arabicTitle: 'دعاء قبل النوم',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya.',
    english: 'In Your Name, O Allah, I die and I live.',
    hausa: 'Da sunanKa ya Allah, nake mutuwa kuma nake rayuwa.',
    reference: 'Sahih al-Bukhari (6324)',
    targetCount: 1,
    virtue: 'Said when retiring to bed each night.'
  },
  {
    id: 'sw-2',
    sectionId: 'sleep_wake',
    title: 'Supplication Upon Waking Up',
    arabicTitle: 'دعاء الاستيقاظ من النوم',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur.',
    english: 'All praise is for Allah Who gave us life after having taken it from us, and unto Him is the resurrection.',
    hausa: 'Godiya ta tabbata ga Allah Wanda Ya raya mu bayan Ya matar da mu, kuma zuwa gare Shi ne tashi yake.',
    reference: 'Sahih al-Bukhari (6312)',
    targetCount: 1,
    virtue: 'Acknowledging the renewal of life each morning.'
  },
  {
    id: 'sw-3',
    sectionId: 'sleep_wake',
    title: 'Tasbih, Tahmid and Takbir of Fatimah (RA) Before Sleeping',
    arabicTitle: 'تسبيح النوم',
    arabic: 'سُبْحَانَ اللَّهِ (٣٣) ، وَالْحَمْدُ لِلَّهِ (٣٣) ، وَاللَّهُ أَكْبَرُ (٣٤)',
    transliteration: 'Subhanallah (33 times), Alhamdulillah (33 times), Allahu Akbar (34 times).',
    english: 'Glory be to Allah (33 times), Praise be to Allah (33 times), Allah is the Greatest (34 times).',
    hausa: 'Tsarki ya tabbata ga Allah (sau 33), Godiya ta tabbata ga Allah (sau 33), Allah Mai girma ne (sau 34).',
    reference: 'Sahih al-Bukhari (3705), Sahih Muslim (2727)',
    targetCount: 34,
    virtue: 'The Prophet ﷺ told Ali and Fatimah: "Shall I not direct you to what is better for you than a servant? Recite this when going to bed."'
  },
  {
    id: 'sw-4',
    sectionId: 'sleep_wake',
    title: 'Placing One\'s Side Down (Bismika Rabbi)',
    arabicTitle: 'وضع الجنب عند النوم',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: 'Bismika Rabbi wada\'tu janbi wa bika arfa\'uh, in amsakta nafsi far-hamha, wa in arsaltaha fahfadh-ha bima tahfadhu bihi \'ibadakas-salihin.',
    english: 'In Your Name my Lord, I lie down, and by Your Name I rise. If You should take my soul, have mercy upon it, and if You should return it, then protect it as You protect Your righteous servants.',
    hausa: 'Da sunanKa ya Ubangijina na ajiye gefena, kuma da sunanKa nake daukaka shi. Idan Ka rike raina Ka yi masa rahama, idan kuma Ka bar shi Ka kiyaye shi kamar yadda Kake kiyaye bayinKa na kwarai.',
    reference: 'Sahih al-Bukhari (6320), Sahih Muslim (2714)',
    targetCount: 1,
    virtue: 'Dust bed three times, sleep on right side, and recite.'
  },
  {
    id: 'sw-5',
    sectionId: 'sleep_wake',
    title: 'When Restless or Frightened in Sleep',
    arabicTitle: 'دعاء الفزع في النوم',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ، وَشَرِّ عِبَادِهِ، وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ',
    transliteration: 'A\'udhu bi-kalimatil-lahit-tammati min ghadabihi wa \'iqabihi, wa sharri \'ibadihi, wa min hamazatish-shayatini wa an yahdurun.',
    english: 'I seek refuge in the perfect words of Allah from His anger and punishment, from the evil of His servants, and from the whisperings of devils and from their presence.',
    hausa: 'Ina neman tsari da cikakkun kalmomin Allah daga fushinSa da azabarSa, da sharrin bayinSa, da kuma daga sharrin shaidanu da halartarsu a wurina.',
    reference: 'Sunan Abu Dawud (3893), At-Tirmidhi (3528) - Hasan',
    targetCount: 1,
    virtue: 'Brings immediate peace and banishes nightmares.'
  },

  // 3. AFTER OBLIGATORY PRAYERS
  {
    id: 'as-1',
    sectionId: 'after_salah',
    title: 'Istighfar & Allahumma Antas-Salam',
    arabicTitle: 'الاستغفار والسلام بعد الصلاة',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: 'Astaghfirullah, Astaghfirullah, Astaghfirullah. Allahumma Antas-Salamu wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.',
    english: 'I ask Allah for forgiveness (three times). O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of majesty and honor.',
    hausa: 'Ina neman gafarar Allah (sau uku). Ya Allah, Kai ne Aminci kuma daga gare Ka aminci yake, Ka tsarkaka ya Mai girma da karamci.',
    reference: 'Sahih Muslim (591)',
    targetCount: 1,
    virtue: 'Recited immediately upon completing the Salah after the Taslim.'
  },
  {
    id: 'as-2',
    sectionId: 'after_salah',
    title: 'Tahlil and Surrender of Sovereignty',
    arabicTitle: 'لا إله إلا الله وحده لا شريك له',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa \'ala kulli shay\'in qadir. Allahumma la mani\'a lima a\'tayt, wa la mu\'tiya lima mana\'t, wa la yanfa\'u dhal-jaddi minkal-jadd.',
    english: 'There is no deity except Allah alone, without partner. To Him belongs all kingdom and praise, and He is over all things capable. O Allah, none can prevent what You give, nor can anyone give what You prevent, and wealth cannot avail the wealthy against You.',
    hausa: 'Babu abin bautawa da gaskiya sai Allah Shi kadai ba Shi da abokin tarayya, mulki naSa ne kuma godiya taSa ce, kuma Shi a kan komai Mai iko ne. Ya Allah, babu mai iya hana abin da Ka bayar, kuma babu mai iya bayar da abin da Ka hana, kuma dukiya ba za ta amfani mai ita a gabanka ba.',
    reference: 'Sahih al-Bukhari (844), Sahih Muslim (593)',
    targetCount: 1,
    virtue: 'Affirms pure Tawhid and sovereignty after each prayer.'
  },
  {
    id: 'as-3',
    sectionId: 'after_salah',
    title: 'The Prophetic Tasbih (33x, 33x, 33x + 1)',
    arabicTitle: 'التسبيح والتحميد والتكبير بعد الصلاة',
    arabic: 'سُبْحَانَ اللَّهِ (٣٣) ، الْحَمْدُ لِلَّهِ (٣٣) ، اللَّهُ أَكْبَرُ (٣٣) — تَمَامَ الْمِائَةِ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x). Seal with: La ilaha illallahu wahdahu la sharika lah...',
    english: 'Glory be to Allah (33 times), Praise be to Allah (33 times), Allah is the Greatest (33 times). Completed to 100 with: None has the right to be worshipped except Allah alone...',
    hausa: 'Tsarki ya tabbata ga Allah (sau 33), Godiya ta tabbata ga Allah (sau 33), Allah Mai girma ne (sau 33), a cika 100 da: Babu abin bautawa sai Allah Shi kadai...',
    reference: 'Sahih Muslim (597)',
    targetCount: 33,
    virtue: 'Whoever recites this after every prayer, their sins will be forgiven even if they are like the foam of the sea.'
  },
  {
    id: 'as-4',
    sectionId: 'after_salah',
    title: 'Ayat al-Kursi After Every Fard Prayer',
    arabicTitle: 'آية الكرسي دبر كل صلاة',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum...',
    english: 'Recite Ayat al-Kursi (Surah Al-Baqarah 2:255).',
    hausa: 'Karanta Ayatul Kursiyyu bayan kowace sallar farilla.',
    reference: 'An-Nasa\'i in Amal al-Yawm wal-Laylah (100) - Sahih',
    targetCount: 1,
    virtue: 'The Prophet ﷺ said: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death."'
  },
  {
    id: 'as-5',
    sectionId: 'after_salah',
    title: 'Supplication for Remembrance and Gratefulness',
    arabicTitle: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
    transliteration: 'Allahumma a\'inni \'ala dhikrika, wa shukrika, wa husni \'ibadatik.',
    english: 'O Allah, help me remember You, thank You, and worship You in the best manner.',
    hausa: 'Ya Allah, Ka taimake ni wajen ambatonKa, da gode maKa, da kyautata bautarKa.',
    reference: 'Sunan Abu Dawud (1522), An-Nasa\'i (1303) - Sahih',
    targetCount: 1,
    virtue: 'The Prophet ﷺ advised Mu\'adh ibn Jabal: "Never forget to say this after every prayer."'
  },

  // 4. ENTERING & LEAVING HOME
  {
    id: 'hm-1',
    sectionId: 'home',
    title: 'Supplication Upon Leaving the Home',
    arabicTitle: 'دعاء الخروج من المنزل',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi, tawakkaltu \'alallahi, wa la hawla wa la quwwata illa billah.',
    english: 'In the Name of Allah, I place my trust in Allah, and there is no power or might except with Allah.',
    hausa: 'Da sunan Allah, na dogara ga Allah, kuma babu dabara babu karfi sai tare da Allah.',
    reference: 'Sunan Abu Dawud (5095), At-Tirmidhi (3426) - Sahih',
    targetCount: 1,
    virtue: 'It is said to him: "You are guided, defended, and protected," and devils step away from his path.'
  },
  {
    id: 'hm-2',
    sectionId: 'home',
    title: 'Supplication Upon Entering the Home',
    arabicTitle: 'دعاء دخول المنزل',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'alallahi Rabbina tawakkalna.',
    english: 'In the Name of Allah we enter, in the Name of Allah we leave, and upon Allah our Lord we rely. (Then greet the family with Salam).',
    hausa: 'Da sunan Allah muka shiga, da sunan Allah muka fita, kuma ga Allah Ubangijinmu muka dogara. (Sai a yi sallama ga iyalai).',
    reference: 'Sunan Abu Dawud (5096) - Sahih',
    targetCount: 1,
    virtue: 'Satan tells his companions: "There is no lodging for you here tonight nor dinner."'
  },
  {
    id: 'hm-3',
    sectionId: 'home',
    title: 'Protection from Deviation Upon Stepping Out',
    arabicTitle: 'الاستعاذة من الضلال عند الخروج',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ',
    transliteration: 'Allahumma inni a\'udhu bika an adilla aw udall, aw azilla aw uzall, aw adhlima aw udhlam, aw ajhala aw yujhala \'alayya.',
    english: 'O Allah, I seek refuge in You lest I deviate or be led astray, slip or be made to slip, oppress or be oppressed, behave foolishly or be treated foolishly.',
    hausa: 'Ya Allah, ina neman tsarinka daga in bace ko a batar da ni, ko in kauce ko a kauce da ni, ko in yi zalunci ko a zalunce ni, ko in yi jahilci ko a yi jahilci a kaina.',
    reference: 'Sunan Abu Dawud (5094), At-Tirmidhi (3427) - Sahih',
    targetCount: 1,
    virtue: 'Prophetic Sunnah whenever leaving one\'s door.'
  },

  // 5. ENTERING & LEAVING THE MOSQUE
  {
    id: 'mq-1',
    sectionId: 'mosque',
    title: 'Supplication When Entering the Mosque',
    arabicTitle: 'دعاء دخول المسجد',
    arabic: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Bismillahi, was-salatu was-salamu \'ala Rasulillah. Allahummaftah li abwaba rahmatik.',
    english: 'In the Name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, open for me the gates of Your mercy.',
    hausa: 'Da sunan Allah, da salati da aminci su tabbata ga Manzon Allah. Ya Allah, Ka bude mini kofofin rahamarKa.',
    reference: 'Sahih Muslim (713)',
    targetCount: 1,
    virtue: 'Step in with the right foot.'
  },
  {
    id: 'mq-2',
    sectionId: 'mosque',
    title: 'Supplication When Leaving the Mosque',
    arabicTitle: 'دعاء الخروج من المسجد',
    arabic: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ، اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: 'Bismillahi, was-salatu was-salamu \'ala Rasulillah. Allahumma inni as\'aluka min fadlik. Allahumma\'simni minash-shaytanir-rajim.',
    english: 'In the Name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, I ask You from Your bounty. O Allah, protect me from the accursed devil.',
    hausa: 'Da sunan Allah, da salati da aminci su tabbata ga Manzon Allah. Ya Allah, ina rokonKa daga falalarKa. Ya Allah, Ka tsare ni daga shaidan tsinanne.',
    reference: 'Sahih Muslim (713), Ibn Majah (773)',
    targetCount: 1,
    virtue: 'Step out with the left foot.'
  },
  {
    id: 'mq-3',
    sectionId: 'mosque',
    title: 'Seeking Protection from the Outcast Satan Upon Entering',
    arabicTitle: 'الاستعاذة بالله العظيم عند دخول المسجد',
    arabic: 'أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: 'A\'udhu billahil-\'Adheem, wa bi-wajhihil-karim, wa sultanihil-qadim, minash-shaytanir-rajim.',
    english: 'I seek refuge in Allah the Supreme, and in His Noble Face, and in His eternal authority, from the accursed devil.',
    hausa: 'Ina neman tsari da Allah Mai girma, da kyawawan Fuskarsa, da Tabbataccen IkonSa, daga shaidan tsinanne.',
    reference: 'Sunan Abu Dawud (466) - Sahih',
    targetCount: 1,
    virtue: 'When said, Satan exclaims: "He is protected from me for the rest of the day!"'
  },

  // 6. EATING, DRINKING & FASTING
  {
    id: 'fd-1',
    sectionId: 'food_fasting',
    title: 'Supplication Before Starting a Meal',
    arabicTitle: 'التسمية قبل الطعام',
    arabic: 'بِسْمِ اللَّهِ — فَإِنْ نَسِيَ: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ',
    transliteration: 'Bismillah. (If forgotten at start: Bismillahi fi awwalihi wa akhirih).',
    english: 'In the Name of Allah. (If forgotten: In the Name of Allah in its beginning and its end).',
    hausa: 'Da sunan Allah. (Idan an manta a farko: Da sunan Allah a farkonsa da karshensa).',
    reference: 'Sunan Abu Dawud (3767), At-Tirmidhi (1858) - Sahih',
    targetCount: 1,
    virtue: 'Brings blessing to the sustenance and prevents Satan from sharing the meal.'
  },
  {
    id: 'fd-2',
    sectionId: 'food_fasting',
    title: 'Supplication After Finishing a Meal',
    arabicTitle: 'حمد الله بعد الفراغ من الطعام',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا الطَّعَامَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahil-ladhi at\'amani hadhat-ta\'ama wa razaqanihi min ghayri hawlin minni wa la quwwah.',
    english: 'All praise is for Allah Who fed me this food and provided it for me without any power or strength from my part.',
    hausa: 'Godiya ta tabbata ga Allah Wanda Ya ciyar da ni wannan abinci kuma Ya azurta ni da shi ba tare da wata dabara tawa ba ko karfina.',
    reference: 'Sunan Abu Dawud (4023), At-Tirmidhi (3458) - Sahih',
    targetCount: 1,
    virtue: 'Whoever says this, his past sins will be forgiven.'
  },
  {
    id: 'fd-3',
    sectionId: 'food_fasting',
    title: 'Supplication When Breaking the Fast (Iftar)',
    arabicTitle: 'دعاء الإفطار للصائم',
    arabic: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahabadh-dhama\'u, wab-tallatil-\'uruqu, wa thabatal-ajru in sha\'Allah.',
    english: 'The thirst has vanished, the veins have been moistened, and the reward is confirmed, if Allah wills.',
    hausa: 'Kishirwa ta tafi, jijiyoyi sun jika, kuma lada ya tabbata in sha Allahu.',
    reference: 'Sunan Abu Dawud (2357) - Hasan',
    targetCount: 1,
    virtue: 'Prophetic tradition upon taking the first date or sip of water at sunset.'
  },
  {
    id: 'fd-4',
    sectionId: 'food_fasting',
    title: 'Supplication for the Host Who Provided Food',
    arabicTitle: 'دعاء الضيف لأهل الطعام',
    arabic: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ، وَارْحَمْهُمْ',
    transliteration: 'Allahumma barik lahum fima razaqtahum, waghfir lahum, war-hamhum.',
    english: 'O Allah, bless for them that which You have provided them, forgive them, and have mercy upon them.',
    hausa: 'Ya Allah, Ka albarkace su a cikin abin da Ka azurta su da shi, Ka gafarta musu, kuma Ka yi musu rahama.',
    reference: 'Sahih Muslim (2042)',
    targetCount: 1,
    virtue: 'Invokes Barakah on the home and family.'
  },

  // 7. TRAVEL, RIDING & JOURNEYS
  {
    id: 'tr-1',
    sectionId: 'travel',
    title: 'The Great Travel Supplication (Dua as-Safar)',
    arabicTitle: 'دعاء السفر والركوب',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ',
    transliteration: 'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun. Allahumma inna nas\'aluka fi safarina hadhal-birra wat-taqwa, wa minal-\'amali ma tarda. Allahumma hawwin \'alayna safarana hadha watwi \'anna bu\'dah. Allahumma Antas-Sahibu fis-safar, wal-khalifatu fil-ahl.',
    english: 'Glory is to Him Who has subjected this to us, and we were not capable of it by ourselves, and to our Lord we will surely return. O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You. O Allah, lighten this journey for us and shorten its distance. O Allah, You are the Companion in travel and the Protector of the family.',
    hausa: 'Tsarki ya tabbata ga Wanda Ya hore mana wannan, kuma ba mu kasance masu iko da shi ba, kuma zuwa ga Ubangijinmu hakika masu komawa ne. Ya Allah, muna rokonKa a cikin wannan tafiya tamu da biyayya da takawa, da aiki da Kake yarda da shi. Ya Allah, Ka saukaka mana wannan tafiya tamu kuma Ka nade mana nisan ta. Ya Allah, Kai ne Abokin tafiya, kuma Mai maye gurbinmu a cikin iyali.',
    reference: 'Sahih Muslim (1342)',
    targetCount: 1,
    virtue: 'Prophetic Sunnah when boarding car, airplane, train, or vessel.'
  },
  {
    id: 'tr-2',
    sectionId: 'travel',
    title: 'Takbir When Going Uphill, Tasbih When Going Downhill',
    arabicTitle: 'التكبير عند الصعود والتسبيح عند النزول',
    arabic: 'اللَّهُ أَكْبَرُ (عِنْدَ الصُّعُودِ) — سُبْحَانَ اللَّهِ (عِنْدَ النُّزُولِ)',
    transliteration: 'Allahu Akbar (when ascending) — Subhanallah (when descending).',
    english: 'Allah is the Greatest (when climbing slopes or rising) — Glory be to Allah (when descending valleys or landing).',
    hausa: 'Allahu Akbar (lokacin hawa tudu ko tashi) — Subhanallah (lokacin gangarowa kwararo ko sauka).',
    reference: 'Sahih al-Bukhari (2993)',
    targetCount: 3,
    virtue: 'Maintains remembrance of Allah throughout geographic transitions.'
  },
  {
    id: 'tr-3',
    sectionId: 'travel',
    title: 'Supplication When Returning from Travel',
    arabicTitle: 'دعاء الرجوع من السفر',
    arabic: 'آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Ayibuna, ta\'ibuna, \'abiduna, li-Rabbina hamidun.',
    english: 'We return, repenting, worshipping, and praising our Lord.',
    hausa: 'Muna masu dawowa, masu tuba, masu bauta, ga Ubangijinmu muna masu godiya.',
    reference: 'Sahih Muslim (1342)',
    targetCount: 1,
    virtue: 'Recited upon entering one\'s hometown after a voyage.'
  },

  // 8. DISTRESS, ANXIETY & SICKNESS
  {
    id: 'da-1',
    sectionId: 'distress_anxiety',
    title: 'Supplication for Anxiety and Grief',
    arabicTitle: 'دعاء إزالة الهم والحزن',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wal-\'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala\'id-dayni wa ghalabatir-rijal.',
    english: 'O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from miserliness and cowardice, from being overcome by debt, and from being overpowered by men.',
    hausa: 'Ya Allah, ina neman tsarinka daga damuwa da bakin ciki, da kasawa da lalaci, da rowa da matsoraciya, da nauyin bashi da rinjayen maza.',
    reference: 'Sahih al-Bukhari (2893)',
    targetCount: 1,
    virtue: 'Brings immense psychological relief and unburdens heavy hearts.'
  },
  {
    id: 'da-2',
    sectionId: 'distress_anxiety',
    title: 'Supplication in Severe Calamity or Distress',
    arabicTitle: 'دعاء الكرب العظيم',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration: 'La ilaha illallahul-\'Adheemul-Halim, la ilaha illallahu Rabbul-\'Arshil-\'Adheem, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-\'Arshil-Karim.',
    english: 'There is no deity except Allah, the Magnificent, the Forbearing. There is no deity except Allah, Lord of the Magnificent Throne. There is no deity except Allah, Lord of the heavens and Lord of the earth, and Lord of the Noble Throne.',
    hausa: 'Babu abin bautawa da gaskiya sai Allah Mai girma, Mai yafiya. Babu abin bautawa da gaskiya sai Allah Ubangijin Al\'arshi Mai girma. Babu abin bautawa da gaskiya sai Allah Ubangijin sammai da Ubangijin kasa da Ubangijin Al\'arshi Mai karamci.',
    reference: 'Sahih al-Bukhari (6345), Sahih Muslim (2730)',
    targetCount: 1,
    virtue: 'The Prophet ﷺ recited this in times of severe distress and trial.'
  },
  {
    id: 'da-3',
    sectionId: 'distress_anxiety',
    title: 'Supplication of Prophet Yunus (Dhun-Nun) in the Whale',
    arabicTitle: 'دعاء ذي النون في بطن الحوت',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa Anta subhanaka inni kuntu minadh-dhalimin.',
    english: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    hausa: 'Babu abin bautawa da gaskiya sai Kai, tsarki ya tabbata a gare Ka, hakika na kasance daga cikin azzalumai.',
    reference: 'Surah Al-Anbiya 21:87; Jami\' at-Tirmidhi (3505) - Sahih',
    targetCount: 1,
    virtue: 'The Prophet ﷺ said: "No Muslim supplicates with this for anything except that Allah answers his call."'
  },
  {
    id: 'da-4',
    sectionId: 'distress_anxiety',
    title: 'Supplication When Visiting a Sick Person',
    arabicTitle: 'دعاء عيادة المريض',
    arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ (٧ مَرَّاتٍ)',
    transliteration: 'As\'alullahal-\'Adheema Rabbal-\'Arshil-\'Adheemi an yashfiyak.',
    english: 'I ask Allah the Magnificent, Lord of the Magnificent Throne, to cure you. (Repeat 7 times).',
    hausa: 'Ina rokon Allah Mai girma, Ubangijin Al\'arshi Mai girma, da Ya warkar da kai. (Maimaita sau 7).',
    reference: 'Sunan Abu Dawud (3106), At-Tirmidhi (2083) - Sahih',
    targetCount: 7,
    virtue: 'Whoever visits a sick person whose term has not arrived and recites this seven times, Allah will cure him.'
  },

  // 9. SEEKING FORGIVENESS & REPENTANCE
  {
    id: 'fi-1',
    sectionId: 'forgiveness_istighfar',
    title: 'The Continuous Daily Istighfar (100 times)',
    arabicTitle: 'استغفار النبي مائة مرة في اليوم',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha wa atubu ilayh.',
    english: 'I seek the forgiveness of Allah and I turn to Him in repentance.',
    hausa: 'Ina neman gafarar Allah kuma ina tuba zuwa gare Shi.',
    reference: 'Sahih al-Bukhari (6307), Sahih Muslim (2702)',
    targetCount: 100,
    virtue: 'The Prophet ﷺ said: "By Allah, I seek forgiveness of Allah and turn to Him in repentance more than seventy times a day."'
  },
  {
    id: 'fi-2',
    sectionId: 'forgiveness_istighfar',
    title: 'Supplication for Forgiveness for All Past and Secret Sins',
    arabicTitle: 'دعاء مغفرة الذنوب كلها',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    transliteration: 'Allahummagh-fir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa \'alaniyatahu wa sirrah.',
    english: 'O Allah, forgive me all of my sins, the minor and the major, the first and the last, the open and the secret.',
    hausa: 'Ya Allah, Ka gafarta mini dukkan zunubina, kankantarsa da girmansa, farkonsa da karshensa, bayyanannensa da boyayyensa.',
    reference: 'Sahih Muslim (483)',
    targetCount: 1,
    virtue: 'Prophetic supplication during prostration (Sujud).'
  },
  {
    id: 'fi-3',
    sectionId: 'forgiveness_istighfar',
    title: 'Supplication After Sitting in a Gathering (Kaffarat al-Majlis)',
    arabicTitle: 'كفارة المجلس',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: 'Subhanakallahumma wa bihamdika, ash-hadu alla ilaha illa Anta, astaghfiruka wa atubu ilayk.',
    english: 'Glory is to You, O Allah, and praise. I bear witness that there is no deity except You. I ask Your forgiveness and I repent to You.',
    hausa: 'Tsarki ya tabbata a gare Ka ya Allah da godiyarKa, na shaida babu abin bautawa da gaskiya sai Kai, ina neman gafararKa kuma ina tuba zuwa gare Ka.',
    reference: 'Jami\' at-Tirmidhi (3433), An-Nasa\'i (1344) - Sahih',
    targetCount: 1,
    virtue: 'Expiates any idle talk or shortcomings that occurred during the gathering.'
  },
  {
    id: 'fi-4',
    sectionId: 'forgiveness_istighfar',
    title: 'Supplication for Steadfastness in Faith',
    arabicTitle: 'دعاء الثبات على الدين',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    transliteration: 'Ya Muqallibal-qulubi thabbit qalbi \'ala dinik.',
    english: 'O Turner of hearts, make my heart steadfast upon Your religion.',
    hausa: 'Ya Mai juyar da zukata, Ka tabbatar da zuciyata a kan addininKa.',
    reference: 'Jami\' at-Tirmidhi (2140), Ahmad (12107) - Sahih',
    targetCount: 3,
    virtue: 'The most frequent supplication made by the Prophet ﷺ.'
  },

  // 10. PROTECTION & RUQYAH SHAR'IYYAH
  {
    id: 'rq-1',
    sectionId: 'ruqyah_protection',
    title: 'Seeking Refuge in Allah\'s Perfect Words',
    arabicTitle: 'الاستعاذة بكلمات الله التامات',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bi-kalimatil-lahit-tammati min sharri ma khalaq.',
    english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    hausa: 'Ina neman tsari da cikakkun kalmomin Allah daga sharrin abin da Ya halitta.',
    reference: 'Sahih Muslim (2708)',
    targetCount: 3,
    virtue: 'Whoever stops at a place and recites this, nothing will harm him until he departs from that place.'
  },
  {
    id: 'rq-2',
    sectionId: 'ruqyah_protection',
    title: 'Prophetic Protection for Children & Family',
    arabicTitle: 'تعويذ الأهل والأولاد',
    arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transliteration: 'U\'idhukuma bi-kalimatil-lahit-tammati min kulli shaytanin wa hammah, wa min kulli \'aynin lammah.',
    english: 'I seek refuge for you in the perfect words of Allah from every devil and poisonous creature, and from every evil envious eye.',
    hausa: 'Ina neman tsari gare ku da cikakkun kalmomin Allah daga kowane shaidan da dabba mai dafi, da kowane ido mai cutarwa.',
    reference: 'Sahih al-Bukhari (3371)',
    targetCount: 1,
    virtue: 'Recited by the Prophet ﷺ over his grandsons Al-Hasan and Al-Husayn.'
  },
  {
    id: 'rq-3',
    sectionId: 'ruqyah_protection',
    title: 'Prophetic Ruqyah for Pain in the Body',
    arabicTitle: 'رقية الألم في الجسد',
    arabic: 'بِسْمِ اللَّهِ (٣ مَرَّاتٍ) — أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧ مَرَّاتٍ)',
    transliteration: 'Bismillah (3x). Then recite 7x: A\'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir.',
    english: 'Place your hand on the place of pain and say: Bismillah (3 times), then say 7 times: I seek refuge in Allah and His power from the evil of what I feel and fear.',
    hausa: 'Sanya hannunka a wurin ciwon ka ce: Bismillah (sau 3), sannan ka ce sau 7: Ina neman tsari da Allah da ikonSa daga sharrin abin da nake ji da wanda nake tsoro.',
    reference: 'Sahih Muslim (2202)',
    targetCount: 7,
    virtue: 'Prophetic prescription taught to Uthman ibn Abi al-As for bodily affliction.'
  },
  {
    id: 'rq-4',
    sectionId: 'ruqyah_protection',
    title: 'Ruqyah of Angel Jibril for the Prophet ﷺ',
    arabicTitle: 'رقية جبريل عليه السلام للرسول',
    arabic: 'بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِسْمِ اللَّهِ أَرْقِيكَ',
    transliteration: 'Bismillahi arqik, min kulli shay\'in yu\'dhik, min sharri kulli nafsin aw \'ayni hasid, Allahu yashfik, bismillahi arqik.',
    english: 'In the Name of Allah I perform Ruqyah for you, from everything that may harm you, from the evil of every soul or envious eye. May Allah cure you; in the Name of Allah I perform Ruqyah for you.',
    hausa: 'Da sunan Allah nake yi maka rukiya, daga kowane abu da zai cutar da kai, daga sharrin kowane rai ko idon mai hassada, Allah Ya warkar da kai, da sunan Allah nake yi maka rukiya.',
    reference: 'Sahih Muslim (2186)',
    targetCount: 1,
    virtue: 'The supreme Ruqyah recited by the Archangel Jibril over Prophet Muhammad ﷺ.'
  }
];

export function getHisnulDuasBySection(sectionId: string): HisnulDuaItem[] {
  return HISNUL_DUAS.filter(d => d.sectionId === sectionId);
}

export function searchHisnulDuas(query: string): HisnulDuaItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return HISNUL_DUAS;
  return HISNUL_DUAS.filter(d => 
    d.title.toLowerCase().includes(q) ||
    d.arabic.includes(q) ||
    d.english.toLowerCase().includes(q) ||
    d.hausa.toLowerCase().includes(q) ||
    d.reference.toLowerCase().includes(q)
  );
}
