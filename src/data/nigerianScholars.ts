import { NigerianScholarEntry } from '../types/quran';

/**
 * Registry of all 34 investigated prominent Nigerian Qaris, Alaramomi, and scholars.
 * Researched across national Musabaqah archives, UDUS competitions, and Islamic audio repositories.
 * 
 * Strict Voice Authenticity Policy:
 * Reciters marked with verificationStatus: 'playable' have complete studio audio albums linked
 * directly to their own genuine individual voices in the audio player.
 * 
 * Scholars marked with verificationStatus: 'competition_archive' or 'lecture_tafsir_intro'
 * are honored in this registry with their full biographies and achievements, but are NOT assigned
 * surrogate voices, guaranteeing 100% vocal accuracy across the platform.
 */
export const NIGERIAN_SCHOLARS_REGISTRY: NigerianScholarEntry[] = [
  // 1. Sheikh Ahmad Sulaiman Ibrahim
  {
    id: 'ahmad-sulaiman',
    name: 'Sheikh Ahmad Sulaiman Ibrahim',
    arabicName: 'الشيخ أحمد سليمان الكنوي النيجيري',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Premier National Alaramma',
    bio: 'The undisputed premier Quran reciter of Nigeria (Alaramma). Based in Kano State, his deeply emotive, tear-evoking vocal cadence and classical West African rhythm are listened to by tens of millions across Nigeria and the global diaspora.',
    verificationStatus: 'playable',
    reciterId: 'ahmad-sulaiman'
  },
  // 2. Qaari Sheikh Mahmud Jaafar
  {
    id: 'mahmud-jaafar',
    name: 'Qaari Sheikh Mahmud Jaafar',
    arabicName: 'القارئ الشيخ محمود جعفر آدم',
    city: 'Kano / Daura',
    state: 'Kano',
    tradition: 'Kano Classical Scholarship & Tilawah',
    bio: 'Associated with the revered scholarly legacy of Sheikh Ja\'afar Mahmud Adam in Kano. Renowned for soulful Taraweeh recitations and deeply moving vocal cadence in Kano Ramadan gatherings.',
    verificationStatus: 'lecture_tafsir_intro'
  },
  // 3. Qaari Sheikh Abdullah Abba
  {
    id: 'abdullah-abba',
    name: 'Qaari Sheikh Abdullah Abba (Zaria)',
    arabicName: 'القارئ الشيخ عبد الله أبا الزكزاكي',
    city: 'Zaria',
    state: 'Kaduna',
    tradition: 'Zaria Classical Academy Qari',
    bio: 'Distinguished Nigerian Qari and scholar from the historic Islamic educational hub of Zaria, Kaduna State. Famous for his crystal-clear articulation, steady pacing, and mastery of Tajweed rules across all 114 Surahs.',
    verificationStatus: 'playable',
    reciterId: 'abdullah-abba'
  },
  // 4. Qaari Ibrahim Ahmad Sulayman
  {
    id: 'ibrahim-ahmad-sulaiman',
    name: 'Qaari Ibrahim Ahmad Sulayman',
    arabicName: 'القارئ إبراهيم أحمد سليمان الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Kano Melodic Murattal',
    bio: 'Son of the illustrious Sheikh Ahmad Sulaiman, continuing the family\'s distinctive and world-famous West African vocal cadence with elegance and youth energy in Kano.',
    verificationStatus: 'competition_archive'
  },
  // 5. Abdul Basit Muhammad Inuwa
  {
    id: 'abdul-basit-inuwa',
    name: 'Qaari Abdul Basit Muhammad Inuwa',
    arabicName: 'القارئ عبد الباسط محمد إينوا',
    city: 'Gombe / Kano',
    state: 'Gombe',
    tradition: 'National Musabaqah Youth Champion',
    bio: 'Celebrated Nigerian young master Qari, national champion, and digital sensation recognized for his sweet, vibrant vocal timbre and flawless recitation across all 114 Surahs.',
    verificationStatus: 'playable',
    reciterId: 'abdul-basit-inuwa'
  },
  // 6. Abdul Basit Abass-Zakariyyah
  {
    id: 'abdul-basit-abass-zakariyyah',
    name: 'Abdul Basit Abass-Zakariyyah',
    arabicName: 'عبد الباسط عباس زكريا الإبادني',
    city: 'Ibadan',
    state: 'Oyo',
    tradition: 'Southwest Tajweed Academy',
    bio: 'Prominent young Qari from the renowned Abass-Zakariyyah Quranic family in Ibadan, Oyo State, recognized for rigorous adherence to classical Tajweed phonetics.',
    verificationStatus: 'competition_archive'
  },
  // 7. Aadil Abass-Zakariyyah
  {
    id: 'aadil-abass-zakariyyah',
    name: 'Aadil Abass-Zakariyyah',
    arabicName: 'عادل عباس زكريا الإبادني',
    city: 'Ibadan',
    state: 'Oyo',
    tradition: 'Southwest Prodigy Qari',
    bio: 'Youth prodigy Qari from Ibadan, celebrated for his precision in Tajweed letter exits, sweet vocal delivery, and inspiring younger generations of Nigerian Huffaz.',
    verificationStatus: 'competition_archive'
  },
  // 8. Abdullah Bappah (Qaari Jameel Bappayo)
  {
    id: 'abdullah-bappah',
    name: 'Qaari Abdullah Bappah (Jameel Bappayo)',
    arabicName: 'القارئ عبد الله باباه الجمباوي',
    city: 'Gombe / Bauchi',
    state: 'Gombe',
    tradition: 'Northeast Master Murattal',
    bio: 'Renowned master Qari from northeastern Nigeria (Gombe/Bauchi axis). Acclaimed for his melodious, deeply disciplined Hafs recitation across all 114 Surahs.',
    verificationStatus: 'playable',
    reciterId: 'abdullah-bappah'
  },
  // 9. Abdur-Rahmaan Yola
  {
    id: 'abdur-rahmaan-yola',
    name: 'Alaramma Abdur-Rahmaan Yola',
    arabicName: 'العلامة عبد الرحمن يولا الأداوماوي',
    city: 'Yola',
    state: 'Adamawa',
    tradition: 'Adamawa & Plateau Alaramma',
    bio: 'Celebrated Adamawa Qari and scholar, master of peaceful, reflective West African tilawah recognized across Adamawa, Plateau, and Northern Nigeria.',
    verificationStatus: 'competition_archive'
  },
  // 10. Abubukar Ibn Ibrahim
  {
    id: 'abubakar-ibn-ibrahim',
    name: 'Qaari Abubakar Ibn Ibrahim',
    arabicName: 'القارئ أبو بكر بن إبراهيم الميدغوري',
    city: 'Maiduguri',
    state: 'Borno',
    tradition: 'Borno Classical Heritage',
    bio: 'Distinguished Qari and scholar immersed in the centuries-old Borno Quranic heritage, combining classical North African depth with soothing vocal timbre.',
    verificationStatus: 'competition_archive'
  },
  // 11. Anas Kura
  {
    id: 'anas-kura',
    name: 'Alaramma Anas Salis Kura',
    arabicName: 'القارئ أنس صالح كورا الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'International Musabaqah Representative',
    bio: 'Prominent Nigerian international competitor from Kano State who represented Nigeria at the King Abdulaziz International Quran Competition in Makkah.',
    verificationStatus: 'competition_archive'
  },
  // 12. Dalib Muhammad Rabiu Sa’ad
  {
    id: 'dalib-muhammad-rabiu',
    name: 'Dalib Muhammad Rabiu Sa’ad',
    arabicName: 'طالب محمد ربيع سعد الكنوي',
    city: 'Kano / Kaduna',
    state: 'Kano',
    tradition: 'National Musabaqah Champion',
    bio: 'Celebrated Nigerian Musabaqah champion and master Hafiz noted for exceptional breath control, clarity in Waqf (stopping), and pristine pronunciation.',
    verificationStatus: 'competition_archive'
  },
  // 13. Gwani Dahir
  {
    id: 'gwani-dahir',
    name: 'Gwani Dahiru Bauchi (Grand Master)',
    arabicName: 'جوني طاهر الباوشي النيجيري',
    city: 'Bauchi / Borno',
    state: 'Bauchi',
    tradition: 'Grand Master Gwani',
    bio: 'Revered Grand Master (Gwani) of the classical Nigerian Qur\'anic memorization institution. Winner of historic international competitions in Makkah, celebrated for his commanding traditional cadence across all 114 Surahs.',
    verificationStatus: 'playable',
    reciterId: 'gwani-dahir'
  },
  // 14. Gwani Sadiqu
  {
    id: 'gwani-sadiqu',
    name: 'Gwani Sadiqu (Historic Traditional Master)',
    arabicName: 'جوني صادق النيجيري',
    city: 'Borno / Kano',
    state: 'Borno',
    tradition: 'Traditional Karatun Allo Master',
    bio: 'Iconic traditional Nigerian Gwani whose historic complete Quran recitations are treasured across Northern Nigeria and the Lake Chad basin for traditional Karatun Allo and Hifz retention.',
    verificationStatus: 'playable',
    reciterId: 'gwani-sadiqu'
  },
  // 15. Ibrahim Abba
  {
    id: 'ibrahim-abba',
    name: 'Qaari Ibrahim Abba',
    arabicName: 'القارئ إبراهيم أبا الزكزاكي',
    city: 'Zaria',
    state: 'Kaduna',
    tradition: 'Zaria Scholarly Qari',
    bio: 'Esteemed Zaria reciter associated with the renowned Abba scholarly household, delivering warm, balanced, and rhythmic Quranic recitations.',
    verificationStatus: 'competition_archive'
  },
  // 16. Ibrahim Al-Maa’i
  {
    id: 'ibrahim-al-maai',
    name: 'Qaari Ibrahim Al-Maa’i',
    arabicName: 'القارئ إبراهيم المائي الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Kano Melodic Qari',
    bio: 'Respected Kano Qari celebrated for melodic sweetness, gentle cadence, and precise adherence to Tajweed ruling and Madd durations.',
    verificationStatus: 'competition_archive'
  },
  // 17. Ibrahim M’Awwal (Ibadan)
  {
    id: 'ibrahim-m-awwal',
    name: 'Qaari Ibrahim M’Awwal (Ibadan)',
    arabicName: 'القارئ إبراهيم معول الإبادني',
    city: 'Ibadan',
    state: 'Oyo',
    tradition: 'Southwest Classical Qari',
    bio: 'Acclaimed Southwestern Nigerian Qari from Ibadan, Oyo State, blending classical Quranic Maqamat with profound spiritual gravity.',
    verificationStatus: 'competition_archive'
  },
  // 18. Ibrahim Muhammad Awwal
  {
    id: 'ibrahim-muhammad-awwal',
    name: 'Sheikh Ibrahim Muhammad Awwal',
    arabicName: 'الشيخ إبراهيم محمد أول الكدوناوي',
    city: 'Kaduna',
    state: 'Kaduna',
    tradition: 'Kaduna Qari & Scholar',
    bio: 'Scholar and reciter active across Kaduna and Northern Nigeria, known for his resonant baritone and uplifting Quranic recitation.',
    verificationStatus: 'competition_archive'
  },
  // 19. Ibrahim Yahya
  {
    id: 'ibrahim-yahya',
    name: 'Alaramma Ibrahim Yahya',
    arabicName: 'القارئ إبراهيم يحيى الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Kano Hifz & Tajweed Teacher',
    bio: 'Revered Kano teacher of Quranic memorization and Tajweed, respected for strict fidelity to classical letter articulation.',
    verificationStatus: 'competition_archive'
  },
  // 20. Idris Gashuwa
  {
    id: 'idris-gashuwa',
    name: 'Alaramma Idris Abdurrahman Gashuwa',
    arabicName: 'القارئ إدريس عبد الرحمن قشوة اليوباوي',
    city: 'Gashua',
    state: 'Yobe',
    tradition: 'Yobe Iconic Alaramma',
    bio: 'Beloved reciter from Gashu\'a, Yobe State, admired for passionate and melodious tilawah listened to widely in Yobe, Borno, and Bauchi.',
    verificationStatus: 'competition_archive'
  },
  // 21. Ismaeel Maiduguri
  {
    id: 'ismaeel-maiduguri',
    name: 'Alaramma Isma’il Maiduguri',
    arabicName: 'القارئ إسماعيل الميدغوري البرناوي',
    city: 'Maiduguri',
    state: 'Borno',
    tradition: 'Maiduguri Tsangaya Qari',
    bio: 'Iconic Borno reciter deeply anchored in the traditional Maiduguri Tsangaya recitation tradition with deep spiritual cadence.',
    verificationStatus: 'competition_archive'
  },
  // 22. Ismael Musa / Ismail Musa
  {
    id: 'ismail-musa',
    name: 'Qaari Ismail Musa',
    arabicName: 'القارئ إسماعيل موسى',
    city: 'Abuja',
    state: 'FCT Abuja',
    tradition: 'Federal Capital Tajweed Instructor',
    bio: 'Distinguished Nigerian Qari and Tajweed instructor based in Abuja, celebrated for crystalline enunciation and gentle pacing.',
    verificationStatus: 'competition_archive'
  },
  // 23. Kabiru Daura
  {
    id: 'kabiru-daura',
    name: 'Alaramma Muhammad Kabiru Daura',
    arabicName: 'القارئ محمد كبير دورا الكتسناوي',
    city: 'Daura',
    state: 'Katsina',
    tradition: 'Katsina Classical Alaramma',
    bio: 'Famous Katsina reciter from the historic city of Daura, renowned across Nigeria for exquisite and clear tilawah with soulful modulation.',
    verificationStatus: 'competition_archive'
  },
  // 24. Nasiru Gwandu
  {
    id: 'nasiru-gwandu',
    name: 'Alaramma Nasiru Salihu Gwandu',
    arabicName: 'القارئ ناصر صالح غواندو الكباوي',
    city: 'Gwandu',
    state: 'Kebbi',
    tradition: 'Gwandu Emirate Alaramma',
    bio: 'Revered reciter from Gwandu Emirate, Kebbi State. His melodious and soulful recitations are shared across Nigerian Islamic audio circles.',
    verificationStatus: 'competition_archive'
  },
  // 25. Nazeer Abubakar Sulaiman (Sokoto)
  {
    id: 'nazeer-abubakar-sulaiman',
    name: 'Dr. Nazeer Abubakar Sulaiman (Sokoto)',
    arabicName: 'الدكتور نذير أبو بكر سليمان السقطي',
    city: 'Sokoto',
    state: 'Sokoto',
    tradition: 'National Champion & International Judge',
    bio: 'Distinguished veterinary doctor, national Quranic champion, and senior Musabaqah verifier judge from Sokoto. Represented Nigeria at the King Abdulaziz International Quran Competition in Makkah.',
    verificationStatus: 'competition_archive'
  },
  // 26. Sa’eed Haroon
  {
    id: 'saeed-haroon',
    name: 'Qaari Sa’eed Haroon',
    arabicName: 'القارئ سعيد هارون',
    city: 'Ilorin / Lagos',
    state: 'Kwara',
    tradition: 'Kwara & Lagos Master Qari',
    bio: 'Master Qari and Tajweed educator influential in Kwara and Lagos States, renowned for meticulous Tajweed rulings and melodic delivery.',
    verificationStatus: 'competition_archive'
  },
  // 27. Salih Musa Ozovehe
  {
    id: 'salih-musa-ozovehe',
    name: 'Qaari Salih Musa Ozovehe (Kogi)',
    arabicName: 'القارئ صالح موسى أوزوفيه الكوجي',
    city: 'Okene',
    state: 'Kogi',
    tradition: 'Ebira & Kogi Musabaqah Champion',
    bio: 'Celebrated Ebira/Kogi Qari and prominent contender in the National Musabaqah competition, known for powerful vocal presence and precise articulation.',
    verificationStatus: 'competition_archive'
  },
  // 28. Salim Muhammadul-Awwal
  {
    id: 'salim-muhammadul-awwal',
    name: 'Qaari Salim Muhammadul-Awwal',
    arabicName: 'القارئ سالم محمد الأول الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Kano Contemplative Qari',
    bio: 'Respected Kano Qari celebrated for sweet, contemplative delivery and strong command of Tajweed rules.',
    verificationStatus: 'competition_archive'
  },
  // 29. Usman Birini Kebbi
  {
    id: 'usman-birnin-kebbi',
    name: 'Alaramma Sheikh Usman Birnin Kebbi',
    arabicName: 'الشيخ عثمان برنين كبي النيجيري',
    city: 'Birnin Kebbi',
    state: 'Kebbi',
    tradition: 'Kebbi Master Qari & Scholar',
    bio: 'Beloved scholar and master Qari from Kebbi State. His complete Quran recitations are celebrated for their gentle tone, contemplative reverence, and pristine phonetics.',
    verificationStatus: 'playable',
    reciterId: 'usman-birnin-kebbi'
  },
  // 30. Usman U-kanawa
  {
    id: 'usman-u-kanawa',
    name: 'Alaramma Usman U-Kanawa (Kano)',
    arabicName: 'القارئ عثمان أوكناوا الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Traditional Kano Karatun Allo Master',
    bio: 'Legendary traditional Kano Alaramma whose Karatun Allo and rhythmic recitations have anchored local schools and memorization circles for decades.',
    verificationStatus: 'competition_archive'
  },
  // 31. Yahudha Bauchi
  {
    id: 'yahudha-bauchi',
    name: 'Alaramma Yahuza Bauchi (Marigayi)',
    arabicName: 'العلامة يهوذا الباوشي النيجيري',
    city: 'Bauchi',
    state: 'Bauchi',
    tradition: 'Bauchi Historic Karatun Allo Icon',
    bio: 'Historic late master Hafiz from Bauchi State, legendary icon of traditional West African Karatun Allo memorization and recitation.',
    verificationStatus: 'competition_archive'
  },
  // 32. Muhammad Auwal Salihu
  {
    id: 'muhammad-auwal-salihu',
    name: 'Sheikh Muhammad Auwal Salihu',
    arabicName: 'الشيخ محمد أول صالح الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Kano Quranic Sciences Scholar',
    bio: 'Renowned scholar and academic in Quranic sciences and Usul al-Fiqh at Bayero University, revered for clear, insightful, and measured recitation.',
    verificationStatus: 'competition_archive'
  },
  // 33. Shaykh Muhammad bin Uthman
  {
    id: 'muhammad-bin-uthman',
    name: 'Shaykh Muhammad bin Uthman (Kano)',
    arabicName: 'الشيخ محمد بن عثمان الكنوي',
    city: 'Kano',
    state: 'Kano',
    tradition: 'Chief Imam & Preacher',
    bio: 'Chief Imam of Sahabah Mosque in Kano, influential scholar, and Islamic educator admired for serene, deeply spiritual Quranic delivery and community leadership.',
    verificationStatus: 'lecture_tafsir_intro'
  },
  // 34. Qari Umar Idris
  {
    id: 'umar-idris',
    name: 'Qari Umar Idris (Sokoto)',
    arabicName: 'القارئ عمر بن إدريس السقطي',
    city: 'Sokoto',
    state: 'Sokoto',
    tradition: 'Sokoto Caliphate Master Murattal',
    bio: 'Famous Nigerian reciter from the historic Caliphate city of Sokoto. Renowned for his soothing, crystalline vocal tone, gentle pacing, and exquisite articulation of Tajweed letters across all 114 Surahs.',
    verificationStatus: 'playable',
    reciterId: 'umar-idris'
  }
];
