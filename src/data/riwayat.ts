import { RiwayahMeta, RiwayahId } from '../types/quran';

/**
 * The 20 Canonical Riwayat of the Holy Qur'an
 * Corresponding to the Ten Mutawatir Qira'at (Two Riwayat per Imam).
 * 
 * Note: Ad-Duri appears as two distinct entries:
 * 1. Ad-Duri from Abu 'Amr al-Basri (الدوري عن أبي عمرو)
 * 2. Ad-Duri from Al-Kisa'i al-Kufi (الدوري عن الكسائي)
 */
export const RIWAYAT: RiwayahMeta[] = [
  {
    id: 'qalun',
    orderNumber: 1,
    nameEnglish: 'Qalun',
    nameArabic: 'قالون',
    transliteration: "Qālūn 'an Nāfi'",
    qiraahId: 'nafi',
    qiraahNameEnglish: "Qira'ah of Nafi' al-Madani",
    qiraahNameArabic: 'قراءة نافع المدني',
    description: "Narrated by Imam Abu Musa 'Isa ibn Mina (Qalun, d. 220 AH) from Imam Nafi' of Madinah. Prominent across Libya, Tunisia, and parts of Chad.",
    historicalRegion: 'Madinah / Libya & Tunisia'
  },
  {
    id: 'warsh',
    orderNumber: 2,
    nameEnglish: 'Warsh',
    nameArabic: 'ورش',
    transliteration: "Warsh 'an Nāfi'",
    qiraahId: 'nafi',
    qiraahNameEnglish: "Qira'ah of Nafi' al-Madani",
    qiraahNameArabic: 'قراءة نافع المدني',
    description: "Narrated by Imam 'Uthman ibn Sa'id al-Qubti (Warsh, d. 197 AH) from Imam Nafi' of Madinah. The primary historical reading of North and West Africa (Morocco, Algeria, Mauritania, Nigeria, Senegal, Mali).",
    historicalRegion: 'North & West Africa'
  },
  {
    id: 'al_bazzi',
    orderNumber: 3,
    nameEnglish: 'Al-Bazzi',
    nameArabic: 'البزي',
    transliteration: "Al-Bazzī 'an Ibn Kathīr",
    qiraahId: 'ibn_kathir',
    qiraahNameEnglish: "Qira'ah of Ibn Kathir al-Makki",
    qiraahNameArabic: 'قراءة ابن كثير المكي',
    description: "Narrated by Ahmad ibn Muhammad al-Bazzi (d. 250 AH), the Mu'adhdhin of Masjid al-Haram in Makkah, transmitting the Makkan Qira'ah of Imam 'Abdullah ibn Kathir.",
    historicalRegion: 'Makkah al-Mukarramah'
  },
  {
    id: 'qunbul',
    orderNumber: 4,
    nameEnglish: 'Qunbul',
    nameArabic: 'قنبل',
    transliteration: "Qunbul 'an Ibn Kathīr",
    qiraahId: 'ibn_kathir',
    qiraahNameEnglish: "Qira'ah of Ibn Kathir al-Makki",
    qiraahNameArabic: 'قراءة ابن كثير المكي',
    description: "Narrated by Muhammad ibn 'Abd al-Rahman (Qunbul, d. 291 AH), senior Sheikh of the reciters of the Hijaz, from Imam Ibn Kathir al-Makki.",
    historicalRegion: 'Makkah & Hijaz'
  },
  {
    id: 'ad_duri_abu_amr',
    orderNumber: 5,
    nameEnglish: 'Ad-Duri from Abu Amr',
    nameArabic: 'الدوري عن أبي عمرو',
    transliteration: "Al-Dūrī 'an Abī 'Amr",
    qiraahId: 'abu_amr',
    qiraahNameEnglish: "Qira'ah of Abu 'Amr al-Basri",
    qiraahNameArabic: 'قراءة أبي عمرو البصري',
    description: "Transmitted by Hafs ibn 'Umar al-Duri (d. 246 AH) from Imam Abu 'Amr Zabban ibn al-'Ala of Basra. Renowned across Sudan, Somalia, Chad, and the West African Sahel for its melodic and pentatonic recitation traditions.",
    historicalRegion: 'Basra / Sudan, Somalia & Sahel'
  },
  {
    id: 'as_susi',
    orderNumber: 6,
    nameEnglish: 'As-Susi',
    nameArabic: 'السوسي',
    transliteration: "Al-Sūsī 'an Abī 'Amr",
    qiraahId: 'abu_amr',
    qiraahNameEnglish: "Qira'ah of Abu 'Amr al-Basri",
    qiraahNameArabic: 'قراءة أبي عمرو البصري',
    description: "Transmitted by Salih ibn Ziyad al-Susi (d. 261 AH) from Imam Abu 'Amr al-Basri. Famous for the major assimilation (Idgham Kabir) rules and distinctive phonetic elegance.",
    historicalRegion: 'Basra / Central Asia'
  },
  {
    id: 'hisham',
    orderNumber: 7,
    nameEnglish: 'Hisham',
    nameArabic: 'هشام',
    transliteration: "Hishām 'an Ibn 'Āmir",
    qiraahId: 'ibn_amir',
    qiraahNameEnglish: "Qira'ah of Ibn 'Amir ash-Shami",
    qiraahNameArabic: 'قراءة ابن عامر الشامي',
    description: "Transmitted by Hisham ibn 'Ammar (d. 245 AH), the Khatib of the Umayyad Grand Mosque in Damascus, from Imam 'Abdullah ibn 'Amir al-Dimashqi.",
    historicalRegion: 'Damascus & Levant (Bilad al-Sham)'
  },
  {
    id: 'ibn_dhakwan',
    orderNumber: 8,
    nameEnglish: 'Ibn Dhakwan',
    nameArabic: 'ابن ذكوان',
    transliteration: "Ibn Dhakwān 'an Ibn 'Āmir",
    qiraahId: 'ibn_amir',
    qiraahNameEnglish: "Qira'ah of Ibn 'Amir ash-Shami",
    qiraahNameArabic: 'قراءة ابن عامر الشامي',
    description: "Transmitted by 'Abdullah ibn Ahmad ibn Dhakwan (d. 242 AH), Imam of the Umayyad Mosque, from Imam Ibn 'Amir ash-Shami.",
    historicalRegion: 'Damascus & Levant'
  },
  {
    id: 'shubah',
    orderNumber: 9,
    nameEnglish: "Shu'bah",
    nameArabic: 'شعبة',
    transliteration: "Shu'bah 'an 'Āsim",
    qiraahId: 'asim',
    qiraahNameEnglish: "Qira'ah of 'Asim al-Kufi",
    qiraahNameArabic: 'قراءة عاصم الكوفي',
    description: "Transmitted by Abu Bakr Shu'bah ibn 'Ayyash (d. 193 AH) from Imam 'Asim ibn Abi al-Najud al-Kufi. Studied extensively across Islamic universities alongside Hafs.",
    historicalRegion: 'Kufa / Iraq'
  },
  {
    id: 'hafs',
    orderNumber: 10,
    nameEnglish: 'Hafs',
    nameArabic: 'حفص',
    transliteration: "Hafs 'an 'Āsim",
    qiraahId: 'asim',
    qiraahNameEnglish: "Qira'ah of 'Asim al-Kufi",
    qiraahNameArabic: 'قراءة عاصم الكوفي',
    description: "Transmitted by Hafs ibn Sulayman al-Kufi (d. 180 AH) from Imam 'Asim. Today the most widely printed and recited Riwayah globally (over 90% of the Muslim world, including Nigeria, Egypt, Saudi Arabia, Pakistan, Turkey, and Indonesia).",
    historicalRegion: 'Kufa / Worldwide'
  },
  {
    id: 'khalaf_hamzah',
    orderNumber: 11,
    nameEnglish: 'Khalaf from Hamzah',
    nameArabic: 'خلف عن حمزة',
    transliteration: "Khalaf 'an Hamzah",
    qiraahId: 'hamzah',
    qiraahNameEnglish: "Qira'ah of Hamzah al-Kufi",
    qiraahNameArabic: 'قراءة حمزة الكوفي',
    description: "Transmitted by Khalaf ibn Hisham al-Bazzar (d. 229 AH) from Imam Hamzah ibn Habib al-Zayyat of Kufa. Celebrated for deep Sakt (pauses), Imalah, and classical elongation.",
    historicalRegion: 'Kufa'
  },
  {
    id: 'khallad',
    orderNumber: 12,
    nameEnglish: 'Khallad',
    nameArabic: 'خلاد',
    transliteration: "Khallād 'an Hamzah",
    qiraahId: 'hamzah',
    qiraahNameEnglish: "Qira'ah of Hamzah al-Kufi",
    qiraahNameArabic: 'قراءة حمزة الكوفي',
    description: "Transmitted by Khallad ibn Khalid al-Sayrafi (d. 220 AH) from Imam Hamzah al-Kufi. A major rigorous Kufan transmission with distinctive Tajweed stop rules.",
    historicalRegion: 'Kufa'
  },
  {
    id: 'abu_al_harith',
    orderNumber: 13,
    nameEnglish: 'Abu al-Harith',
    nameArabic: 'أبو الحارث',
    transliteration: "Abū al-Hārith 'an al-Kisā'ī",
    qiraahId: 'kisai',
    qiraahNameEnglish: "Qira'ah of Al-Kisa'i al-Kufi",
    qiraahNameArabic: 'قراءة الكسائي الكوفي',
    description: "Transmitted by Al-Layth ibn Khalid (Abu al-Harith, d. 240 AH) from Imam 'Ali ibn Hamzah al-Kisa'i, chief grammarian of Kufa and master of Arabic syntax.",
    historicalRegion: 'Kufa & Baghdad'
  },
  {
    id: 'ad_duri_kisai',
    orderNumber: 14,
    nameEnglish: "Ad-Duri from al-Kisa'i",
    nameArabic: 'الدوري عن الكسائي',
    transliteration: "Al-Dūrī 'an al-Kisā'ī",
    qiraahId: 'kisai',
    qiraahNameEnglish: "Qira'ah of Al-Kisa'i al-Kufi",
    qiraahNameArabic: 'قراءة الكسائي الكوفي',
    description: "Transmitted by Hafs ibn 'Umar al-Duri from Imam Al-Kisa'i al-Kufi. Al-Duri was the master narrator who transmitted from two distinct Imams (Abu 'Amr and Al-Kisa'i), recorded here with Al-Kisa'i's phonetics and Imalat.",
    historicalRegion: 'Kufa & Baghdad'
  },
  {
    id: 'ibn_wardan',
    orderNumber: 15,
    nameEnglish: 'Ibn Wardan',
    nameArabic: 'ابن وردان',
    transliteration: "Ibn Wardān 'an Abī Ja'far",
    qiraahId: 'abu_jafar',
    qiraahNameEnglish: "Qira'ah of Abu Ja'far al-Madani",
    qiraahNameArabic: 'قراءة أبي جعفر المدني',
    description: "Transmitted by 'Isa ibn Wardan al-Madani (d. 160 AH) from Imam Abu Ja'far Yazid ibn al-Qa'qa', the teacher of Imam Nafi' and premier reciter of the Prophet's Mosque.",
    historicalRegion: 'Madinah al-Munawwarah'
  },
  {
    id: 'ibn_jammaz',
    orderNumber: 16,
    nameEnglish: 'Ibn Jammaz',
    nameArabic: 'ابن جماز',
    transliteration: "Ibn Jammāz 'an Abī Ja'far",
    qiraahId: 'abu_jafar',
    qiraahNameEnglish: "Qira'ah of Abu Ja'far al-Madani",
    qiraahNameArabic: 'قراءة أبي جعفر المدني',
    description: "Transmitted by Sulayman ibn Muslim ibn Jammaz (d. 170 AH) from Imam Abu Ja'far al-Madani, preserving early Madinan vocal traditions and Tashil of hamzat.",
    historicalRegion: 'Madinah al-Munawwarah'
  },
  {
    id: 'ruways',
    orderNumber: 17,
    nameEnglish: 'Ruways',
    nameArabic: 'رويس',
    transliteration: "Ruways 'an Ya'qūb",
    qiraahId: 'yaqub',
    qiraahNameEnglish: "Qira'ah of Ya'qub al-Hadrami",
    qiraahNameArabic: 'قراءة يعقوب الحضرمي',
    description: "Transmitted by Muhammad ibn al-Mutawakkil (Ruways, d. 238 AH) from Imam Ya'qub ibn Ishaq al-Hadrami of Basra. Famous for Haa al-Sakt and classical Basran eloquence.",
    historicalRegion: 'Basra & Yemen'
  },
  {
    id: 'rawh',
    orderNumber: 18,
    nameEnglish: 'Rawh',
    nameArabic: 'روح',
    transliteration: "Rawh 'an Ya'qūb",
    qiraahId: 'yaqub',
    qiraahNameEnglish: "Qira'ah of Ya'qub al-Hadrami",
    qiraahNameArabic: 'قراءة يعقوب الحضرمي',
    description: "Transmitted by Rawh ibn 'Abd al-Mu'min al-Basri (d. 234 AH) from Imam Ya'qub al-Hadrami. Distinguished by grammatical precision and vocal clarity.",
    historicalRegion: 'Basra'
  },
  {
    id: 'ishaq_al_warraq',
    orderNumber: 19,
    nameEnglish: 'Ishaq al-Warraq',
    nameArabic: 'إسحاق الوراق',
    transliteration: "Ishāq al-Warrāq 'an Khalaf",
    qiraahId: 'khalaf_tenth',
    qiraahNameEnglish: "Qira'ah of Khalaf al-Bazzar (The Tenth)",
    qiraahNameArabic: 'قراءة خلف العاشر',
    description: "Transmitted by Ishaq ibn Ibrahim al-Warraq (d. 286 AH) from Imam Khalaf ibn Hisham al-Bazzar in his independent Qira'ah as the Tenth Imam.",
    historicalRegion: 'Baghdad'
  },
  {
    id: 'idris_al_haddad',
    orderNumber: 20,
    nameEnglish: 'Idris al-Haddad',
    nameArabic: 'إدريس الحداد',
    transliteration: "Idrīs al-Haddād 'an Khalaf",
    qiraahId: 'khalaf_tenth',
    qiraahNameEnglish: "Qira'ah of Khalaf al-Bazzar (The Tenth)",
    qiraahNameArabic: 'قراءة خلف العاشر',
    description: "Transmitted by Idris ibn 'Abd al-Karim al-Haddad (d. 292 AH) from Imam Khalaf al-Bazzar in his independent Qira'ah (Khalaf al-'Ashir).",
    historicalRegion: 'Baghdad'
  }
];

export function getRiwayahById(id: RiwayahId | string): RiwayahMeta | undefined {
  return RIWAYAT.find(r => r.id === id);
}
