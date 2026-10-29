import { JUZ_LIST, getJuzForPage } from '../data/mushafData';
import { SURAHS, getSurahById } from '../data/surahs';

export interface PageAyah {
  number: number;
  numberInSurah: number;
  textArabic: string;
  translation?: string;
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  revelationType: string;
  juz: number;
  page: number;
  hizbQuarter?: number;
}

export interface MushafPageContent {
  pageNumber: number;
  juzNumber: number;
  juzNameArabic: string;
  primarySurahNameArabic: string;
  primarySurahNameEnglish: string;
  surahsOnPage: {
    number: number;
    nameArabic: string;
    nameEnglish: string;
    revelationType: string;
    versesCount: number;
    startsOnThisPage: boolean;
  }[];
  ayahs: PageAyah[];
}

const pageCache: Record<number, MushafPageContent> = {};

/**
 * Fetch text content of a specific Mushaf page (1-604)
 * Combines Arabic Uthmani text with English translation.
 */
export async function fetchMushafPage(pageNumber: number): Promise<MushafPageContent> {
  const page = Math.max(1, Math.min(604, pageNumber));

  if (pageCache[page]) {
    return pageCache[page];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    // Fetch Uthmani Arabic text and English translation in parallel
    const [arRes, enRes] = await Promise.allSettled([
      fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`, { signal: controller.signal }),
      fetch(`https://api.alquran.cloud/v1/page/${page}/en.sahih`, { signal: controller.signal })
    ]);
    clearTimeout(timeout);

    let arData: any = null;
    let enData: any = null;

    if (arRes.status === 'fulfilled' && arRes.value.ok) {
      arData = await arRes.value.json();
    }
    if (enRes.status === 'fulfilled' && enRes.value.ok) {
      enData = await enRes.value.json();
    }

    if (arData && arData.code === 200 && arData.data && Array.isArray(arData.data.ayahs)) {
      const enAyahsMap = new Map<number, string>();
      if (enData && enData.code === 200 && enData.data && Array.isArray(enData.data.ayahs)) {
        enData.data.ayahs.forEach((a: any) => {
          enAyahsMap.set(a.number, a.text);
        });
      }

      const juzInfo = getJuzForPage(page);
      const surahsMap = new Map<number, {
        number: number;
        nameArabic: string;
        nameEnglish: string;
        revelationType: string;
        versesCount: number;
        startsOnThisPage: boolean;
      }>();

      const ayahs: PageAyah[] = arData.data.ayahs.map((ar: any) => {
        const sMeta = getSurahById(ar.surah.number);
        const startsOnThisPage = ar.numberInSurah === 1;

        if (!surahsMap.has(ar.surah.number)) {
          surahsMap.set(ar.surah.number, {
            number: ar.surah.number,
            nameArabic: sMeta?.nameArabic || ar.surah.name,
            nameEnglish: sMeta?.nameEnglish || ar.surah.englishName,
            revelationType: sMeta?.revelationType || ar.surah.revelationType || 'Meccan',
            versesCount: sMeta?.versesCount || ar.surah.numberOfAyahs,
            startsOnThisPage
          });
        } else if (startsOnThisPage) {
          const entry = surahsMap.get(ar.surah.number)!;
          entry.startsOnThisPage = true;
        }

        return {
          number: ar.number,
          numberInSurah: ar.numberInSurah,
          textArabic: ar.text,
          translation: enAyahsMap.get(ar.number) || '',
          surahNumber: ar.surah.number,
          surahNameArabic: sMeta?.nameArabic || ar.surah.name,
          surahNameEnglish: sMeta?.nameEnglish || ar.surah.englishName,
          revelationType: sMeta?.revelationType || ar.surah.revelationType || 'Meccan',
          juz: ar.juz || juzInfo.number,
          page: page,
          hizbQuarter: ar.hizbQuarter
        };
      });

      const surahsList = Array.from(surahsMap.values());
      const primarySurah = surahsList[0] || {
        number: 1,
        nameArabic: 'الفَاتِحَة',
        nameEnglish: 'Al-Fatihah',
        revelationType: 'Meccan',
        versesCount: 7,
        startsOnThisPage: true
      };

      const result: MushafPageContent = {
        pageNumber: page,
        juzNumber: juzInfo.number,
        juzNameArabic: juzInfo.nameArabic,
        primarySurahNameArabic: primarySurah.nameArabic,
        primarySurahNameEnglish: primarySurah.nameEnglish,
        surahsOnPage: surahsList,
        ayahs
      };

      pageCache[page] = result;

      // Silently preload next page in background for seamless transitions
      if (page < 604 && !pageCache[page + 1]) {
        setTimeout(() => fetchMushafPage(page + 1).catch(() => {}), 1500);
      }

      return result;
    }
  } catch (err) {
    console.warn(`Online fetch for Mushaf page ${page} failed, generating fallback:`, err);
  }

  // Graceful offline fallback
  const juz = getJuzForPage(page);
  // Find surah that starts nearest to this page
  let matchedSurah = SURAHS[0];
  for (let i = 0; i < SURAHS.length; i++) {
    if (SURAHS[i].pageStart <= page) {
      matchedSurah = SURAHS[i];
    } else {
      break;
    }
  }

  const fallback: MushafPageContent = {
    pageNumber: page,
    juzNumber: juz.number,
    juzNameArabic: juz.nameArabic,
    primarySurahNameArabic: matchedSurah.nameArabic,
    primarySurahNameEnglish: matchedSurah.nameEnglish,
    surahsOnPage: [{
      number: matchedSurah.id,
      nameArabic: matchedSurah.nameArabic,
      nameEnglish: matchedSurah.nameEnglish,
      revelationType: matchedSurah.revelationType,
      versesCount: matchedSurah.versesCount,
      startsOnThisPage: matchedSurah.pageStart === page
    }],
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        textArabic: `صَفْحَةُ المَصْحَفِ الشَّرِيفِ رَقْم ${page} — سُورَةُ ${matchedSurah.nameArabic}`,
        translation: `Page ${page} of the Holy Quran, Surah ${matchedSurah.nameEnglish}. High-definition scanned facsimile is also available in the viewer.`,
        surahNumber: matchedSurah.id,
        surahNameArabic: matchedSurah.nameArabic,
        surahNameEnglish: matchedSurah.nameEnglish,
        revelationType: matchedSurah.revelationType,
        juz: juz.number,
        page: page
      }
    ]
  };

  pageCache[page] = fallback;
  return fallback;
}
