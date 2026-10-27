import { Ayah } from '../types/quran';

/**
 * Pre-cached core surah verses with high-fidelity Uthmani text, transliteration,
 * translation, and Tajweed notes.
 */
export const PRELOADED_SURAHS: Record<number, Ayah[]> = {
  1: [
    {
      number: 1,
      numberInSurah: 1,
      textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      transliteration: 'Bismillaahir-Rahmaanir-Raheem',
      tajweedNotes: ['Tarqeeq on Lam in Allah', 'Tafkheem on Raa', 'Madd Arid li-s-Sukoon on final word']
    },
    {
      number: 2,
      numberInSurah: 2,
      textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: '[All] praise is [due] to Allah, Lord of the worlds -',
      transliteration: 'Alhamdu lillaahi Rabbil-`aalameen',
      tajweedNotes: ['Izhar of Lam Qamariyyah', 'Throat letter Haa', 'Madd Arid 2/4/6 counts on al-`Alameen']
    },
    {
      number: 3,
      numberInSurah: 3,
      textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'The Entirely Merciful, the Especially Merciful,',
      transliteration: 'Ar-Rahmaanir-Raheem',
      tajweedNotes: ['Idgham Shamsi without ghunnah', 'Tafkheem on Raa', 'Madd Arid li-s-Sukoon']
    },
    {
      number: 4,
      numberInSurah: 4,
      textArabic: 'مَالِكِ يَوْمِ الدِّينِ',
      translation: 'Sovereign of the Day of Recompense.',
      transliteration: 'Maaliki Yawmid-Deen',
      tajweedNotes: ['Madd Tabee\'ee on Maalik (2 counts)', 'Leen on Yawm', 'Madd Arid on Ad-Deen']
    },
    {
      number: 5,
      numberInSurah: 5,
      textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translation: 'It is You we worship and You we ask for help.',
      transliteration: 'Iyyaaka na`budu wa-iyyaaka nasta`een',
      tajweedNotes: ['Nabrah on Yaa Mushaddadah in Iyyaaka', 'Clear Ayn in na`budu', 'Madd Arid on nasta`een']
    },
    {
      number: 6,
      numberInSurah: 6,
      textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      translation: 'Guide us to the straight path -',
      transliteration: 'Ihdinas-Siraatal-Mustaqeem',
      tajweedNotes: ['Hams on Haa in Ihdina', 'Tafkheem on Saad and Taa in Siraat', 'Madd Arid on al-Mustaqeem']
    },
    {
      number: 7,
      numberInSurah: 7,
      textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
      transliteration: "Siraatal-ladheena an'amta 'alayhim ghayril-maghdoobi 'alayhim wa lad-daaaalleen",
      tajweedNotes: ['Izhar Halqi on An`amta', 'Izhar Shafawi on alayhim', 'Madd Lazim Kalimi (6 mandatory counts) on Dhaalleen']
    }
  ],
  112: [
    {
      number: 6222,
      numberInSurah: 1,
      textArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translation: 'Say, "He is Allah, [who is] One,',
      transliteration: 'Qul Huwal-Laahu Ahad',
      tajweedNotes: ['Tafkheem on Qaf', 'Tafkheem on Lam of Allah', 'Qalqalah Kubra on Daal when stopping']
    },
    {
      number: 6223,
      numberInSurah: 2,
      textArabic: 'اللَّهُ الصَّمَدُ',
      translation: 'Allah, the Eternal Refuge.',
      transliteration: 'Allaahus-Samad',
      tajweedNotes: ['Saad with Safeer and Isti`la', 'Qalqalah Kubra on Daal']
    },
    {
      number: 6224,
      numberInSurah: 3,
      textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      translation: 'He neither begets nor is born,',
      transliteration: 'Lam yalid wa lam yoolad',
      tajweedNotes: ['Izhar Shafawi on Meem Sakinah', 'Qalqalah Sughra on first Daal', 'Qalqalah Kubra on ending Daal']
    },
    {
      number: 6225,
      numberInSurah: 4,
      textArabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      translation: 'Nor is there to Him any equivalent."',
      transliteration: 'Wa lam yakul-lahoo kufuwan ahad',
      tajweedNotes: ['Idgham without Ghunnah on yakul-lahoo', 'Izhar Halqi on kufuwan ahad', 'Qalqalah Kubra on final Daal']
    }
  ],
  113: [
    {
      number: 6226,
      numberInSurah: 1,
      textArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      translation: 'Say, "I seek refuge in the Lord of daybreak',
      transliteration: "Qul a'oodhu bi-Rabbil-falaq",
      tajweedNotes: ['Makhraj of Dhal between teeth', 'Qalqalah Kubra on Qaf']
    },
    {
      number: 6227,
      numberInSurah: 2,
      textArabic: 'مِن شَرِّ مَا خَلَقَ',
      translation: 'From the evil of that which He created',
      transliteration: 'Min sharri maa khalaq',
      tajweedNotes: ['Ikhfa Haqiqi with light ghunnah on min sharri', 'Tafkheem on Kha', 'Qalqalah Kubra on Qaf']
    },
    {
      number: 6228,
      numberInSurah: 3,
      textArabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      translation: 'And from the evil of darkness when it settles',
      transliteration: 'Wa min sharri ghaasiqin idhaa waqab',
      tajweedNotes: ['Izhar Halqi on ghaasiqin idhaa', 'Qalqalah Kubra on Baa']
    },
    {
      number: 6229,
      numberInSurah: 4,
      textArabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      translation: 'And from the evil of the blowers in knots',
      transliteration: 'Wa min sharrin-naffaathaati fil-`uqad',
      tajweedNotes: ['Ghunnah 2 counts on An-Naffaathaat', 'Hams on letter Faa', 'Qalqalah Kubra on Daal']
    },
    {
      number: 6230,
      numberInSurah: 5,
      textArabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      translation: 'And from the evil of an envier when he envies."',
      transliteration: 'Wa min sharri haasidin idhaa hasad',
      tajweedNotes: ['Izhar Halqi on haasidin idhaa', 'Throat letter Haa', 'Qalqalah Kubra on Daal']
    }
  ],
  114: [
    {
      number: 6231,
      numberInSurah: 1,
      textArabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      translation: 'Say, "I seek refuge in the Lord of mankind,',
      transliteration: "Qul a'oodhu bi-Rabbin-naas",
      tajweedNotes: ['Noon Mushaddadah Ghunnah 2 counts', 'Madd Arid li-s-Sukoon', 'Safeer on Seen']
    },
    {
      number: 6232,
      numberInSurah: 2,
      textArabic: 'مَلِكِ النَّاسِ',
      translation: 'The Sovereign of mankind,',
      transliteration: 'Malikin-naas',
      tajweedNotes: ['Ghunnah on An-Naas', 'Rhyme match with verse 1']
    },
    {
      number: 6233,
      numberInSurah: 3,
      textArabic: 'إِلَٰهِ النَّاسِ',
      translation: 'The God of mankind,',
      transliteration: 'Ilaahin-naas',
      tajweedNotes: ['Madd Tabee\'ee on Ilaah', 'Ghunnah on An-Naas']
    },
    {
      number: 6234,
      numberInSurah: 4,
      textArabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      translation: 'From the evil of the retreating whisperer -',
      transliteration: 'Min sharril-waswaasil-khannaas',
      tajweedNotes: ['Ikhfa on Min sharri', 'Tafkheem on Khaa', 'Ghunnah on Noon of Al-Khannaas']
    },
    {
      number: 6235,
      numberInSurah: 5,
      textArabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      translation: 'Who whispers [evil] into the breasts of mankind -',
      transliteration: 'Alladhee yuwaswisu fee sudoorin-naas',
      tajweedNotes: ['Tafkheem on Saad in Sudoor', 'Tarqeeq on Raa with Kasrah', 'Ghunnah on An-Naas']
    },
    {
      number: 6236,
      numberInSurah: 6,
      textArabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      translation: 'From among the jinn and mankind."',
      transliteration: 'Minal-jinnati wan-naas',
      tajweedNotes: ['Ghunnah on Jinnah', 'Ghunnah on An-Naas', 'Concluding rhyme of the Quran']
    }
  ],
  103: [
    {
      number: 6177,
      numberInSurah: 1,
      textArabic: 'وَالْعَصْرِ',
      translation: 'By time,',
      transliteration: "Wal-'Asr",
      tajweedNotes: ['Tafkheem on Saad with Safeer', 'Tafkheem on Raa when stopping']
    },
    {
      number: 6178,
      numberInSurah: 2,
      textArabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
      translation: 'Indeed, mankind is in loss,',
      transliteration: "Innal-insaana lafee khusr",
      tajweedNotes: ['Ghunnah on Inna', 'Ikhfa on Insaan', 'Tafkheem on Khaa and Raa']
    },
    {
      number: 6179,
      numberInSurah: 3,
      textArabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
      translation: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
      transliteration: "Illal-ladheena aamanoo wa 'amilus-saalihaati wa tawaasaw bil-haqqi wa tawaasaw bis-sabr",
      tajweedNotes: ['Madd Badal on Aamanoo', 'Qalqalah Kubra on Haqq and Sabr']
    }
  ],
  108: [
    {
      number: 6197,
      numberInSurah: 1,
      textArabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      translation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
      transliteration: "Innaaa a'taynaakal-Kawthar",
      tajweedNotes: ['Ghunnah on Inna', 'Madd Munfasil (2/4/5 counts)', 'Tafkheem on Taa', 'Tafkheem on final Raa']
    },
    {
      number: 6198,
      numberInSurah: 2,
      textArabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      translation: 'So pray to your Lord and sacrifice [to Him alone].',
      transliteration: 'Fasalli li-Rabbika wanhar',
      tajweedNotes: ['Tafkheem on Saad', 'Izhar Halqi on Wanhar', 'Raa Tafkheem']
    },
    {
      number: 6199,
      numberInSurah: 3,
      textArabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
      translation: 'Indeed, your enemy is the one cut off.',
      transliteration: 'Inna shaani-aka huwal-abtar',
      tajweedNotes: ['Ghunnah on Inna', 'Qalqalah Sughra on Baa in Al-Abtar']
    }
  ]
};
